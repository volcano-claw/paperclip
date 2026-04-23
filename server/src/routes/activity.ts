import { Router } from "express";
import { z } from "zod";
import type { Db } from "@paperclipai/db";
import { validate } from "../middleware/validate.js";
import { activityService, normalizeActivityLimit } from "../services/activity.js";
import { assertAuthenticated, assertBoard, assertCompanyAccess } from "./authz.js";
import { heartbeatService, issueService, auditArtifactService } from "../services/index.js";
import { sanitizeRecord } from "../redaction.js";

const createActivitySchema = z.object({
  actorType: z.enum(["agent", "user", "system", "plugin"]).optional().default("system"),
  actorId: z.string().min(1),
  action: z.string().min(1),
  status: z.enum(["success", "failed", "pending", "cancelled"]).optional().default("success"),
  entityType: z.string().min(1),
  entityId: z.string().min(1),
  agentId: z.string().uuid().optional().nullable(),
  targetType: z.string().optional().nullable(),
  targetId: z.string().optional().nullable(),
  targetLabel: z.string().optional().nullable(),
  channel: z.string().optional().nullable(),
  direction: z.enum(["internal", "external"]).optional().nullable(),
  contentSummary: z.string().optional().nullable(),
  contentRef: z.string().optional().nullable(),
  approvalContext: z.record(z.unknown()).optional().nullable(),
  authorizationBasis: z.record(z.unknown()).optional().nullable(),
  parentEventId: z.string().uuid().optional().nullable(),
  correlationId: z.string().optional().nullable(),
  errorMessage: z.string().optional().nullable(),
  details: z.record(z.unknown()).optional().nullable(),
});

export function activityRoutes(db: Db) {
  const router = Router();
  const svc = activityService(db);
  const heartbeat = heartbeatService(db);
  const issueSvc = issueService(db);
  const auditArtifacts = auditArtifactService(db);

  async function resolveIssueByRef(rawId: string) {
    if (/^[A-Z]+-\d+$/i.test(rawId)) {
      return issueSvc.getByIdentifier(rawId);
    }
    return issueSvc.getById(rawId);
  }

  router.get("/companies/:companyId/activity", async (req, res) => {
    const companyId = req.params.companyId as string;
    assertCompanyAccess(req, companyId);

    const filters = {
      companyId,
      agentId: req.query.agentId as string | undefined,
      action: req.query.action as string | undefined,
      status: req.query.status as string | undefined,
      channel: req.query.channel as string | undefined,
      direction: req.query.direction as string | undefined,
      correlationId: req.query.correlationId as string | undefined,
      entityType: req.query.entityType as string | undefined,
      entityId: req.query.entityId as string | undefined,
      limit: normalizeActivityLimit(Number(req.query.limit)),
    };
    const result = await svc.list(filters);
    res.json(result);
  });

  router.get("/companies/:companyId/activity/correlations/:correlationId", async (req, res) => {
    const companyId = req.params.companyId as string;
    const correlationId = req.params.correlationId as string;
    assertCompanyAccess(req, companyId);

    const result = await svc.correlationTimeline(
      companyId,
      correlationId,
      normalizeActivityLimit(Number(req.query.limit)),
    );
    res.json(result);
  });

  router.get("/companies/:companyId/external-communications", async (req, res) => {
    const companyId = req.params.companyId as string;
    assertCompanyAccess(req, companyId);

    const result = await svc.externalCommunications(companyId, {
      agentId: req.query.agentId as string | undefined,
      status: req.query.status as string | undefined,
      channel: req.query.channel as string | undefined,
      entityType: req.query.entityType as string | undefined,
      entityId: req.query.entityId as string | undefined,
      limit: normalizeActivityLimit(Number(req.query.limit)),
    });
    res.json(result);
  });

  router.post("/companies/:companyId/activity", validate(createActivitySchema), async (req, res) => {
    assertBoard(req);
    const companyId = req.params.companyId as string;
    assertCompanyAccess(req, companyId);
    const event = await svc.create({
      companyId,
      ...req.body,
      approvalContext: req.body.approvalContext ? sanitizeRecord(req.body.approvalContext) : null,
      authorizationBasis: req.body.authorizationBasis ? sanitizeRecord(req.body.authorizationBasis) : null,
      details: req.body.details ? sanitizeRecord(req.body.details) : null,
    });
    res.status(201).json(event);
  });

  router.get("/agents/:id/activity", async (req, res) => {
    const agentId = req.params.id as string;
    const companyId = req.query.companyId as string;
    assertCompanyAccess(req, companyId);
    const result = await svc.listForAgent(companyId, agentId, {
      action: req.query.action as string | undefined,
      status: req.query.status as string | undefined,
      channel: req.query.channel as string | undefined,
      direction: req.query.direction as string | undefined,
      correlationId: req.query.correlationId as string | undefined,
      entityType: req.query.entityType as string | undefined,
      entityId: req.query.entityId as string | undefined,
      limit: normalizeActivityLimit(Number(req.query.limit)),
    });
    res.json(result);
  });

  router.get("/companies/:companyId/audit-artifacts/:artifactId", async (req, res) => {
    const companyId = req.params.companyId as string;
    const artifactId = req.params.artifactId as string;
    assertCompanyAccess(req, companyId);
    const artifact = await auditArtifacts.getById(artifactId);
    if (!artifact || artifact.companyId !== companyId) {
      res.status(404).json({ error: "Audit artifact not found" });
      return;
    }
    res.json(artifact);
  });

  router.get("/issues/:id/activity", async (req, res) => {
    const rawId = req.params.id as string;
    const issue = await resolveIssueByRef(rawId);
    if (!issue) {
      res.status(404).json({ error: "Issue not found" });
      return;
    }
    assertCompanyAccess(req, issue.companyId);
    const result = await svc.forIssue(issue.id);
    res.json(result);
  });

  router.get("/issues/:id/runs", async (req, res) => {
    const rawId = req.params.id as string;
    const issue = await resolveIssueByRef(rawId);
    if (!issue) {
      res.status(404).json({ error: "Issue not found" });
      return;
    }
    assertCompanyAccess(req, issue.companyId);
    const result = await svc.runsForIssue(issue.companyId, issue.id);
    res.json(result);
  });

  router.get("/heartbeat-runs/:runId/issues", async (req, res) => {
    assertAuthenticated(req);
    const runId = req.params.runId as string;
    const run = await heartbeat.getRun(runId);
    if (!run) {
      res.json([]);
      return;
    }
    assertCompanyAccess(req, run.companyId);
    const result = await svc.issuesForRun(runId);
    res.json(result);
  });

  return router;
}
