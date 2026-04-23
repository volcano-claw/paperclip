import { EventEmitter } from "node:events";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockLogActivity = vi.hoisted(() => vi.fn(async () => {}));
const mockCreateArtifact = vi.hoisted(() => vi.fn(async () => ({ id: "artifact-1" })));
const mockDnsLookup = vi.hoisted(() => vi.fn(async () => [{ address: "93.184.216.34", family: 4 }]));
const httpScenario = vi.hoisted(() => ({
  mode: "success" as "success" | "error",
  response: {
    statusCode: 202,
    statusMessage: "Accepted",
    headers: {
      "content-type": "application/json",
      authorization: "Bearer upstream-secret",
    },
    body: JSON.stringify({ ok: true, authorization: "Bearer upstream-secret" }),
  },
  error: new Error("socket hang up"),
  lastOptions: null as Record<string, unknown> | null,
  lastBody: "",
}));
const mockHttpRequest = vi.hoisted(() => vi.fn((options: Record<string, unknown>, callback: (response: EventEmitter & Record<string, unknown>) => void) => {
  httpScenario.lastOptions = options;
  httpScenario.lastBody = "";

  const request = new EventEmitter() as EventEmitter & {
    write: (chunk: Buffer | string) => void;
    end: () => void;
  };

  request.write = (chunk) => {
    httpScenario.lastBody += Buffer.isBuffer(chunk) ? chunk.toString("utf8") : String(chunk);
  };

  request.end = () => {
    queueMicrotask(() => {
      if (httpScenario.mode === "error") {
        request.emit("error", httpScenario.error);
        return;
      }
      const response = new EventEmitter() as EventEmitter & Record<string, unknown>;
      response.statusCode = httpScenario.response.statusCode;
      response.statusMessage = httpScenario.response.statusMessage;
      response.headers = httpScenario.response.headers;
      callback(response);
      queueMicrotask(() => {
        response.emit("data", Buffer.from(httpScenario.response.body));
        response.emit("end");
      });
    });
  };

  return request;
}));

vi.mock("../services/activity-log.js", () => ({
  logActivity: mockLogActivity,
}));

vi.mock("../services/audit-artifacts.js", () => ({
  auditArtifactService: vi.fn(() => ({
    create: mockCreateArtifact,
    getById: vi.fn(),
  })),
}));

vi.mock("node:dns/promises", () => ({
  lookup: mockDnsLookup,
}));

vi.mock("node:http", async () => {
  const actual = await vi.importActual<typeof import("node:http")>("node:http");
  return {
    ...actual,
    request: mockHttpRequest,
  };
});

vi.mock("node:https", async () => {
  const actual = await vi.importActual<typeof import("node:https")>("node:https");
  return {
    ...actual,
    request: mockHttpRequest,
  };
});

import { buildHostServices } from "../services/plugin-host-services.js";

function createEventBusStub() {
  return {
    forPlugin() {
      return {
        emit: vi.fn(),
        subscribe: vi.fn(),
      };
    },
  } as any;
}

describe("plugin http audit", () => {
  beforeEach(() => {
    mockLogActivity.mockClear();
    mockCreateArtifact.mockClear();
    mockDnsLookup.mockClear();
    mockHttpRequest.mockClear();
    httpScenario.mode = "success";
    httpScenario.response = {
      statusCode: 202,
      statusMessage: "Accepted",
      headers: {
        "content-type": "application/json",
        authorization: "Bearer upstream-secret",
      },
      body: JSON.stringify({ ok: true, authorization: "Bearer upstream-secret" }),
    };
    httpScenario.error = new Error("socket hang up");
    httpScenario.lastOptions = null;
    httpScenario.lastBody = "";
  });

  it("writes an audit artifact and activity event for traced outbound plugin fetches", async () => {
    const services = buildHostServices(
      {} as never,
      "plugin-record-id",
      "linear",
      createEventBusStub(),
    );

    const response = await services.http.fetch({
      url: "http://api.example.com/webhooks/notify?token=super-secret",
      init: {
        method: "POST",
        headers: {
          authorization: "Bearer local-secret",
          "content-type": "application/json",
        },
        body: JSON.stringify({ hello: "world", password: "super-secret" }),
      },
      audit: {
        companyId: "company-1",
        entityType: "issue",
        entityId: "issue-1",
        correlationId: "corr-1",
        metadata: {
          authorization: "Bearer local-secret",
          note: "sync outbound webhook",
        },
      },
    });

    expect(response.status).toBe(202);
    expect(response.body).toContain("ok");

    expect(mockCreateArtifact).toHaveBeenCalledWith(expect.objectContaining({
      companyId: "company-1",
      artifactType: "http_exchange",
      redacted: true,
      contentJson: expect.objectContaining({
        request: expect.objectContaining({
          method: "POST",
          url: "http://api.example.com/webhooks/notify",
          headers: expect.objectContaining({
            authorization: "***REDACTED***",
            "content-type": "application/json",
          }),
          body: expect.stringContaining('"password":"***REDACTED***"'),
        }),
        response: expect.objectContaining({
          status: 202,
          statusText: "Accepted",
          headers: expect.objectContaining({
            authorization: "***REDACTED***",
          }),
          body: expect.stringContaining('"authorization":"***REDACTED***"'),
        }),
      }),
    }));

    expect(mockLogActivity).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({
      companyId: "company-1",
      actorType: "plugin",
      actorId: "plugin-record-id",
      action: "http.request",
      status: "success",
      entityType: "issue",
      entityId: "issue-1",
      targetType: "url",
      targetId: "http://api.example.com/webhooks/notify",
      targetLabel: "api.example.com",
      channel: "http",
      direction: "external",
      contentRef: "artifact-1",
      correlationId: "corr-1",
      contentSummary: "POST api.example.com/webhooks/notify → 202",
      details: expect.objectContaining({
        sourcePluginId: "plugin-record-id",
        sourcePluginKey: "linear",
        auditMetadata: expect.objectContaining({
          authorization: "***REDACTED***",
          note: "sync outbound webhook",
        }),
      }),
    }));
  });

  it("logs failed traced outbound plugin fetches as failed audit events", async () => {
    httpScenario.mode = "error";
    httpScenario.error = new Error("upstream unavailable");

    const services = buildHostServices(
      {} as never,
      "plugin-record-id",
      "linear",
      createEventBusStub(),
    );

    await expect(services.http.fetch({
      url: "https://api.example.com/webhooks/notify",
      init: { method: "POST", body: JSON.stringify({ token: "secret" }) },
      audit: {
        companyId: "company-1",
        entityType: "issue",
        entityId: "issue-1",
      },
    })).rejects.toThrow("upstream unavailable");

    expect(mockCreateArtifact).toHaveBeenCalledWith(expect.objectContaining({
      companyId: "company-1",
      contentJson: expect.objectContaining({
        error: "upstream unavailable",
      }),
    }));

    expect(mockLogActivity).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({
      companyId: "company-1",
      action: "http.request",
      status: "failed",
      errorMessage: "upstream unavailable",
      channel: "http",
      direction: "external",
    }));
  });
});
