<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep audit presentation formatting in `src/lib/audit-display.ts`; render the existing read-only Supabase audit query as a desktop table and mobile records without changing audit-writing logic.
- Keep Import Excel and Pengguna responsive presentation in their existing routes: mobile records and locally scrollable desktop tables share the same query results to preserve data and workflows.
- Share transaction action controls across transactions, reports, dashboard and transfer history; the audited delete RPC validates ledger access and removes both transfer sides atomically to preserve balances.
- Test deletion SQL with PGlite in an isolated Node test environment using the shipped migration; never delete user financial data for automated verification.
- Keep branding presentation in the shared login shell and sidebar; preserve semantic action icons so controls remain recognizable.
- Reuse one uploaded brand asset pointer across public navigation, login and sidebar, and derive locally served application icons from it to keep branding consistent.
- Keep financial pages authenticated and excluded from indexing; public brand metadata belongs on public content routes, with canonical paths relative until a public domain is available.
- Share reference-backed public shipping content and presentation across public routes; keep the shipping theme scoped and existing Ledger login at /login so public work cannot alter financial styling or authentication behavior.
- Load the homepage Three.js harbor only after hydration and dispose its renderer, animation loop and resources on navigation; this keeps browser-only rendering out of SSR and preserves Ledger performance.
- Keep harbor audio in a homepage-only control with gesture fallback and unmount cleanup, and attach lightweight shared trail geometry to cargo planes; this prevents sound leaking into Ledger and avoids per-frame trail allocations.
- Load roadside harbor buildings from shared locally hosted CC0 model assets and guard asynchronous completion after disposal; this preserves traffic paths and avoids resource leaks on navigation.
- Switch harbor day/night lighting through a homepage-scoped event without remounting the scene; this keeps the camera, simulation and audio continuous while limiting mobile dynamic lights.
