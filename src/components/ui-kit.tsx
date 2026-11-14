import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { AlertTriangle, Inbox, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const tones = {
  blue: "bg-info-soft text-primary",
  green: "bg-success-soft text-success",
  red: "bg-danger-soft text-destructive",
  gray: "bg-muted text-foreground",
};

export function StatCard({ icon: Icon, label, value, tone }: { icon: LucideIcon; label: string; value: string; tone: keyof typeof tones }) {
  return (
    <div className="dash-card-hover min-w-0 rounded-xl border bg-card p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <span className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-full", tones[tone])}><Icon className="h-5 w-5" /></span>
        <div className="min-w-0">
          <p className="truncate text-[11px] font-medium text-muted-foreground">{label}</p>
          <p className="break-words text-base font-bold tabular-nums 2xl:text-lg">{value}</p>
        </div>
      </div>
    </div>
  );
}

export function Panel({ title, action, children, className }: { title: string; action?: ReactNode; children: ReactNode; className?: string | undefined }) {
  return (
    <section className={cn("min-w-0 rounded-xl border bg-card p-4 shadow-sm sm:p-5", className)}>
      <div className="mb-3 grid min-w-0 gap-3 sm:flex sm:flex-wrap sm:items-center sm:justify-between">
        <h2 className="min-w-0 text-sm font-bold sm:text-base">{title}</h2>
        {action && <div className="min-w-0 max-w-full">{action}</div>}
      </div>
      {children}
    </section>
  );
}

const status = {
  Cocok: "bg-success-soft text-success",
  "Tidak Cocok": "bg-danger-soft text-destructive",
  "Belum Ada": "bg-warning-soft text-warning",
};
export type MatchStatus = keyof typeof status;
export function StatusBadge({ s }: { s: MatchStatus }) {
  return <span className={cn("inline-block whitespace-nowrap rounded px-2 py-0.5 text-xs font-semibold", status[s])}>{s}</span>;
}

export const th = "bg-muted px-3 py-2 text-left text-xs font-semibold whitespace-nowrap";
export const td = "whitespace-nowrap border-t px-3 py-2 text-sm";

/** Renders loading / error / empty states for a query; never substitutes fake data. */
export function QueryState({ isLoading, error, empty, emptyText = "Belum ada data", onRetry, children }: {
  isLoading: boolean; error: unknown; empty?: boolean; emptyText?: string; onRetry?: () => void; children: ReactNode;
}) {
  if (isLoading) return <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" />Memuat data dari database...</div>;
  if (error)
    return (
      <div role="alert" className="flex flex-col items-center gap-2 rounded-md bg-danger-soft py-8 text-center text-sm text-destructive">
        <AlertTriangle className="h-5 w-5" />
        <p>Gagal memuat data: {error instanceof Error ? error.message : String(error)}</p>
        {onRetry && <Button size="sm" variant="outline" onClick={onRetry}>Coba lagi</Button>}
      </div>
    );
  if (empty) return <div className="flex flex-col items-center gap-2 py-10 text-sm text-muted-foreground"><Inbox className="h-6 w-6" />{emptyText}</div>;
  return <>{children}</>;
}

export function PeriodFilter({ from, to, onChange }: { from: string; to: string; onChange: (v: { from: string; to: string }) => void }) {
  return (
    <div className="grid w-full min-w-0 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-1 text-xs sm:w-auto">
      <Input type="date" aria-label="Dari tanggal" className="h-9 min-w-0 w-full text-xs sm:w-36" value={from} onChange={(e) => onChange({ from: e.target.value, to })} />
      <span>–</span>
      <Input type="date" aria-label="Sampai tanggal" className="h-9 min-w-0 w-full text-xs sm:w-36" value={to} onChange={(e) => onChange({ from, to: e.target.value })} />
    </div>
  );
}

export function Pager({ page, pages, onPage }: { page: number; pages: number; onPage: (p: number) => void }) {
  if (pages <= 1) return null;
  return (
    <div className="mt-3 flex items-center justify-end gap-2 text-sm">
      <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => onPage(page - 1)}>Sebelumnya</Button>
      <span>{page} / {pages}</span>
      <Button size="sm" variant="outline" disabled={page >= pages} onClick={() => onPage(page + 1)}>Berikutnya</Button>
    </div>
  );
}
