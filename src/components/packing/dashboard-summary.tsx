import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Boxes, ClipboardList, Package, Scale, Ship } from "lucide-react";
import { Panel, QueryState, StatCard } from "@/components/ui-kit";
import { fmtDate, today } from "@/lib/format";
import { PL_STATUSES, fmtNum, plStatusLabel, plStatusTone, plSummary, upcomingDepartures } from "@/lib/packing-logic";
import { plListQ } from "@/lib/packing-data";
import { cn } from "@/lib/utils";
import { PlStatusBadge } from "./shared";

const linkCls = "text-xs font-semibold text-primary hover:underline";

/** Packing List part of Dashboard Utama; every number is computed from rows read from the database. */
export function PackingDashboard() {
  const q = useQuery(plListQ());
  const rows = q.data ?? [];
  const s = plSummary(rows);
  const deps = upcomingDepartures(rows, today()).slice(0, 5);
  return (
    <section aria-label="Ringkasan Packing List" className="min-w-0 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-bold">Packing List</h2>
        <Link to="/packing-list" className={linkCls}>Buka Data Packing List</Link>
      </div>
      <QueryState isLoading={q.isLoading} error={q.error} onRetry={() => q.refetch()}>
        <div className="grid min-w-0 grid-cols-1 gap-3 min-[400px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
          <StatCard icon={ClipboardList} tone="blue" label="Total Dokumen" value={fmtNum(s.documents, 0)} />
          <StatCard icon={Package} tone="gray" label="Total Barang" value={fmtNum(s.items, 0)} />
          <StatCard icon={Boxes} tone="green" label="Total Koli" value={fmtNum(s.koli)} />
          <StatCard icon={Scale} tone="gray" label="Total Berat" value={`${fmtNum(s.weight)} kg`} />
          <StatCard icon={Ship} tone="blue" label="Total Volume" value={`${fmtNum(s.volume, 4)} m³`} />
        </div>
        <p className="text-[11px] text-muted-foreground">Barang, koli, berat dan volume tidak menghitung Packing List yang dibatalkan.</p>
        <Panel title="Pengiriman per Status" action={<Link to="/pengiriman" className={linkCls}>Kelola Pengiriman</Link>} className="dash-reveal">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 xl:grid-cols-7">
            {PL_STATUSES.map((st) => (
              <Link key={st} to="/pengiriman" search={{ status: st }} className={cn("rounded-lg p-3 text-center transition-opacity hover:opacity-80", plStatusTone[st])}>
                <p className="text-xl font-extrabold tabular-nums">{s.byStatus[st]}</p><p className="text-[11px] font-semibold">{plStatusLabel[st]}</p>
              </Link>
            ))}
          </div>
        </Panel>
        <div className="grid min-w-0 gap-4 xl:grid-cols-2">
          <Panel title="Jadwal Keberangkatan Kapal" action={<Link to="/manifest" className={linkCls}>Manifest Kapal</Link>} className="dash-reveal">
            <div className="divide-y">{deps.map((g) => (
              <div key={g.key} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 py-2.5">
                <span className="grid h-10 w-12 place-items-center rounded-lg bg-info-soft text-center text-[10px] font-extrabold leading-tight text-primary">{fmtDate(g.etd).slice(0, 5)}</span>
                <div className="min-w-0"><p className="truncate text-sm font-semibold">{g.pls[0]?.vessel?.name ?? "Kapal belum ditentukan"}{g.voyage_no ? ` · V.${g.voyage_no}` : ""}</p>
                  <p className="truncate text-[11px] text-muted-foreground">{[...new Set(g.pls.map((p) => p.destination?.name).filter(Boolean))].join(", ") || "Tujuan belum diisi"}</p></div>
                <p className="text-right text-xs"><b>{g.pls.length}</b> PL<br /><span className="text-muted-foreground">{fmtNum(g.pls.reduce((a, p) => a + Number(p.total_koli), 0))} koli</span></p>
              </div>
            ))}
              {!deps.length && <p className="py-6 text-center text-xs text-muted-foreground">Tidak ada jadwal keberangkatan mendatang (ETD hari ini atau setelahnya)</p>}
            </div>
          </Panel>
          <Panel title="Pengiriman Terbaru" action={<Link to="/packing-list" className={linkCls}>Lihat Semua</Link>} className="dash-reveal">
            <div className="divide-y">{rows.slice(0, 5).map((p) => (
              <Link key={p.id} to="/packing-list/$id" params={{ id: p.id }} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 py-2.5 hover:bg-muted/40">
                <div className="min-w-0"><p className="truncate text-sm font-semibold">{p.pl_number}</p>
                  <p className="truncate text-[11px] text-muted-foreground">{fmtDate(p.pl_date)} · {p.shipper?.name ?? "-"} → {p.consignee?.name ?? "-"}</p></div>
                <PlStatusBadge s={p.status} />
              </Link>
            ))}
              {!rows.length && <p className="py-6 text-center text-xs text-muted-foreground">Belum ada Packing List</p>}
            </div>
          </Panel>
        </div>
      </QueryState>
    </section>
  );
}
