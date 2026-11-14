import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Receipt, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { TransactionActions } from "@/components/transaction-actions";
import { PageHeader } from "./_app";
import { Pager, Panel, PeriodFilter, QueryState, StatCard, StatusBadge, td, th } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import { EditTxDialog } from "@/components/edit-tx-dialog";
import { DeleteTxDialog } from "@/components/delete-tx-dialog";
import { balancesQ, monthStart, txCountQ, txQ, type Balance, type TxRow } from "@/lib/data";
import { compareBalances, ledgerTotals, matchTransactions, type Ledger } from "@/lib/ledger-logic";
import { roleLabel, useAuth } from "@/lib/auth";
import { fmtDate, rupiah, shortJt, today, txTypeLabel } from "@/lib/format";
import banner from "@/assets/port-banner.jpg";
import { PackingDashboard } from "@/components/packing/dashboard-summary";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({ meta: [{ name: "robots", content: "noindex, nofollow" }, { title: "Dashboard Utama — CV MR Express" }, { name: "description", content: "Ringkasan pembukuan dan Packing List CV MR Express." }, { property: "og:title", content: "Dashboard Utama — CV MR Express" }, { property: "og:description", content: "Ringkasan pembukuan dan Packing List CV MR Express." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: Dashboard,
});

const barColors = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];
const tip = (v: unknown) => rupiah(Number(v));
const ledgerName = (l: string | null) => (l === "admin1" ? "Admin 1" : "Admin 2");
const linkCls = "text-xs font-semibold text-primary hover:underline";

function DashHero({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <section className="dash-hero dash-reveal">
      <img src={banner} alt="Kapal kontainer di pelabuhan modern" width={1920} height={640} fetchPriority="high" />
      <div className="p-5 sm:p-8">
        <p className="text-[10px] font-extrabold tracking-widest opacity-90">PEMBUKUAN MR EXPRESS</p>
        <h2 className="mt-2 max-w-md text-2xl font-extrabold leading-tight sm:text-3xl">{title}</h2>
        <p className="mt-2 max-w-lg text-xs leading-relaxed opacity-90 sm:text-sm">{subtitle}</p>
      </div>
    </section>
  );
}

function Stats({ l, rows, count, short }: { l: Ledger; rows: Balance[]; count?: number | undefined; short?: boolean }) {
  const s = ledgerTotals(rows, l);
  const n = short ? "" : ` ${roleLabel[l]}`;
  return (
    <>
      <StatCard icon={Wallet} tone="blue" label={`Total Saldo${n}`} value={rupiah(s.saldo)} />
      <StatCard icon={TrendingUp} tone="green" label={`Total Pemasukan${n}`} value={rupiah(s.masuk)} />
      <StatCard icon={TrendingDown} tone="red" label={`Total Pengeluaran${n}`} value={rupiah(s.keluar)} />
      <StatCard icon={Receipt} tone="gray" label={`Jumlah Transaksi${n}`} value={count === undefined ? "…" : String(count)} />
    </>
  );
}

function TypePill({ t }: { t: TxRow["tx_type"] }) {
  const cls = t === "income" ? "bg-success-soft text-success" : t === "expense" ? "bg-danger-soft text-destructive" : "bg-info-soft text-primary";
  return <span className={`dash-pill ${cls}`}>{txTypeLabel[t]}</span>;
}

function AccountList({ rows, ledger, isSuper }: { rows: Balance[]; ledger: Ledger | "all"; isSuper: boolean }) {
  const list = rows.filter((r) => ledger === "all" || r.ledger === ledger);
  return (
    <Panel title="Rekening" action={isSuper ? <Link to="/rekening" className={linkCls}>Lihat Semua</Link> : undefined} className="dash-reveal">
      <div className="divide-y">
        {list.map((r) => (
          <div key={r.account_id} className="flex items-center gap-3 py-2.5">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-info-soft text-xs font-extrabold text-primary">{(r.name ?? "?").slice(0, 2).toUpperCase()}</span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{r.name}</p>
              <p className="text-[11px] text-muted-foreground">{ledgerName(r.ledger)}</p>
            </div>
            <p className="shrink-0 text-sm font-bold tabular-nums">{rupiah(r.balance)}</p>
          </div>
        ))}
        {!list.length && <p className="py-6 text-center text-xs text-muted-foreground">Belum ada rekening</p>}
      </div>
    </Panel>
  );
}

function RecentTx({ ledger, className }: { ledger: Ledger | "all"; className?: string }) {
  const q = useQuery(txQ({ from: monthStart(1), to: today(), ledger }));
  const [editId, setEditId] = useState<string | null>(null);
  const [delId, setDelId] = useState<string | null>(null);
  const rows = (q.data ?? []).slice(0, 6);
  return (
    <Panel title="Transaksi Terbaru" action={<Link to="/transaksi" className={linkCls}>Lihat Semua</Link>} className={className}>
      <QueryState isLoading={q.isLoading} error={q.error} empty={!rows.length} emptyText="Belum ada transaksi" onRetry={() => q.refetch()}>
        <div className="overflow-x-auto"><table className="w-full">
          <thead><tr>{["Tanggal", "Rekening", "Keterangan", "Jenis", "Nominal"].map((h) => <th key={h} className={th}>{h}</th>)}<th className={`${th} sticky right-0 z-10`}>Aksi</th></tr></thead>
          <tbody>{rows.map((t) => {
            const plus = t.tx_type === "income" || t.tx_type === "transfer_in";
            return (
              <tr key={t.id}>
                <td className={td}>{fmtDate(t.tx_date)}</td>
                <td className={td}>{t.bank_accounts?.name}</td>
                <td className={`${td} max-w-40 truncate`} title={t.description}>{t.description}</td>
                <td className={td}><TypePill t={t.tx_type} /></td>
                <td className={`${td} text-right font-semibold ${plus ? "text-success" : "text-destructive"}`}>{plus ? "+" : "-"}{rupiah(t.amount)}</td>
                <td className={`${td} sticky right-0 bg-card`}><TransactionActions tx={t} onEdit={setEditId} onDelete={setDelId} /></td>
              </tr>
            );
          })}</tbody>
        </table></div>
      </QueryState>
      <EditTxDialog txId={editId} onClose={() => setEditId(null)} />
      <DeleteTxDialog txId={delId} onClose={() => setDelId(null)} />
    </Panel>
  );
}

function MonthSummary({ ledger }: { ledger: Ledger | "all" }) {
  const q = useQuery(txQ({ from: monthStart(0), to: today(), ledger }));
  const { masuk, keluar } = useMemo(() => {
    const rows = q.data ?? [];
    return {
      masuk: rows.filter((t) => t.tx_type === "income").reduce((s, t) => s + Number(t.amount), 0),
      keluar: rows.filter((t) => t.tx_type === "expense").reduce((s, t) => s + Number(t.amount), 0),
    };
  }, [q.data]);
  const total = masuk + keluar;
  const pct = (v: number) => (total > 0 ? Math.round((v / total) * 100) : 0);
  const bulan = new Date().toLocaleDateString("id-ID", { month: "long", year: "numeric" });
  return (
    <Panel title={`Ringkasan ${bulan}`} action={<Link to="/laporan" className={linkCls}>Lihat Detail</Link>} className="dash-reveal">
      <QueryState isLoading={q.isLoading} error={q.error} onRetry={() => q.refetch()}>
        <div className="h-44">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={[{ n: "Pemasukan", v: masuk }, { n: "Pengeluaran", v: keluar }]} dataKey="v" nameKey="n" innerRadius={50} outerRadius={75} strokeWidth={0}>
                <Cell fill="var(--success)" /><Cell fill="var(--destructive)" />
              </Pie>
              <Tooltip formatter={tip} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <dl className="mt-2 space-y-2 text-xs">
          <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 shrink-0 rounded-full bg-success" /><dt className="flex-1">Pemasukan</dt><dd className="font-semibold tabular-nums">{rupiah(masuk)}</dd><dd className="w-9 text-right text-muted-foreground">{pct(masuk)}%</dd></div>
          <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 shrink-0 rounded-full bg-destructive" /><dt className="flex-1">Pengeluaran</dt><dd className="font-semibold tabular-nums">{rupiah(keluar)}</dd><dd className="w-9 text-right text-muted-foreground">{pct(keluar)}%</dd></div>
          <div className="flex items-center gap-2 border-t pt-2"><dt className="flex-1 font-semibold">Selisih</dt><dd className="font-bold tabular-nums">{rupiah(masuk - keluar)}</dd></div>
        </dl>
      </QueryState>
    </Panel>
  );
}

function Dashboard() {
  const { role } = useAuth();
  const bal = useQuery(balancesQ());
  const counts = useQuery(txCountQ());
  const rows = bal.data ?? [];
  if (role === "super_admin") return <SuperDash bal={bal} counts={counts.data} />;
  const l = role as Ledger;
  return (
    <>
      <PageHeader title="Dashboard Utama" subtitle={`${roleLabel[l]} · Pembukuan & Packing List`} />
      <main className="min-w-0 space-y-4 p-3 sm:p-6">
        <DashHero title={`Dashboard ${roleLabel[l]}`} subtitle="Kelola keuangan dan pengiriman barang dengan mudah, akurat dan terintegrasi" />
        <h2 className="text-sm font-bold">Pembukuan</h2>
        <QueryState isLoading={bal.isLoading} error={bal.error} onRetry={() => bal.refetch()}>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4"><Stats l={l} rows={rows} count={counts.data?.[l]} short /></div>
          <div className="grid min-w-0 gap-4 xl:grid-cols-3">
            <MonthlyChart ledger={l} className="xl:col-span-2" />
            <AccountList rows={rows} ledger={l} isSuper={false} />
          </div>
          <div className="grid min-w-0 gap-4 xl:grid-cols-3">
            <RecentTx ledger={l} className="dash-reveal xl:col-span-2" />
            <MonthSummary ledger={l} />
          </div>
          <Panel title="Saldo Setiap Rekening" className="dash-reveal">
            <div className="h-60">
              <ResponsiveContainer>
                <BarChart data={rows.filter((r) => r.ledger === l).map((r) => ({ a: r.name, v: Number(r.balance) }))}>
                  <XAxis dataKey="a" fontSize={12} /><YAxis hide /><Tooltip formatter={tip} />
                  <Bar dataKey="v" name="Saldo" radius={[6, 6, 0, 0]}>{rows.map((r, i) => <Cell key={r.account_id} fill={barColors[i % 5]} />)}</Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-3 text-center text-[11px] sm:grid-cols-5">{rows.filter((r) => r.ledger === l).map((r) => <div key={r.account_id} className="min-w-0 break-words"><b>{r.name}</b><br />{rupiah(r.balance)}</div>)}</div>
          </Panel>
        </QueryState>
        <PackingDashboard />
      </main>
    </>
  );
}

function MonthlyChart({ ledger, className }: { ledger: Ledger; className?: string }) {
  const q = useQuery(txQ({ from: monthStart(5), ledger }));
  const data = useMemo(() => {
    const months = Array.from({ length: 6 }, (_, i) => monthStart(5 - i).slice(0, 7));
    return months.map((m) => {
      const t = (q.data ?? []).filter((x) => x.tx_date.startsWith(m));
      return { m: new Date(m + "-01").toLocaleDateString("id-ID", { month: "short" }), masuk: t.filter((x) => x.tx_type === "income").reduce((s, x) => s + Number(x.amount), 0), keluar: t.filter((x) => x.tx_type === "expense").reduce((s, x) => s + Number(x.amount), 0) };
    });
  }, [q.data]);
  return (
    <Panel title="Grafik Keuangan (6 bulan)" className={className}>
      <QueryState isLoading={q.isLoading} error={q.error} onRetry={() => q.refetch()}>
        <div className="h-60">
          <ResponsiveContainer>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="m" fontSize={11} /><YAxis tickFormatter={shortJt} fontSize={11} width={45} />
              <Tooltip formatter={tip} /><Legend verticalAlign="top" align="right" />
              <Line dataKey="masuk" name="Pemasukan" stroke="var(--success)" strokeWidth={2} />
              <Line dataKey="keluar" name="Pengeluaran" stroke="var(--destructive)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </QueryState>
    </Panel>
  );
}

function SuperDash({ bal, counts }: { bal: ReturnType<typeof useQuery<Balance[]>>; counts?: { admin1: number; admin2: number } | undefined }) {
  const rows = bal.data ?? [];
  const cmp = compareBalances(rows);
  const stat = (s: string) => cmp.filter((c) => c.status === s).length;
  return (
    <>
      <PageHeader title="Dashboard Utama" subtitle="Super Admin · Pembukuan & Packing List" />
      <main className="min-w-0 space-y-5 p-3 sm:p-6">
        <DashHero title="Dashboard Super Admin" subtitle="Pantau dan bandingkan pembukuan Admin 1 dan Admin 2 secara terintegrasi" />
        <QueryState isLoading={bal.isLoading} error={bal.error} onRetry={() => bal.refetch()}>
          <div className="grid min-w-0 gap-5 2xl:grid-cols-2">{(["admin1", "admin2"] as const).map((ledger) => <section key={ledger} className="min-w-0" aria-label={`Ringkasan ${roleLabel[ledger]}`}><h2 className="mb-2 text-sm font-bold">Pembukuan {roleLabel[ledger]}</h2><div className="grid min-w-0 grid-cols-1 gap-3 min-[400px]:grid-cols-2 md:grid-cols-4"><Stats l={ledger} rows={rows} count={counts?.[ledger]} short /></div></section>)}</div>
          <div className="grid min-w-0 gap-4 xl:grid-cols-3">
            <Panel title="Grafik Saldo per Rekening" className="dash-reveal xl:col-span-2">
              <div className="h-64"><ResponsiveContainer>
                <BarChart data={cmp}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="name" fontSize={11} /><YAxis tickFormatter={shortJt} fontSize={11} width={45} /><Tooltip formatter={tip} /><Legend />
                  <Bar dataKey="admin1" name="Admin 1" fill="var(--chart-1)" radius={[6, 6, 0, 0]} /><Bar dataKey="admin2" name="Admin 2" fill="var(--chart-2)" radius={[6, 6, 0, 0]} /></BarChart>
              </ResponsiveContainer></div>
            </Panel>
            <AccountList rows={rows} ledger="all" isSuper />
          </div>
          <div className="grid min-w-0 gap-4 xl:grid-cols-3">
            <RecentTx ledger="all" className="dash-reveal xl:col-span-2" />
            <MonthSummary ledger="all" />
          </div>
          <div className="grid min-w-0 gap-4 xl:grid-cols-2">
            <Panel title="Perbandingan Saldo Rekening" className="dash-reveal">
              <div className="hidden overflow-x-auto md:block"><table className="w-full">
                <thead><tr>{["Rekening", "Admin 1", "Admin 2", "Selisih", "Status"].map((h) => <th key={h} className={th}>{h}</th>)}</tr></thead>
                <tbody>{cmp.map((c) => <tr key={c.name}><td className={td}><b>{c.name}</b></td><td className={td}>{rupiah(c.admin1)}</td><td className={td}>{rupiah(c.admin2)}</td><td className={td}>{rupiah(c.diff)}</td><td className={td}><StatusBadge s={c.status} /></td></tr>)}</tbody>
              </table></div>
              <div className="grid gap-3 sm:grid-cols-2 md:hidden">{cmp.map((c) => <div key={c.name} className="min-w-0 border-b pb-3 last:border-b-0"><div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2"><h3 className="font-bold">{c.name}</h3><StatusBadge s={c.status} /></div><dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-xs"><dt className="text-muted-foreground">Admin 1</dt><dd className="break-words text-right font-medium tabular-nums">{rupiah(c.admin1)}</dd><dt className="text-muted-foreground">Admin 2</dt><dd className="break-words text-right font-medium tabular-nums">{rupiah(c.admin2)}</dd><dt className="text-muted-foreground">Selisih</dt><dd className="break-words text-right font-bold tabular-nums">{rupiah(c.diff)}</dd></dl></div>)}</div>
            </Panel>
            <Panel title="Status Kecocokan Saldo" className="dash-reveal">
              <div className="h-64"><ResponsiveContainer>
                <PieChart><Pie data={[{ n: "Cocok", v: stat("Cocok") }, { n: "Tidak Cocok", v: stat("Tidak Cocok") }]} dataKey="v" nameKey="n" innerRadius={50} outerRadius={80}>
                  <Cell fill="var(--success)" /><Cell fill="var(--destructive)" /></Pie><Tooltip /><Legend /></PieChart>
              </ResponsiveContainer></div>
            </Panel>
          </div>
        </QueryState>
        <PackingDashboard />
        <MatchPanel />
      </main>
    </>
  );
}

function MatchPanel() {
  const [p, setP] = useState({ from: monthStart(0), to: today() });
  const [page, setPage] = useState(1);
  const q = useQuery(txQ({ from: p.from, to: p.to }));
  const m = useMemo(() => matchTransactions((q.data ?? []).filter((t) => t.tx_type === "income" || t.tx_type === "expense") as TxRow[] as never), [q.data]);
  const pages = Math.max(1, Math.ceil(m.length / 20));
  const cell = (t: TxRow | null) => (t ? `${t.description} · ${rupiah(t.amount)}` : "—");
  return (
    <Panel title="Pencocokan Transaksi Admin 1 vs Admin 2" action={<PeriodFilter from={p.from} to={p.to} onChange={(v) => { setP(v); setPage(1); }} />} className="dash-reveal">
      <p className="mb-2 text-xs text-muted-foreground">Dicocokkan berdasarkan tanggal, rekening, jenis dan nominal. {m.filter((x) => x.status === "Cocok").length} cocok, {m.filter((x) => x.status !== "Cocok").length} belum ada pasangan.</p>
      <QueryState isLoading={q.isLoading} error={q.error} empty={m.length === 0} emptyText="Belum ada transaksi pada periode ini" onRetry={() => q.refetch()}>
        <div className="hidden overflow-x-auto md:block"><table className="w-full">
          <thead><tr>{["Tanggal", "Rekening", "Jenis", "Admin 1", "Admin 2", "Status"].map((h) => <th key={h} className={th}>{h}</th>)}</tr></thead>
          <tbody>{m.slice((page - 1) * 20, page * 20).map((x, i) => { const row = x.a1 ?? x.a2; if (!row) return null; const t = row as unknown as TxRow; return (
            <tr key={i}><td className={td}>{fmtDate(t.tx_date)}</td><td className={td}>{t.bank_accounts?.name}</td><td className={td}>{txTypeLabel[t.tx_type]}</td><td className={td}>{cell(x.a1 as unknown as TxRow)}</td><td className={td}>{cell(x.a2 as unknown as TxRow)}</td><td className={td}><StatusBadge s={x.status} /></td></tr>
          ); })}</tbody>
        </table></div>
        <div className="space-y-3 md:hidden">{m.slice((page - 1) * 20, page * 20).map((x, i) => { const row = x.a1 ?? x.a2; if (!row) return null; const t = row as unknown as TxRow; return <article key={i} className="min-w-0 border-b pb-3"><div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2"><p className="min-w-0 text-xs font-semibold">{fmtDate(t.tx_date)} · {t.bank_accounts?.name}</p><StatusBadge s={x.status} /></div><p className="mt-1 text-xs text-muted-foreground">{txTypeLabel[t.tx_type]}</p><dl className="mt-2 space-y-2 text-xs">{(["a1", "a2"] as const).map((key) => <div key={key}><dt className="font-semibold">{key === "a1" ? "Admin 1" : "Admin 2"}</dt><dd className="mt-0.5 break-words leading-relaxed text-muted-foreground">{cell(x[key] as unknown as TxRow | null)}</dd></div>)}</dl></article>; })}</div>
        <Pager page={page} pages={pages} onPage={setPage} />
      </QueryState>
    </Panel>
  );
}
