"use client";
import { useEffect, useState } from "react";
import { db, type AutomationRun } from "@/lib/db";
import { prepareDailyLessons } from "@/lib/prepare-daily";
import { OwnerGuard } from "@/components/OwnerGuard";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { RefreshCw, CheckCircle, XCircle, Clock, AlertTriangle } from "lucide-react";

export default function AutomationPage() {
  return <OwnerGuard><AutomationContent /></OwnerGuard>;
}

function AutomationContent() {
  const [runs, setRuns] = useState<AutomationRun[]>([]);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  async function loadRuns() {
    const all = await db.automationRuns.reverse().sortBy("startedAt");
    setRuns(all.slice(0, 20));
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const all = await db.automationRuns.reverse().sortBy("startedAt");
      if (!cancelled) setRuns(all.slice(0, 20));
    })();
    return () => { cancelled = true; };
  }, []);

  async function handleManualRun() {
    setRunning(true);
    setResult(null);
    try {
      const r = await prepareDailyLessons();
      setResult(`Created ${r.assignmentsCreated} assignments. ${r.errors.length > 0 ? `Errors: ${r.errors.join(", ")}` : "No errors."}`);
    } catch (e) {
      setResult(`Failed: ${e instanceof Error ? e.message : "Unknown error"}`);
    }
    setRunning(false);
    loadRuns();
  }

  const statusIcon = (s: string) => {
    if (s === "completed") return <CheckCircle size={14} className="text-success" />;
    if (s === "failed") return <XCircle size={14} className="text-danger" />;
    if (s === "running") return <RefreshCw size={14} className="text-teal animate-spin" />;
    return <AlertTriangle size={14} className="text-warning" />;
  };

  return (
    <div className="max-w-4xl mx-auto px-[var(--spacing-page)] py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-3xl font-bold">Automation</h1>
          <p className="text-muted dark:text-muted-dark">Daily lesson preparation and run history</p>
        </div>
        <Button onClick={handleManualRun} disabled={running}>
          <RefreshCw size={16} className={running ? "animate-spin" : ""} />
          {running ? "Running..." : "Prepare Today"}
        </Button>
      </div>

      {result && (
        <Card padding="md" className="mb-6 bg-teal/5 border-teal/20">
          <p className="text-sm">{result}</p>
        </Card>
      )}

      <Card padding="md" className="mb-6 bg-gold/5 border-gold/20">
        <h3 className="font-semibold text-sm mb-1">GitHub Actions Workflow</h3>
        <p className="text-sm text-muted">
          The scheduled workflow runs daily at 7:12 AM ET via <code className="bg-ink/5 px-1 rounded">.github/workflows/prepare-daily.yml</code>.
          It also supports <code className="bg-ink/5 px-1 rounded">workflow_dispatch</code> for manual triggers.
          Configure <code className="bg-ink/5 px-1 rounded">CONTENT_PROVIDER_API_KEY</code> in repository secrets for AI-assisted content generation.
          Without it, the system uses locally authored content only.
        </p>
      </Card>

      <h2 className="font-serif text-lg font-semibold mb-3">Run History</h2>
      {runs.length === 0 ? (
        <Card padding="lg" className="text-center text-muted">No automation runs yet. Click &quot;Prepare Today&quot; to run manually.</Card>
      ) : (
        <div className="space-y-2">
          {runs.map(run => (
            <Card key={run.id} padding="sm" className="flex items-center gap-3">
              {statusIcon(run.status)}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{run.type}</span>
                  <Badge color={run.status === "completed" ? "#2d8a4e" : run.status === "failed" ? "#c0392b" : "#c27c0e"}>
                    {run.status}
                  </Badge>
                </div>
                <span className="text-xs text-muted">{new Date(run.startedAt).toLocaleString()}</span>
              </div>
              <div className="text-right text-xs text-muted">
                <div>{run.assignmentsCreated} assigned</div>
                {run.errors.length > 0 && <div className="text-danger">{run.errors.length} errors</div>}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
