import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowRight, ArrowUpRight, Container, Menu, MessageCircle, Ship, X, ShieldCheck, Headphones, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/mr-express-home-logo.png.asset.json";
import ship from "@/assets/pelni-ship.webp.asset.json";
import { destinations, whatsappUrl } from "@/lib/public-shipping";
import { HarborAudio } from "@/components/harbor/harbor-audio";

const navigation = [
  { to: "/", label: "Beranda" }, { to: "/layanan", label: "Layanan" },
  { to: "/rute-pengiriman", label: "Rute Pengiriman" }, { to: "/tentang-kami", label: "Tentang Kami" },
  { to: "/kontak", label: "Kontak" }, { to: "/login", label: "Login" },
] as const;
const scenes = [
  { id: "darat", label: "02 / DARAT", title: "Perjalanan dimulai dari darat.", text: "Dari Surabaya, barang Anda memulai perjalanan menuju pelabuhan dan tujuan di Indonesia Timur." },
  { id: "terminal", label: "03 / TERMINAL", title: "Setiap muatan, satu tujuan.", text: "Kebutuhan barang dan tujuan pengiriman dibicarakan bersama tim CV MR Express." },
  { id: "dermaga", label: "04 / DERMAGA", title: "Dari dermaga menuju laut.", text: "Spesialis pengiriman barang via kapal cepat PELNI (kapal putih)." },
  { id: "operasional", label: "05 / OPERASIONAL", title: "Aman. Amanah. Terhubung.", text: "Komunikasi yang jelas dan layanan responsif untuk membantu kebutuhan pengiriman Anda." },
  { id: "berlayar", label: "06 / BERLAYAR", title: "Indonesia Timur, lebih dekat.", text: "Ambon, Tual, Sorong, Jayapura, dan berbagai tujuan lainnya. Temukan rute pengiriman Anda.", link: true },
];

export function HarborHome() {
  const root = useRef<HTMLDivElement>(null);
  const journey = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [timeMode, setTimeMode] = useState<'day' | 'night'>('day');
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    element.dataset['timeMode'] = timeMode;
    element.dispatchEvent(new Event('harbor-time-change'));
  }, [timeMode]);
  useEffect(() => {
    let cancelled = false;
    let cleanup: (() => void) | undefined;
    import("@/components/harbor/harbor-scene.js").then(({ mountHarbor }) => {
      if (cancelled || !canvas.current || !root.current || !journey.current) return;
      cleanup = mountHarbor(canvas.current, root.current, journey.current, setReady);
    }).catch(() => { if (!cancelled) setReady(false); });
    return () => { cancelled = true; cleanup?.(); };
  }, []);
  useEffect(() => {
    const element = root.current;
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add("revealed"); observer.unobserve(entry.target); }
    }), { threshold: .12 });
    element.querySelectorAll("[data-reveal]").forEach(node => { node.classList.add("reveal-ready"); observer.observe(node); });
    return () => observer.disconnect();
  }, []);
  return <div ref={root} data-time-mode={timeMode} className={`public-site harbor-site bg-background text-foreground ${ready ? "harbor-ready" : ""}`}>
    <div className="harbor-backdrop" aria-hidden="true">
      <img src={ship.url} alt="" width="1800" height="1200" fetchPriority="high" className="harbor-fallback" />
      <canvas ref={canvas} className="harbor-canvas" />
      <div className="harbor-shade" />
    </div>
    <header className="harbor-header">
      <Link to="/" aria-label="CV MR Express — Beranda" className="harbor-brand"><img src={logo.url} alt="CV MR EXPRESS" width="52" height="52" /><span>CV MR EXPRESS</span></Link>
      <nav aria-label="Navigasi utama" className="hidden items-center gap-5 lg:flex">{navigation.map(n => <Link key={n.to} to={n.to} className="harbor-nav" activeOptions={{ exact: true }} activeProps={{ className: "harbor-nav-active" }}>{n.label}</Link>)}</nav>
      <Button asChild className="harbor-cta hidden lg:inline-flex"><a href={whatsappUrl} target="_blank" rel="noopener noreferrer">Hubungi Kami<ArrowUpRight /></a></Button>
      <div className="harbor-header-tools">
        <div className="harbor-time-control" role="group" aria-label="Waktu pelabuhan">
          <Button size="icon" variant="ghost" aria-label="Mode siang" title="Mode siang" aria-pressed={timeMode === 'day'} onClick={() => setTimeMode('day')}><Sun /></Button>
          <Button size="icon" variant="ghost" aria-label="Mode malam" title="Mode malam" aria-pressed={timeMode === 'night'} onClick={() => setTimeMode('night')}><Moon /></Button>
        </div>
        <Button variant="ghost" size="icon" className="harbor-menu-toggle lg:hidden" aria-label={open ? "Tutup menu" : "Buka menu"} aria-expanded={open} aria-controls="harbor-mobile-menu" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</Button>
      </div>
      {open && <nav id="harbor-mobile-menu" aria-label="Navigasi seluler" className="harbor-mobile-menu">{navigation.map(n => <Link key={n.to} to={n.to} onClick={() => setOpen(false)}>{n.label}<ArrowUpRight className="size-4" /></Link>)}</nav>}
    </header>
    <main className="harbor-main">
      <div ref={journey} className="harbor-journey">
        <section className="harbor-intro" id="beranda">
          <div className="harbor-intro-copy">
            <p className="harbor-eyebrow">AGEN PELNI SURABAYA · LOGISTIK LAUT & DARAT</p>
            <h1><span>CV MR</span> EXPRESS</h1>
            <p className="harbor-intro-description">Dari Surabaya, melintasi laut.<br />Menghubungkan barang Anda dengan Indonesia Timur.</p>
            <div className="harbor-actions"><Button asChild size="lg" className="harbor-cta"><a href="#darat">Jelajahi Operasional<ArrowDown /></a></Button><Button asChild size="lg" className="harbor-outline"><a href={whatsappUrl} target="_blank" rel="noopener noreferrer">Hubungi Kami<ArrowUpRight /></a></Button></div>
          </div>
          <div className="harbor-intro-bottom"><span>SURABAYA → INDONESIA TIMUR</span><ArrowDown className="size-5" /><span>LAUT & DARAT</span></div>
        </section>
        {scenes.map(s => <section key={s.id} id={s.id} className="harbor-chapter"><div className="harbor-chapter-copy" data-reveal><p className="harbor-eyebrow">{s.label}</p><h2>{s.title}</h2><p>{s.text}</p>{s.link && <Button asChild className="harbor-cta mt-6"><Link to="/rute-pengiriman">Lihat Rute Pengiriman<ArrowUpRight /></Link></Button>}</div></section>)}
      </div>
      <div className="harbor-finish">
        <div className="harbor-ticker" aria-hidden="true"><span>LAUT / DARAT / SURABAYA / INDONESIA TIMUR /</span></div>
        <section className="public-container harbor-section"><div className="harbor-section-heading"><div><p className="harbor-eyebrow">LAYANAN KAMI</p><h2>Muatan Anda.<br />Perjalanan kami.</h2></div><Button asChild variant="link"><Link to="/layanan">Semua Layanan<ArrowUpRight /></Link></Button></div><div className="harbor-services"><Link to="/layanan" className="harbor-service" data-reveal><Ship /><span>01</span><h3>Via kapal PELNI</h3><p>Pengiriman barang via kapal cepat PELNI (kapal putih) dari Surabaya.</p><ArrowUpRight /></Link><Link to="/layanan" className="harbor-service" data-reveal><Container /><span>02</span><h3>Pengiriman barang</h3><p>Diskusikan kebutuhan muatan dan tujuan pengiriman bersama tim kami.</p><ArrowUpRight /></Link><a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="harbor-service" data-reveal><MessageCircle /><span>03</span><h3>Konsultasi & tarif</h3><p>Tanyakan rute, jadwal, dan informasi tarif langsung melalui WhatsApp.</p><ArrowUpRight /></a></div></section>
        <section className="public-container harbor-section"><div className="harbor-section-heading"><div><p className="harbor-eyebrow">DARI SURABAYA</p><h2>Ke timur.<br />Lebih dekat.</h2></div><Button asChild variant="link"><Link to="/rute-pengiriman">Seluruh Rute<ArrowUpRight /></Link></Button></div><div className="harbor-destinations">{destinations.filter(d => ["Ambon", "Sorong", "Jayapura"].includes(d.name)).map(d => <Link to="/rute-pengiriman" key={d.name} className="harbor-destination" data-reveal><span>SURABAYA<ArrowRight /></span><h3>{d.name}</h3><p>{d.days} hari<ArrowUpRight /></p></Link>)}</div><p className="mt-5 text-xs text-muted-foreground">Estimasi perjalanan dapat berubah. Konfirmasikan jadwal dan pengiriman melalui WhatsApp.</p></section>
        <section className="public-container harbor-section harbor-about"><div><p className="harbor-eyebrow">TENTANG CV MR EXPRESS</p><h2>Partner pengiriman<br />yang Anda percaya.</h2><p className="mt-6 max-w-xl leading-7 text-muted-foreground">Agen PELNI Surabaya. Spesialis pengiriman barang via kapal cepat PELNI (kapal putih) menuju Indonesia Timur.</p><Button asChild variant="link" className="mt-5 px-0"><Link to="/tentang-kami">Tentang Kami<ArrowUpRight /></Link></Button></div><div className="harbor-benefits"><p><Ship />Armada kapal PELNI</p><p><ShieldCheck />Aman & amanah</p><p><Headphones />Layanan responsif</p></div></section>
        <section className="harbor-contact"><div className="public-container"><p className="harbor-eyebrow">MARI TERHUBUNG</p><h2>Siap mengirim<br />barang Anda?</h2><p>Konsultasikan rute, jadwal, dan kebutuhan pengiriman bersama kami.</p><Button asChild size="lg" className="harbor-cta"><a href={whatsappUrl} target="_blank" rel="noopener noreferrer">Chat WhatsApp<ArrowUpRight /></a></Button><a className="harbor-phone" href={whatsappUrl} target="_blank" rel="noopener noreferrer">0823 3682 9960</a></div></section>
        <footer className="public-container harbor-footer"><div><p className="font-extrabold">CV MR EXPRESS</p><p className="mt-2 text-xs text-muted-foreground">Agen PELNI Surabaya · © CV MR EXPRESS</p></div><div className="flex flex-wrap gap-5 text-xs"><Link to="/kontak">Kontak</Link><Link to="/login">MR Express Ledger<ArrowUpRight className="ml-1 inline size-3" /></Link></div><p className="harbor-credit">Website ini dikembangkan oleh <a href="https://tretandevelopment.web.app/" target="_blank" rel="noopener noreferrer">tretan developer</a></p></footer>
      </div>
    </main>
    <div className="harbor-progress" aria-hidden="true"><span>01</span><div><i /></div><span>06</span></div>
    <HarborAudio />
    <Button asChild className="harbor-floating-wa"><a href={whatsappUrl} target="_blank" rel="noopener noreferrer"><MessageCircle /><span>WhatsApp</span></a></Button>
  </div>;
}