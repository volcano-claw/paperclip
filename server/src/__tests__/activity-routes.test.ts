import express from "express";
import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockActivityService = vi.hoisted(() => ({
  list: vi.fn(),
  correlationTimeline: vi.fn(),
  externalCommunications: vi.fn(),
  listForAgent: vi.fn(),
  forIssue: vi.fn(),
  runsForIssue: vi.fn(),
  issuesForRun: vi.fn(),
  create: vi.fn(),
}));

const mockHeartbeatService = vi.hoisted(() => ({
  getRun: vi.fn(),
}));

const mockIssueService = vi.hoisted(() => ({
  getById: vi.fn(),
  getByIdentifier: vi.fn(),
}));

const mockAuditArtifactService = vi.hoisted(() => ({
  getById: vi.fn(),
}));

vi.mock("../services/activity.js", () => ({
  activityService: () => mockActivityService,
  normalizeActivityLimit: (limit: number | undefined) => {
    if (!Number.isFinite(limit)) return 100;
    return Math.max(1, Math.min(500, Math.floor(limit ?? 100)));
  },
}));

vi.mock("../services/index.js", () => ({
  issueService: () => mockIssueService,
  heartbeatService: () => mockHeartbeatService,
  auditArtifactService: () => mockAuditArtifactService,
}));

async function createApp(
  actor: Record<string, unknown> = {
    type: "board",
    userId: "user-1",
    companyIds: ["company-1"],
    source: "session",
    isInstanceAdmin: false,
  },
) {
  const [{ errorHandler }, { activityRoutes }] = await Promise.all([
    import("../middleware/index.js"),
    import("../routes/activity.js"),
  ]);
  const app = express();
  app.use(express.json());
  app.use((req, _res, next) => {
    (req as any).actor = actor;
    next();
  });
  app.use("/api", activityRoutes({} as any));
  app.use(errorHandler);
  return app;
}

describe("activity routes", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it("limits company activity lists by default", async () => {
    mockActivityService.list.mockResolvedValue([]);

    const app = await createApp();
    const res = await request(app).get("/api/companies/company-1/activity");

    expect(res.status).toBe(200);
    expect(mockActivityService.list).toHaveBeenCalledWith({
      companyId: "company-1",
      agentId: undefined,
      action: undefined,
      status: undefined,
      channel: undefined,
      direction: undefined,
      correlationId: undefined,
      entityType: undefined,
      entityId: undefined,
      limit: 100,
    });
  });

  it("caps requested company activity list limits", async () => {
    mockActivityService.list.mockResolvedValue([]);

    const app = await createApp();
    const res = await request(app).get("/api/companies/company-1/activity?limit=5000&entityType=issue");

    expect(res.status).toBe(200);
    expect(mockActivityService.list).toHaveBeenCalledWith({
      companyId: "company-1",
      agentId: undefined,
      action: undefined,
      status: undefined,
      channel: undefined,
      direction: undefined,
      correlationId: undefined,
      entityType: "issue",
      entityId: undefined,
      limit: 500,
    });
  });

  it("passes audit filters when listing company activity", async () => {
    mockActivityService.list.mockResolvedValue([]);

    const app = await createApp();
    const res = await request(app)
      .get("/api/companies/company-1/activity?action=email.sent&status=failed&channel=email&direction=external&correlationId=corr-1");

    expect(res.status).toBe(200);
    expect(mockActivityService.list).toHaveBeenCalledWith({
      companyId: "company-1",
      agentId: undefined,
      action: "email.sent",
      status: "failed",
      channel: "email",
      direction: "external",
      correlationId: "corr-1",
      entityType: undefined,
      entityId: undefined,
      limit: 100,
    });
  });

  it("returns a correlation timeline in chronological order", async () => {
    mockActivityService.correlationTimeline.mockResolvedValue([]);

    const app = await createApp();
    const res = await request(app)
      .get("/api/companies/company-1/activity/correlations/corr-1?limit=25");

    expect(res.status).toBe(200);
    expect(mockActivityService.correlationTimeline).toHaveBeenCalledWith("company-1", "corr-1", 25);
  });

  it("lists external communications with external direction implied", async () => {
    mockActivityService.externalCommunications.mockResolvedValue([]);

    const app = await createApp();
    const res = await request(app)
      .get("/api/companies/company-1/external-communications?channel=http&status=success&agentId=agent-1&entityType=issue&entityId=issue-1&limit=20");

    expect(res.status).toBe(200);
    expect(mockActivityService.externalCommunications).toHaveBeenCalledWith("company-1", {
      agentId: "agent-1",
      status: "success",
      channel: "http",
      entityType: "issue",
      entityId: "issue-1",
      limit: 20,
    });
  });

  it("lists agent-scoped activity with audit filters", async () => {
    mockActivityService.listForAgent.mockResolvedValue([]);

    const app = await createApp();
    const res = await request(app)
      .get("/api/agents/agent-1/activity?companyId=company-1&status=success&channel=email");

    expect(res.status).toBe(200);
    expect(mockActivityService.listForAgent).toHaveBeenCalledWith("company-1", "agent-1", {
      action: undefined,
      status: "success",
      channel: "email",
      direction: undefined,
      correlationId: undefined,
      entityType: undefined,
      entityId: undefined,
      limit: 100,
    });
  });

  it("returns a company-scoped audit artifact when accessible", async () => {
    mockAuditArtifactService.getById.mockResolvedValue({
      id: "artifact-1",
      companyId: "company-1",
      artifactType: "email_body",
      contentText: "hello",
    });

    const app = await createApp();
    const res = await request(app).get("/api/companies/company-1/audit-artifacts/artifact-1");

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ id: "artifact-1", artifactType: "email_body", contentText: "hello" });
  });

  it("hides audit artifacts from other companies", async () => {
    mockAuditArtifactService.getById.mockResolvedValue({
      id: "artifact-1",
      companyId: "company-2",
      artifactType: "email_body",
      contentText: "secret",
    });

    const app = await createApp();
    const res = await request(app).get("/api/companies/company-1/audit-artifacts/artifact-1");

    expect(res.status).toBe(404);
  });

  it("resolves issue identifiers before loading runs", async () => {
    mockIssueService.getByIdentifier.mockResolvedValue({
      id: "issue-uuid-1",
      companyId: "company-1",
    });
    mockActivityService.runsForIssue.mockResolvedValue([
      {
        runId: "run-1",
        adapterType: "codex_local",
      },
    ]);

    const app = await createApp();
    const res = await request(app).get("/api/issues/PAP-475/runs");

    expect(res.status).toBe(200);
    expect(mockIssueService.getByIdentifier).toHaveBeenCalledWith("PAP-475");
    expect(mockIssueService.getById).not.toHaveBeenCalled();
    expect(mockActivityService.runsForIssue).toHaveBeenCalledWith("company-1", "issue-uuid-1");
    expect(res.body).toEqual([{ runId: "run-1", adapterType: "codex_local" }]);
  });

  it("requires company access before creating activity events", async () => {
    const app = await createApp();
    const res = await request(app)
      .post("/api/companies/company-2/activity")
      .send({
        actorId: "user-1",
        action: "test.event",
        entityType: "issue",
        entityId: "issue-1",
      });

    expect(res.status).toBe(403);
    expect(mockActivityService.create).not.toHaveBeenCalled();
  });

  it("requires company access before listing issues for another company's run", async () => {
    mockHeartbeatService.getRun.mockResolvedValue({
      id: "run-2",
      companyId: "company-2",
    });

    const app = await createApp();
    const res = await request(app).get("/api/heartbeat-runs/run-2/issues");

    expect(res.status).toBe(403);
    expect(mockActivityService.issuesForRun).not.toHaveBeenCalled();
  });

  it("rejects anonymous heartbeat run issue lookups before run existence checks", async () => {
    const app = await createApp({ type: "none", source: "none" });
    const res = await request(app).get("/api/heartbeat-runs/missing-run/issues");

    expect(res.status).toBe(401);
    expect(mockHeartbeatService.getRun).not.toHaveBeenCalled();
    expect(mockActivityService.issuesForRun).not.toHaveBeenCalled();
  });
});
