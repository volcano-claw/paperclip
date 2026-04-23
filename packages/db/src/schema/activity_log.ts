import { pgTable, uuid, text, timestamp, jsonb, index } from "drizzle-orm/pg-core";
import { companies } from "./companies.js";
import { agents } from "./agents.js";
import { heartbeatRuns } from "./heartbeat_runs.js";

export const activityLog = pgTable(
  "activity_log",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    companyId: uuid("company_id").notNull().references(() => companies.id),
    actorType: text("actor_type").notNull().default("system"),
    actorId: text("actor_id").notNull(),
    action: text("action").notNull(),
    status: text("status").notNull().default("success"),
    entityType: text("entity_type").notNull(),
    entityId: text("entity_id").notNull(),
    agentId: uuid("agent_id").references(() => agents.id),
    runId: uuid("run_id").references(() => heartbeatRuns.id),
    targetType: text("target_type"),
    targetId: text("target_id"),
    targetLabel: text("target_label"),
    channel: text("channel"),
    direction: text("direction"),
    contentSummary: text("content_summary"),
    contentRef: text("content_ref"),
    approvalContext: jsonb("approval_context").$type<Record<string, unknown> | null>(),
    authorizationBasis: jsonb("authorization_basis").$type<Record<string, unknown> | null>(),
    parentEventId: uuid("parent_event_id"),
    correlationId: text("correlation_id"),
    errorMessage: text("error_message"),
    details: jsonb("details").$type<Record<string, unknown>>(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    companyCreatedIdx: index("activity_log_company_created_idx").on(table.companyId, table.createdAt),
    runIdIdx: index("activity_log_run_id_idx").on(table.runId),
    entityIdx: index("activity_log_entity_type_id_idx").on(table.entityType, table.entityId),
    companyActionCreatedIdx: index("activity_log_company_action_created_idx").on(table.companyId, table.action, table.createdAt),
    companyAgentCreatedIdx: index("activity_log_company_agent_created_idx").on(table.companyId, table.agentId, table.createdAt),
    correlationIdx: index("activity_log_correlation_id_idx").on(table.correlationId),
    parentEventIdx: index("activity_log_parent_event_id_idx").on(table.parentEventId),
  }),
);
