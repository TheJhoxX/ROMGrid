# Contributing to ROMGrid

Thanks for taking the time to contribute! This document walks you through how changes make it into the project. If anything is unclear, please open an issue and we'll help you out.

## Before you start

- Check the [issues](https://github.com/TheJhoxX/ROMGrid/issues) tab first — it's the source of truth for what's planned or in progress. Feel free to comment on one you'd like to take, or open a new issue to discuss a new idea before writing code. This helps avoid duplicated work and gives you a quick sanity check on the approach.
- All PRs to `main` are reviewed by **@TheJhoxX** before merging. This is just to keep the codebase coherent while the project is young — not a gatekeeping thing.
- Smaller, focused PRs are easier to review and land faster. If you have a large change in mind, consider splitting it into logical steps.

## Development setup

Requires Node.js 20+ and [pnpm](https://pnpm.io/).

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). You'll need a [SteamGridDB API key](https://www.steamgriddb.com/profile/preferences/api) — configure it in the in-app **Settings** page (stored in `localStorage`, never sent to any server other than SGDB's own API).

## Code guidelines

These are conventions the codebase already follows. We strongly recommend sticking to them so the project stays consistent, but if you have a good reason to deviate, feel free to raise it in the PR.

- **Comments only when the *why* is non-obvious.** Well-named identifiers already document *what* the code does. Comments are best kept for hidden constraints, subtle invariants, workarounds or surprising behavior — otherwise they tend to drift out of sync with the code and become misleading.
- **Prefer editing existing files over creating new ones.** Keeps the file tree easy to navigate and avoids fragmenting related logic. New files are of course fine when a new module genuinely belongs somewhere separate.
- **UI strings live in `messages/en.json`** and are read via `useTranslations`. This keeps translations discoverable in one place and makes it easy to add new languages later.
- **Check `src/components/ui/` before reaching for another library.** shadcn primitives are already installed and styled to match the design system — reusing them keeps the UI coherent.
- **Skip defensive error handling for scenarios that can't happen.** Trust internal callers and framework guarantees. Validation belongs at real boundaries — user input and external APIs.
- **Don't inject HTML into translations.** Compose in JSX instead (`{t('intro')} <strong>{t('term')}</strong>`). It's safer and keeps translations plain text.
- **Match the existing style.** Prettier + ESLint run on save; `pnpm lint` and `pnpm typecheck` should pass before pushing.

## Adding a new Frame

Frames are the highest-value contribution. To add one (`dsi`, `psp`, `umd`, `gamecube`, etc.):

1. Add the id to `CONSOLE_FRAME_STYLES` in `src/components/custom/Frame/Frame.tsx`.
2. Write its `<Component>` using container-query units (`cqmin`, `cqw`, `cqh`) so it scales with the wrapper. Reference `ThreeDSFrame` in the same file.
3. Register the frame in the `FRAMES` map. If the standard export engine (`modern-screenshot`) can't reproduce it (e.g. discs needing masks / clip-path), provide a `customExport` in the registration.
4. Add translations under `assetMaker.steps.customize.frames.<id>.title` and `.description` in `messages/en.json`.
5. Verify it in `/uikit` (standalone playground) and in `/asset-maker` (full flow, including batch export).

Frames must produce a correct export at the exact requested pixel size, with transparent regions actually being transparent in the resulting PNG.

## Pull request checklist

A quick sanity check before requesting review:

- [ ] `pnpm lint` passes
- [ ] `pnpm typecheck` passes (or `pnpm build`)
- [ ] New user-facing text lives in `messages/en.json`
- [ ] Manually tested in the browser — both the change and any flow it touches
- [ ] Screenshots or a short clip attached for UI changes
- [ ] Clear commit messages

## Reporting bugs

Open an issue with:

- What you were doing
- What you expected
- What happened instead
- Browser + OS
- Reproduction steps (or a link to a broken deploy)

## License

By contributing, you agree that your contributions will be licensed under the same terms as the rest of the project (see [LICENSE](./LICENSE)).
