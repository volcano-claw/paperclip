import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "@/lib/router";
import type { ActivityEvent, Agent } from "@paperclipai/shared";
import { activityApi, type AuditArtifact } from "../api/activity";
import { accessApi } from "../api/access";
import { agentsApi } from "../api/agents";
import { buildCompanyUserProfileMap } from "../lib/company-members";
import { useCompany } from "../context/CompanyContext";
import { useBreadcrumbs } from "../context/BreadcrumbContext";
import { queryKeys } from "../lib/queryKeys";
import { EmptyState } from "../components/EmptyState";
import { ActivityRow } from "../components/ActivityRow";
import { MetricCard } from "../components/MetricCard";
import { PageSkeleton } from "../components/PageSkeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileText, Globe, History, Link2, ShieldAlert, ShieldCheck, AlertTriangle, Activity as ActivityIcon } from "lucide-react";

const ACTIVITY_PAGE_LIMIT = 200;
type ActivityMode = "all" | "external";
type TimeWindow = "all" | "today" | "7d" | "30d";
type ExternalStatusFilter = "all" | "success" | "failed" | "pending" | "cancelled";

function detailString(event: ActivityEvent, ...keys: string[]) {
  const details = event.details;
  for (const key of keys) {
    const value = details?.[key];
    if (typeof value === "string" && value.trim()) return value;
  }
  return null;
}

function activityEntityName(event: ActivityEvent) {
  if (event.entityType === "issue") return detailString(event, "identifier", "issueIdentifier");
  if (event.entityType === "project") return detailString(event, "projectName", "name", "title");
  if (event.entityType === "goal") return detailString(event, "goalTitle", "title", "name");
  return detailString(event, "name", "title");
}

function activityEntityTitle(event: ActivityEvent) {
  if (event.entityType === "issue") return detailString(event, "issueTitle", "title");
  return null;
}

function formatTimestamp(value: string | Date | null | undefined) {
  if (!value) return "—";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString();
}

function formatJson(value: unknown) {
  return JSON.stringify(value, null, 2);
}

function artifactPreview(artifact: AuditArtifact | null | undefined) {
  if (!artifact) return null;
  if (artifact.contentText?.trim()) return artifact.contentText;
  if (artifact.contentJson) return formatJson(artifact.contentJson);
  return null;
}

function ExternalCommunicationRow({
  event,
  onOpenDetails,
}: {
  event: ActivityEvent;
  onOpenDetails: (event: ActivityEvent) => void;
}) {
  const summary = event.contentSummary ?? `${event.action} → ${event.targetLabel ?? event.targetId ?? event.entityType}`;
  const target = event.targetLabel ?? event.targetId ?? "Target not specified";
  const statusVariant: "destructive" | "secondary" | "outline" =
    event.status === "failed" ? "destructive" : event.status === "pending" ? "secondary" : "outline";

  return (
    <div className="border border-border rounded-lg p-4 space-y-3 bg-card">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">{event.channel ?? "external"}</Badge>
            <Badge variant={statusVariant}>{event.status ?? "success"}</Badge>
            {event.correlationId ? <Badge variant="secondary">corr {event.correlationId.slice(0, 8)}</Badge> : null}
          </div>
          <div>
            <p className="text-sm font-medium break-words">{summary}</p>
            <p className="text-xs text-muted-foreground break-words">{target}</p>
          </div>
        </div>
        <Button variant="outline" size="xs" onClick={() => onOpenDetails(event)}>
          Voir détail
        </Button>
      </div>

      <div className="grid gap-2 text-xs text-muted-foreground md:grid-cols-3">
        <div>
          <span className="font-medium text-foreground">Action :</span> {event.action}
        </div>
        <div>
          <span className="font-medium text-foreground">Entité :</span> {event.entityType}:{event.entityId}
        </div>
        <div>
          <span className="font-medium text-foreground">Quand :</span> {formatTimestamp(event.createdAt)}
        </div>
      </div>

      {event.errorMessage ? (
        <div className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive break-words">
          {event.errorMessage}
        </div>
      ) : null}
    </div>
  );
}

export function Activity() {
  const location = useLocation();
  const { selectedCompanyId } = useCompany();
  const { setBreadcrumbs } = useBreadcrumbs();
  const [filter, setFilter] = useState("all");
  const [timeWindow, setTimeWindow] = useState<TimeWindow>("7d");
  const [externalStatusFilter, setExternalStatusFilter] = useState<ExternalStatusFilter>("all");
  const [externalChannelFilter, setExternalChannelFilter] = useState<string>("all");
  const [mode, setMode] = useState<ActivityMode>("all");
  const [selectedEvent, setSelectedEvent] = useState<ActivityEvent | null>(null);

  useEffect(() => {
    setBreadcrumbs([{ label: location.pathname.includes("/audit") ? "Audit" : "Activity" }]);
  }, [location.pathname, setBreadcrumbs]);

  const activityQuery = useQuery({
    queryKey: [...queryKeys.activity(selectedCompanyId!), mode, { limit: ACTIVITY_PAGE_LIMIT }],
    queryFn: () =>
      mode === "external"
        ? activityApi.externalCommunications(selectedCompanyId!, { limit: ACTIVITY_PAGE_LIMIT })
        : activityApi.list(selectedCompanyId!, { limit: ACTIVITY_PAGE_LIMIT }),
    enabled: !!selectedCompanyId,
  });

  const { data: agents } = useQuery({
    queryKey: queryKeys.agents.list(selectedCompanyId!),
    queryFn: () => agentsApi.list(selectedCompanyId!),
    enabled: !!selectedCompanyId,
  });

  const { data: companyMembers } = useQuery({
    queryKey: queryKeys.access.companyUserDirectory(selectedCompanyId!),
    queryFn: () => accessApi.listUserDirectory(selectedCompanyId!),
    enabled: !!selectedCompanyId,
  });

  const artifactQuery = useQuery({
    queryKey: ["activity", "artifact", selectedCompanyId, selectedEvent?.contentRef],
    queryFn: () => activityApi.getAuditArtifact(selectedCompanyId!, selectedEvent!.contentRef!),
    enabled: !!selectedCompanyId && !!selectedEvent?.contentRef,
  });

  const timelineQuery = useQuery({
    queryKey: ["activity", "correlation-timeline", selectedCompanyId, selectedEvent?.correlationId],
    queryFn: () => activityApi.correlationTimeline(selectedCompanyId!, selectedEvent!.correlationId!, 50),
    enabled: !!selectedCompanyId && !!selectedEvent?.correlationId,
  });

  const userProfileMap = useMemo(
    () => buildCompanyUserProfileMap(companyMembers?.users),
    [companyMembers?.users],
  );

  const agentMap = useMemo(() => {
    const map = new Map<string, Agent>();
    for (const a of agents ?? []) map.set(a.id, a);
    return map;
  }, [agents]);

  const data = activityQuery.data;

  const entityNameMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const a of agents ?? []) map.set(`agent:${a.id}`, a.name);
    for (const event of data ?? []) {
      const name = activityEntityName(event);
      if (name) map.set(`${event.entityType}:${event.entityId}`, name);
    }
    for (const event of timelineQuery.data ?? []) {
      const name = activityEntityName(event);
      if (name) map.set(`${event.entityType}:${event.entityId}`, name);
    }
    return map;
  }, [data, agents, timelineQuery.data]);

  const entityTitleMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const event of data ?? []) {
      const title = activityEntityTitle(event);
      if (title) map.set(`${event.entityType}:${event.entityId}`, title);
    }
    for (const event of timelineQuery.data ?? []) {
      const title = activityEntityTitle(event);
      if (title) map.set(`${event.entityType}:${event.entityId}`, title);
    }
    return map;
  }, [data, timelineQuery.data]);

  if (!selectedCompanyId) {
    return <EmptyState icon={History} message="Select a company to view activity." />;
  }

  if (activityQuery.isLoading) {
    return <PageSkeleton variant="list" />;
  }

  const filtered = useMemo(() => {
    const now = Date.now();
    const minTimestamp =
      timeWindow === "today"
        ? (() => {
            const date = new Date();
            date.setHours(0, 0, 0, 0);
            return date.getTime();
          })()
        : timeWindow === "7d"
          ? now - 7 * 24 * 60 * 60 * 1000
          : timeWindow === "30d"
            ? now - 30 * 24 * 60 * 60 * 1000
            : null;

    return (data ?? []).filter((event) => {
      if (filter !== "all" && event.entityType !== filter) return false;
      if (mode === "external") {
        if (externalStatusFilter !== "all" && (event.status ?? "success") !== externalStatusFilter) return false;
        if (externalChannelFilter !== "all" && (event.channel ?? "external") !== externalChannelFilter) return false;
      }
      if (minTimestamp == null) return true;
      const eventTime = new Date(event.createdAt).getTime();
      return Number.isFinite(eventTime) && eventTime >= minTimestamp;
    });
  }, [data, externalChannelFilter, externalStatusFilter, filter, mode, timeWindow]);

  const externalStats = useMemo(() => {
    const events = filtered ?? [];
    const failures = events.filter((event) => event.status === "failed");
    const successCount = events.filter((event) => event.status !== "failed").length;
    const channels = new Set(events.map((event) => event.channel ?? "external"));
    const correlations = new Set(events.map((event) => event.correlationId).filter((value): value is string => Boolean(value)));

    return {
      total: events.length,
      failures: failures.length,
      successCount,
      channels: channels.size,
      correlations: correlations.size,
    };
  }, [filtered]);

  const groupedExternalEvents = useMemo(() => {
    const groups = new Map<string, ActivityEvent[]>();
    for (const event of filtered ?? []) {
      const key = event.channel ?? "external";
      const existing = groups.get(key);
      if (existing) existing.push(event);
      else groups.set(key, [event]);
    }
    return [...groups.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [filtered]);

  const entityTypes = data
    ? [...new Set(data.map((e) => e.entityType))].sort()
    : [];
  const externalChannels = useMemo(
    () => [...new Set((data ?? []).map((event) => event.channel ?? "external"))].sort(),
    [data],
  );

  const artifactText = artifactPreview(artifactQuery.data);

  return (
    <>
      <div className="space-y-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <Tabs value={mode} onValueChange={(value) => setMode(value as ActivityMode)}>
            <TabsList variant="line">
              <TabsTrigger value="all">Activité</TabsTrigger>
              <TabsTrigger value="external">Communications externes</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center justify-end gap-2">
            <Select value={timeWindow} onValueChange={(value) => setTimeWindow(value as TimeWindow)}>
              <SelectTrigger className="w-[140px] h-8 text-xs">
                <SelectValue placeholder="Période" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Aujourd’hui</SelectItem>
                <SelectItem value="7d">7 jours</SelectItem>
                <SelectItem value="30d">30 jours</SelectItem>
                <SelectItem value="all">Tout</SelectItem>
              </SelectContent>
            </Select>
            {mode === "external" ? (
              <>
                <Select value={externalStatusFilter} onValueChange={(value) => setExternalStatusFilter(value as ExternalStatusFilter)}>
                  <SelectTrigger className="w-[140px] h-8 text-xs">
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous statuts</SelectItem>
                    <SelectItem value="success">Succès</SelectItem>
                    <SelectItem value="failed">Échec</SelectItem>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="cancelled">Annulé</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={externalChannelFilter} onValueChange={setExternalChannelFilter}>
                  <SelectTrigger className="w-[140px] h-8 text-xs">
                    <SelectValue placeholder="Canal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous canaux</SelectItem>
                    {externalChannels.map((channel) => (
                      <SelectItem key={channel} value={channel}>{channel}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </>
            ) : null}
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[180px] h-8 text-xs">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                {entityTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {mode === "external" ? (
          <>
            <div className="rounded-lg border border-border bg-muted/20 px-4 py-3 text-sm text-muted-foreground">
              Vue dédiée aux sorties du système : appels HTTP, messages externes, emails ou webhooks tracés.
            </div>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <MetricCard
                icon={Globe}
                value={externalStats.total}
                label="Sorties externes"
                description="Nombre total d’événements visibles dans cette vue"
              />
              <MetricCard
                icon={ShieldCheck}
                value={externalStats.successCount}
                label="Sorties sans échec"
                description="Événements externes non marqués en erreur"
              />
              <MetricCard
                icon={AlertTriangle}
                value={externalStats.failures}
                label="Échecs externes"
                description="Sorties à investiguer en priorité"
              />
              <MetricCard
                icon={ActivityIcon}
                value={`${externalStats.channels} / ${externalStats.correlations}`}
                label="Canaux / corrélations"
                description="Diversité des canaux et chaînes d’actions reconstruites"
              />
            </div>
          </>
        ) : null}

        {activityQuery.error && <p className="text-sm text-destructive">{activityQuery.error.message}</p>}

        {filtered && filtered.length === 0 && (
          <EmptyState
            icon={mode === "external" ? Globe : History}
            message={mode === "external" ? "No external communications yet." : "No activity yet."}
          />
        )}

        {filtered && filtered.length > 0 && mode === "all" && (
          <div className="border border-border divide-y divide-border">
            {filtered.map((event) => (
              <ActivityRow
                key={event.id}
                event={event}
                agentMap={agentMap}
                userProfileMap={userProfileMap}
                entityNameMap={entityNameMap}
                entityTitleMap={entityTitleMap}
              />
            ))}
          </div>
        )}

        {filtered && filtered.length > 0 && mode === "external" && (
          <div className="space-y-5">
            {groupedExternalEvents.map(([channel, events]) => (
              <section key={channel} className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{channel}</Badge>
                    <span className="text-sm text-muted-foreground">{events.length} événement{events.length > 1 ? "s" : ""}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  {events.map((event) => (
                    <ExternalCommunicationRow key={event.id} event={event} onOpenDetails={setSelectedEvent} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>

      <Dialog open={!!selectedEvent} onOpenChange={(open) => !open && setSelectedEvent(null)}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Détail audit</DialogTitle>
            <DialogDescription>
              {selectedEvent?.contentSummary ?? selectedEvent?.action ?? "Audit event"}
            </DialogDescription>
          </DialogHeader>

          {selectedEvent ? (
            <div className="space-y-4 overflow-y-auto pr-1 text-sm">
              <div className="flex flex-wrap gap-2">
                {selectedEvent.channel ? <Badge variant="outline">{selectedEvent.channel}</Badge> : null}
                {selectedEvent.direction ? <Badge variant="secondary">{selectedEvent.direction}</Badge> : null}
                {selectedEvent.status ? <Badge variant={selectedEvent.status === "failed" ? "destructive" : selectedEvent.status === "pending" ? "secondary" : "outline"}>{selectedEvent.status}</Badge> : null}
                {selectedEvent.correlationId ? <Badge variant="secondary">{selectedEvent.correlationId}</Badge> : null}
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-lg border border-border p-3 space-y-2">
                  <h3 className="font-medium">Contexte</h3>
                  <div className="text-xs text-muted-foreground space-y-1 break-words">
                    <p><span className="font-medium text-foreground">Action :</span> {selectedEvent.action}</p>
                    <p><span className="font-medium text-foreground">Entité :</span> {selectedEvent.entityType}:{selectedEvent.entityId}</p>
                    <p><span className="font-medium text-foreground">Cible :</span> {selectedEvent.targetLabel ?? selectedEvent.targetId ?? "—"}</p>
                    <p><span className="font-medium text-foreground">Quand :</span> {formatTimestamp(selectedEvent.createdAt)}</p>
                    <p><span className="font-medium text-foreground">Run :</span> {selectedEvent.runId ?? "—"}</p>
                  </div>
                </div>

                <div className="rounded-lg border border-border p-3 space-y-2">
                  <h3 className="font-medium">Résumé</h3>
                  <div className="text-xs text-muted-foreground space-y-2 break-words">
                    <p>{selectedEvent.contentSummary ?? "No content summary."}</p>
                    {selectedEvent.errorMessage ? (
                      <div className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-destructive">
                        <div className="flex items-start gap-2">
                          <ShieldAlert className="mt-0.5 size-3.5 shrink-0" />
                          <span>{selectedEvent.errorMessage}</span>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-lg border border-border p-3 space-y-3">
                  <div className="flex items-center gap-2">
                    <FileText className="size-4" />
                    <h3 className="font-medium">Artefact lié</h3>
                  </div>
                  {!selectedEvent.contentRef ? (
                    <p className="text-xs text-muted-foreground">Aucun artefact lié.</p>
                  ) : artifactQuery.isLoading ? (
                    <p className="text-xs text-muted-foreground">Chargement de l’artefact…</p>
                  ) : artifactQuery.error ? (
                    <p className="text-xs text-destructive">{artifactQuery.error.message}</p>
                  ) : artifactText ? (
                    <pre className="rounded-md bg-neutral-100 dark:bg-neutral-950 p-3 text-xs whitespace-pre-wrap break-words overflow-x-auto">{artifactText}</pre>
                  ) : (
                    <p className="text-xs text-muted-foreground">Artefact vide.</p>
                  )}
                </div>

                <div className="rounded-lg border border-border p-3 space-y-3">
                  <div className="flex items-center gap-2">
                    <Link2 className="size-4" />
                    <h3 className="font-medium">Timeline de corrélation</h3>
                  </div>
                  {!selectedEvent.correlationId ? (
                    <p className="text-xs text-muted-foreground">Aucune corrélation liée.</p>
                  ) : timelineQuery.isLoading ? (
                    <p className="text-xs text-muted-foreground">Chargement de la timeline…</p>
                  ) : timelineQuery.error ? (
                    <p className="text-xs text-destructive">{timelineQuery.error.message}</p>
                  ) : (
                    <div className="space-y-2">
                      {(timelineQuery.data ?? []).map((event) => (
                        <div key={event.id} className="rounded-md border border-border px-3 py-2 text-xs space-y-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-medium break-words">{event.contentSummary ?? event.action}</span>
                            <span className="text-muted-foreground shrink-0">{formatTimestamp(event.createdAt)}</span>
                          </div>
                          <div className="text-muted-foreground break-words">
                            {event.channel ?? "activity"} • {event.targetLabel ?? event.targetId ?? `${event.entityType}:${event.entityId}`}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {selectedEvent.details ? (
                <div className="rounded-lg border border-border p-3 space-y-2">
                  <h3 className="font-medium">Détails techniques</h3>
                  <pre className="rounded-md bg-neutral-100 dark:bg-neutral-950 p-3 text-xs whitespace-pre-wrap break-words overflow-x-auto">{formatJson(selectedEvent.details)}</pre>
                </div>
              ) : null}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
