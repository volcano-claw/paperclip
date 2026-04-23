import { pgTable, uuid, text, timestamp, jsonb, boolean, index } from "drizzle-orm/pg-core";
import { companies } from "./companies.js";
import { activityLog } from "./activity_log.js";

export const auditArtifacts = pgTable(
  "audit_artifacts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    companyId: uuid("company_id").notNull().references(() => companies.id),
    eventId: uuid("event_id").references(() => activityLog.id),
    artifactType: text("artifact_type").notNull(),
    mimeType: text("mime_type"),
    contentText: text("content_text"),
    contentJson: jsonb("content_json").$type<Record<string, unknown> | null>(),
    contentHash: text("content_hash"),
    redacted: boolean("redacted").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    companyCreatedIdx: index("audit_artifacts_company_created_idx").on(table.companyId, table.createdAt),
    eventIdx: index("audit_artifacts_event_id_idx").on(table.eventId),
    artifactTypeIdx: index("audit_artifacts_artifact_type_idx").on(table.artifactType),
  }),
);
