# ROMGrid

Create ROM icons styled like the real hardware — 3DS, DSi, PSP and more.

Pick your games, choose an icon, customize frame/background/size, and export a batch of PNGs bundled in a zip. Everything runs in your browser.

> Status: **beta**. Expect breaking changes and rough edges. Feedback and PRs welcome.

## What is a Frame?

A **Frame** is the core concept of ROMGrid. It's a visual template that wraps your icon so it looks like a native asset from a specific console — defining its shape and which areas are opaque or transparent in the final export. New Frames will keep being added to cover more consoles and formats.

## Features

- Search games via [SteamGridDB](https://www.steamgriddb.com/)
- Pick an icon per game (from SGDB or upload your own)
- Customize per game: background color, border radius, size, frame style
- Batch export to a single `.zip`
- Light / dark / system theme
- Works offline once loaded — your SGDB key never leaves your browser

## Stack

Next.js 16 · React 19 · TypeScript · Tailwind v4 · shadcn/ui · TanStack Query · next-intl · next-themes.

## Getting started

Requires Node.js 20+ and [pnpm](https://pnpm.io/).

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### SteamGridDB API key

ROMGrid uses the SteamGridDB public API. To search games:

1. Get a free key at [steamgriddb.com/profile/preferences/api](https://www.steamgriddb.com/profile/preferences/api).
2. Open the in-app **Settings** page and paste it there.

The key is stored in your browser's `localStorage`. It's never sent to any server other than SteamGridDB's own API (proxied through Next.js API routes to avoid CORS).

## Contributing

Contributions are welcome — bug reports, ideas and pull requests all count.

- Open an [issue](https://github.com/TheJhoxX/ROMGrid/issues) before starting a big change so we can agree on the approach.
- Match the existing style (Prettier + ESLint run on every save; no comments unless the *why* is non-obvious).
- All UI strings live in `messages/en.json` and use `useTranslations`.
- Prefer editing existing files over creating new ones; reach for shadcn primitives before hand-rolling UI.

### Adding a new Frame

A Frame is the most useful thing you can contribute. To add one (e.g. `dsi`, `psp`, `umd`, `gamecube`):

1. Add the id to `CONSOLE_FRAME_STYLES` in `src/components/custom/Frame/Frame.tsx`.
2. Write its `<Component>` using container-query units (`cqmin`) so it scales with the wrapper.
3. If the standard export engine can't reproduce it (e.g. discs needing masks / clip-path), provide a `customExport` and register it in the `FRAMES` map.
4. Add translations for the frame's `title` and `description` under `assetMaker.steps.customize.frames.<id>` in `messages/en.json`.
5. Test it in the `/uikit` playground and the full flow in `/asset-maker`.

## Roadmap

- More Frames (DSi, PSP UMD, GameCube disc, PS1 jewel case, cartridge variants…)
- Additional export formats and sizes
- More languages

## License

See [LICENSE](./LICENSE). Source is available for review and contributions; redistribution and commercial use are restricted.
