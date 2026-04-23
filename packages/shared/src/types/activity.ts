export interface ActivityEvent {
  id: string;
  companyId: string;
  actorType: "agent" | "user" | "system" | "plugin";
  actorId: string;
  action: string;
  status?: "success" | "failed" | "pending" | "cancelled" | null;
  entityType: string;
  entityId: string;
  agentId: string | null;
  runId: string | null;
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
  details: Record<string, unknown> | null;
  createdAt: Date;
}
