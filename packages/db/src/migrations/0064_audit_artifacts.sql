CREATE TABLE IF NOT EXISTS "audit_artifacts" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "company_id" uuid NOT NULL,
  "event_id" uuid,
  "artifact_type" text NOT NULL,
  "mime_type" text,
  "content_text" text,
  "content_json" jsonb,
  "content_hash" text,
  "redacted" boolean DEFAULT false NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "audit_artifacts" ADD CONSTRAINT "audit_artifacts_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "audit_artifacts" ADD CONSTRAINT "audit_artifacts_event_id_activity_log_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."activity_log"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "audit_artifacts_company_created_idx" ON "audit_artifacts" USING btree ("company_id","created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "audit_artifacts_event_id_idx" ON "audit_artifacts" USING btree ("event_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "audit_artifacts_artifact_type_idx" ON "audit_artifacts" USING btree ("artifact_type");
