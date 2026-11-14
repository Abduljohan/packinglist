export const whatsappUrl = "https://wa.me/6282336829960";
export const destinations = [
  { name: "Ambon", days: 4 }, { name: "Tual", days: 4 },
  { name: "Ternate", days: 5 }, { name: "Kaimana", days: 5 }, { name: "Sorong", days: 5 },
  { name: "Fak Fak", days: 6 }, { name: "Manokwari", days: 6 }, { name: "Nabire", days: 6 },
  { name: "Wasior", days: 6 }, { name: "Serui", days: 6 }, { name: "Jayapura", days: 7 },
];
export function publicHead(title: string, description: string, path: string) {
  return { meta: [
    { title }, { name: "description", content: description },
    { property: "og:title", content: title }, { property: "og:description", content: description },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
    { name: "robots", content: "index, follow" },
  ], links: [{ rel: "canonical", href: path }] };
}
export const whatsappGreeting = "Halo CV MR EXPRESS, saya ingin menanyakan informasi pengiriman barang dari Surabaya.";
export function whatsappMessageUrl(message = whatsappGreeting) {
  return `${whatsappUrl}?text=${encodeURIComponent(message)}`;
}
export function whatsappRouteUrl(destination: string) {
  return whatsappMessageUrl(`Halo CV MR EXPRESS, saya ingin menanyakan informasi pengiriman barang dari Surabaya ke ${destination}.`);
}
