# Contributing to ROMGrid

Thanks for taking the time to contribute. This document is the source of truth for how changes get into the project.

## Before you start

- Open an [issue](https://github.com/TheJhoxX/ROMGrid/issues) before starting anything non-trivial. It's the fastest way to know whether the idea fits and to avoid wasted work.
- All PRs to `main` require review and approval from **@TheJhoxX** — direct pushes are blocked.
- One PR = one focused change. Small, reviewable PRs get merged; large drive-by rewrites don't.

## Development setup

Requires Node.js 20+ and [pnpm](https://pnpm.io/).

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). You'll need a [SteamGridDB API key](https://www.steamgriddb.com/profile/preferences/api) — configure it in the in-app **Settings** page (stored in `localStorage`, never sent to any server other than SGDB's own API).

## Code guidelines

These are the rules used across the codebase. Match them.

- **No comments unless the *why* is non-obvious.** Well-named identifiers self-document. Don't explain *what* the code does; only leave a comment when there's a hidden constraint, subtle invariant, workaround, or surprising behavior.
- **No new files unless necessary.** Prefer editing existing files.
- **All UI strings via `useTranslations`.** Add keys to `messages/en.json` — never hardcode user-facing text in JSX.
- **shadcn first.** Check `src/components/ui/` before reaching for external libraries or hand-rolling primitives.
- **Skip placebo error handling.** Trust internal callers and framework guarantees. Only validate at real boundaries (user input, external APIs).
- **Don't inject HTML into translations.** Compose in JSX (`{t('intro')} <strong>{t('term')}</strong>`) — never `dangerouslySetInnerHTML`.
- **Match existing style.** Prettier + ESLint run on save. If in doubt, run `pnpm lint` and `pnpm typecheck` before pushing.

## Adding a new Frame

Frames are the highest-value contribution. To add one (`dsi`, `psp`, `umd`, `gamecube`, etc.):

1. Add the id to `CONSOLE_FRAME_STYLES` in `src/components/custom/Frame/Frame.tsx`.
2. Write its `<Component>` using container-query units (`cqmin`, `cqw`, `cqh`) so it scales with the wrapper. Reference `ThreeDSFrame` in the same file.
3. Register the frame in the `FRAMES` map. If the standard export engine (`modern-screenshot`) can't reproduce it (e.g. discs needing masks / clip-path), provide a `customExport` in the registration.
4. Add translations under `assetMaker.steps.customize.frames.<id>.title` and `.description` in `messages/en.json`.
5. Verify it in `/uikit` (standalone playground) and in `/asset-maker` (full flow, including batch export).

Frames must produce a correct export at the exact requested pixel size, with transparent regions actually being transparent in the resulting PNG.

## Pull request checklist

Before requesting review, make sure:

- [ ] `pnpm lint` passes
- [ ] `pnpm typecheck` passes (or `pnpm build`)
- [ ] All new user-facing text is in `messages/en.json`
- [ ] Manually tested in the browser — both the change and any flow it touches
- [ ] Screenshots or a short clip attached for UI changes
- [ ] Commit messages are clear (no `wip`, no `fix stuff`)

## Reporting bugs

Open an issue with:

- What you were doing
- What you expected
- What happened instead
- Browser + OS
- Reproduction steps (or a link to a broken deploy)

## License

By contributing, you agree that your contributions will be licensed under the same terms as the rest of the project (see [LICENSE](./LICENSE)).
