import { createFileRoute } from "@tanstack/react-router";
import { HarborHome } from "@/components/harbor-home";
import ship from "@/assets/pelni-ship.webp.asset.json";
import { publicHead } from "@/lib/public-shipping";

export const Route = createFileRoute("/")({
  head: () => {
    const head = publicHead("CV MR EXPRESS | Agen PELNI Surabaya", "CV MR Express, agen PELNI Surabaya. Pengiriman barang via kapal putih PELNI ke Ambon, Tual, Sorong, Jayapura dan tujuan Indonesia Timur. WhatsApp 082336829960.", "/");
    return { ...head, meta: [...head.meta, { property: "og:image", content: ship.url }, { name: "twitter:image", content: ship.url }] };
  },
  component: Home,
});
function Home() { return <HarborHome />; }