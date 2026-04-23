ALTER TABLE "activity_log" ADD COLUMN IF NOT EXISTS "status" text DEFAULT 'success' NOT NULL;--> statement-breakpoint
ALTER TABLE "activity_log" ADD COLUMN IF NOT EXISTS "target_type" text;--> statement-breakpoint
ALTER TABLE "activity_log" ADD COLUMN IF NOT EXISTS "target_id" text;--> statement-breakpoint
ALTER TABLE "activity_log" ADD COLUMN IF NOT EXISTS "target_label" text;--> statement-breakpoint
ALTER TABLE "activity_log" ADD COLUMN IF NOT EXISTS "channel" text;--> statement-breakpoint
ALTER TABLE "activity_log" ADD COLUMN IF NOT EXISTS "direction" text;--> statement-breakpoint
ALTER TABLE "activity_log" ADD COLUMN IF NOT EXISTS "content_summary" text;--> statement-breakpoint
ALTER TABLE "activity_log" ADD COLUMN IF NOT EXISTS "content_ref" text;--> statement-breakpoint
ALTER TABLE "activity_log" ADD COLUMN IF NOT EXISTS "approval_context" jsonb;--> statement-breakpoint
ALTER TABLE "activity_log" ADD COLUMN IF NOT EXISTS "authorization_basis" jsonb;--> statement-breakpoint
ALTER TABLE "activity_log" ADD COLUMN IF NOT EXISTS "parent_event_id" uuid;--> statement-breakpoint
ALTER TABLE "activity_log" ADD COLUMN IF NOT EXISTS "correlation_id" text;--> statement-breakpoint
ALTER TABLE "activity_log" ADD COLUMN IF NOT EXISTS "error_message" text;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "activity_log_company_action_created_idx" ON "activity_log" USING btree ("company_id","action","created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "activity_log_company_agent_created_idx" ON "activity_log" USING btree ("company_id","agent_id","created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "activity_log_correlation_id_idx" ON "activity_log" USING btree ("correlation_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "activity_log_parent_event_id_idx" ON "activity_log" USING btree ("parent_event_id");
