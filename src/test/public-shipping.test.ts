import { describe, expect, it } from "vitest";
import { destinations, publicHead, whatsappUrl } from "@/lib/public-shipping";
describe("Reference-backed shipping information", () => {
  it("uses the supplied WhatsApp number in international format", () => {
    expect(whatsappUrl).toBe("https://wa.me/6282336829960");
  });
  it.each([
    ["Ambon", 4], ["Tual", 4], ["Ternate", 5], ["Kaimana", 5], ["Sorong", 5],
    ["Fak Fak", 6], ["Manokwari", 6], ["Nabire", 6], ["Wasior", 6], ["Serui", 6], ["Jayapura", 7],
  ])("keeps %s at the supplied estimate of %i days", (name, days) => {
    expect(destinations.find(d => d.name === name)?.days).toBe(days);
  });
  it("marks public pages indexable with a self-referencing canonical path", () => {
    const head = publicHead("Judul", "Deskripsi", "/layanan");
    expect(head.meta).toContainEqual({ name: "robots", content: "index, follow" });
    expect(head.links).toContainEqual({ rel: "canonical", href: "/layanan" });
  });
});