import { createHash } from "node:crypto";
import { eq } from "drizzle-orm";
import type { Db } from "@paperclipai/db";
import { auditArtifacts } from "@paperclipai/db";
import { sanitizeRecord } from "../redaction.js";

function hashContent(input: string) {
  return createHash("sha256").update(input).digest("hex");
}

export function auditArtifactService(db: Db) {
  return {
    create: async (input: {
      companyId: string;
      eventId?: string | null;
      artifactType: string;
      mimeType?: string | null;
      contentText?: string | null;
      contentJson?: Record<string, unknown> | null;
      redacted?: boolean;
    }) => {
      const sanitizedJson = input.contentJson ? sanitizeRecord(input.contentJson) : null;
      const contentHash = input.contentText
        ? hashContent(input.contentText)
        : sanitizedJson
          ? hashContent(JSON.stringify(sanitizedJson))
          : null;
      return db
        .insert(auditArtifacts)
        .values({
          companyId: input.companyId,
          eventId: input.eventId ?? null,
          artifactType: input.artifactType,
          mimeType: input.mimeType ?? null,
          contentText: input.contentText ?? null,
          contentJson: sanitizedJson,
          contentHash,
          redacted: input.redacted ?? false,
        })
        .returning()
        .then((rows) => rows[0]);
    },

    getById: async (id: string) =>
      db
        .select()
        .from(auditArtifacts)
        .where(eq(auditArtifacts.id, id))
        .then((rows) => rows[0] ?? null),
  };
}
