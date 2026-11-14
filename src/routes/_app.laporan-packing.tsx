import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Download } from "lucide-react";
import { PageHeader } from "./_app";
import { Panel, PeriodFilter, QueryState, td, th } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import { PlStatusBadge, plMeta } from "@/components/packing/shared";
import { PlActivityList } from "@/components/packing/activity";
import { monthStart } from "@/lib/data";
import { today } from "@/lib/format";
import { PL_STATUSES, fmtNum, plSummary } from "@/lib/packing-logic";
import { plError, plListQ } from "@/lib/packing-data";
import { exportPlExcel } from "@/lib/packing-export";

export const Route = createFileRoute("/_app/laporan-packing")({
  head: () => plMeta("Laporan & Aktivitas Packing List", "Laporan pengiriman dan riwayat aktivitas Packing List."),
  component: Page,
});

function Page() {
  const q = useQuery(plListQ());
  const [p, setP] = useState({ from: monthStart(0), to: today() });
  const rows = useMemo(() => (q.data ?? []).filter((x) => (!p.from || x.pl_date >= p.from) && (!p.to || x.pl_date <= p.to)), [q.data, p]);
  const sum = plSummary(rows);
  const byDest = useMemo(() => {
    const m = new Map<string, { name: string; n: number; koli: number; w: number; v: number }>();
    rows.filter((r) => r.status !== "dibatalkan").forEach((r) => {
      const name = r.destination?.name ?? "Belum ditentukan";
      const g = m.get(name) ?? { name, n: 0, koli: 0, w: 0, v: 0 };
      g.n++; g.koli += Number(r.total_koli); g.w += Number(r.total_weight_kg); g.v += Number(r.total_volume_m3); m.set(name, g);
    });
    return [...m.values()].sort((a, b) => b.koli - a.koli);
  }, [rows]);
  const title = `Laporan Packing List ${p.from} sd ${p.to}`;
  return (
    <>
      <PageHeader title="Laporan & Aktivitas" subtitle="Rekap Packing List per periode dan riwayat aktivitas tim">
        <Button size="sm" variant="outline" disabled={!rows.length} onClick={() => exportPlExcel(rows, title).catch((e) => toast.error(plError(e)))}><Download className="h-4 w-4" />Excel</Button>
      </PageHeader>
      <main className="min-w-0 space-y-4 p-3 sm:p-6">
        <Panel title="Ringkasan Periode" action={<PeriodFilter from={p.from} to={p.to} onChange={setP} />}>
          <QueryState isLoading={q.isLoading} error={q.error} onRetry={() => q.refetch()}>
            <div className="grid grid-cols-2 gap-3 text-sm md:grid-cols-5">
              {[["Dokumen", fmtNum(sum.documents, 0)], ["Barang", fmtNum(sum.items, 0)], ["Koli", fmtNum(sum.koli)], ["Berat", `${fmtNum(sum.weight)} kg`], ["Volume", `${fmtNum(sum.volume, 4)} m³`]].map(([k, v]) => <div key={k} className="rounded border p-3"><p className="text-xs text-muted-foreground">{k}</p><b>{v}</b></div>)}
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground">Barang, koli, berat dan volume tidak menghitung Packing List yang dibatalkan.</p>
            <div className="mt-3 flex flex-wrap gap-2">{PL_STATUSES.map((s) => <span key={s} className="flex items-center gap-1 text-xs"><PlStatusBadge s={s} /><b>{sum.byStatus[s]}</b></span>)}</div>
          </QueryState>
        </Panel>
        <Panel title="Rekap per Pelabuhan Tujuan">
          <QueryState isLoading={q.isLoading} error={q.error} empty={!byDest.length} emptyText="Tidak ada Packing List pada periode ini">
            <div className="overflow-x-auto"><table className="w-full">
              <thead><tr>{["Tujuan", "Dokumen", "Koli", "Berat (kg)", "Volume (m³)"].map((h) => <th key={h} className={th}>{h}</th>)}</tr></thead>
              <tbody>{byDest.map((g) => <tr key={g.name}><td className={`${td} font-semibold`}>{g.name}</td><td className={td}>{g.n}</td><td className={td}>{fmtNum(g.koli)}</td><td className={td}>{fmtNum(g.w)}</td><td className={td}>{fmtNum(g.v, 4)}</td></tr>)}</tbody>
            </table></div>
          </QueryState>
        </Panel>
        <Panel title="Riwayat Aktivitas Packing List"><PlActivityList /></Panel>
      </main>
    </>
  );
}
