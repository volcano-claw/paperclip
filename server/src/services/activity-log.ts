import { randomUUID } from "node:crypto";
import type { Db } from "@paperclipai/db";
import { activityLog } from "@paperclipai/db";
import { PLUGIN_EVENT_TYPES, type PluginEventType } from "@paperclipai/shared";
import type { PluginEvent } from "@paperclipai/plugin-sdk";
import { publishLiveEvent } from "./live-events.js";
import { redactCurrentUserValue } from "../log-redaction.js";
import { sanitizeRecord } from "../redaction.js";
import { logger } from "../middleware/logger.js";
import type { PluginEventBus } from "./plugin-event-bus.js";
import { instanceSettingsService } from "./instance-settings.js";

const PLUGIN_EVENT_SET: ReadonlySet<string> = new Set(PLUGIN_EVENT_TYPES);
const ACTIVITY_ACTION_TO_PLUGIN_EVENT: Readonly<Record<string, PluginEventType>> = {
  issue_comment_added: "issue.comment.created",
  issue_comment_created: "issue.comment.created",
  issue_document_created: "issue.document.created",
  issue_document_updated: "issue.document.updated",
  issue_document_deleted: "issue.document.deleted",
  issue_blockers_updated: "issue.relations.updated",
  approval_approved: "approval.decided",
  approval_rejected: "approval.decided",
  approval_revision_requested: "approval.decided",
  budget_soft_threshold_crossed: "budget.incident.opened",
  budget_hard_threshold_crossed: "budget.incident.opened",
  budget_incident_resolved: "budget.incident.resolved",
};

let _pluginEventBus: PluginEventBus | null = null;

/** Wire the plugin event bus so domain events are forwarded to plugins. */
export function setPluginEventBus(bus: PluginEventBus): void {
  if (_pluginEventBus) {
    logger.warn("setPluginEventBus called more than once, replacing existing bus");
  }
  _pluginEventBus = bus;
}

function eventTypeForActivityAction(action: string): PluginEventType | null {
  if (PLUGIN_EVENT_SET.has(action)) return action as PluginEventType;
  return ACTIVITY_ACTION_TO_PLUGIN_EVENT[action.replaceAll(".", "_")] ?? null;
}

export function publishPluginDomainEvent(event: PluginEvent): void {
  if (!_pluginEventBus) return;
  void _pluginEventBus.emit(event).then(({ errors }) => {
    for (const { pluginId, error } of errors) {
      logger.warn({ pluginId, eventType: event.eventType, err: error }, "plugin event handler failed");
    }
  }).catch(() => {});
}

export interface LogActivityInput {
  companyId: string;
  actorType: "agent" | "user" | "system" | "plugin";
  actorId: string;
  action: string;
  status?: "success" | "failed" | "pending" | "cancelled";
  entityType: string;
  entityId: string;
  agentId?: string | null;
  runId?: string | null;
  targetType?: string | null;
  targetId?: string | null;
  targetLabel?: string | null;
  channel?: string | null;
  direction?: "internal" | "external" | null;
  contentSummary?: string | null;
  contentRef?: string | null;
  approvalContext?: Record<string, unknown> | null;
  authorizationBasis?: Record<string, unknown> | null;
  parentEventId?: string | null;
  correlationId?: string | null;
  errorMessage?: string | null;
  details?: Record<string, unknown> | null;
}

export async function logActivity(db: Db, input: LogActivityInput) {
  const currentUserRedactionOptions = {
    enabled: (await instanceSettingsService(db).getGeneral()).censorUsernameInLogs,
  };
  const sanitizedDetails = input.details ? sanitizeRecord(input.details) : null;
  const redactedDetails = sanitizedDetails
    ? redactCurrentUserValue(sanitizedDetails, currentUserRedactionOptions)
    : null;
  await db.insert(activityLog).values({
    companyId: input.companyId,
    actorType: input.actorType,
    actorId: input.actorId,
    action: input.action,
    status: input.status ?? "success",
    entityType: input.entityType,
    entityId: input.entityId,
    agentId: input.agentId ?? null,
    runId: input.runId ?? null,
    targetType: input.targetType ?? null,
    targetId: input.targetId ?? null,
    targetLabel: input.targetLabel ?? null,
    channel: input.channel ?? null,
    direction: input.direction ?? null,
    contentSummary: input.contentSummary ?? null,
    contentRef: input.contentRef ?? null,
    approvalContext: input.approvalContext ? sanitizeRecord(input.approvalContext) : null,
    authorizationBasis: input.authorizationBasis ? sanitizeRecord(input.authorizationBasis) : null,
    parentEventId: input.parentEventId ?? null,
    correlationId: input.correlationId ?? null,
    errorMessage: input.errorMessage ?? null,
    details: redactedDetails,
  });

  publishLiveEvent({
    companyId: input.companyId,
    type: "activity.logged",
    payload: {
      actorType: input.actorType,
      actorId: input.actorId,
      action: input.action,
      status: input.status ?? "success",
      entityType: input.entityType,
      entityId: input.entityId,
      agentId: input.agentId ?? null,
      runId: input.runId ?? null,
      targetType: input.targetType ?? null,
      targetId: input.targetId ?? null,
      targetLabel: input.targetLabel ?? null,
      channel: input.channel ?? null,
      direction: input.direction ?? null,
      contentSummary: input.contentSummary ?? null,
      contentRef: input.contentRef ?? null,
      approvalContext: input.approvalContext ?? null,
      authorizationBasis: input.authorizationBasis ?? null,
      parentEventId: input.parentEventId ?? null,
      correlationId: input.correlationId ?? null,
      errorMessage: input.errorMessage ?? null,
      details: redactedDetails,
    },
  });

  const pluginEventType = eventTypeForActivityAction(input.action);
  if (pluginEventType) {
    const event: PluginEvent = {
      eventId: randomUUID(),
      eventType: pluginEventType,
      occurredAt: new Date().toISOString(),
      actorId: input.actorId,
      actorType: input.actorType,
      entityId: input.entityId,
      entityType: input.entityType,
      companyId: input.companyId,
      payload: {
        ...redactedDetails,
        status: input.status ?? "success",
        agentId: input.agentId ?? null,
        runId: input.runId ?? null,
        targetType: input.targetType ?? null,
        targetId: input.targetId ?? null,
        targetLabel: input.targetLabel ?? null,
        channel: input.channel ?? null,
        direction: input.direction ?? null,
        contentSummary: input.contentSummary ?? null,
        contentRef: input.contentRef ?? null,
        approvalContext: input.approvalContext ?? null,
        authorizationBasis: input.authorizationBasis ?? null,
        parentEventId: input.parentEventId ?? null,
        correlationId: input.correlationId ?? null,
        errorMessage: input.errorMessage ?? null,
      },
    };
    publishPluginDomainEvent(event);
  }
}
