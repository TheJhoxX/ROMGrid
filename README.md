# ROMGrid

Create ROM icons styled like the real hardware — 3DS, DSi, PSP and more.

Pick your games, choose an icon, customize frame/background/size, and export a batch of PNGs bundled in a zip. Everything runs in your browser.

> Status: **beta**. Expect breaking changes and rough edges.

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

Contributions are very welcome — bug reports, ideas and pull requests all count. See [CONTRIBUTING.md](./CONTRIBUTING.md) for the full guide.

## What's coming next

Head over to the [issues](https://github.com/TheJhoxX/ROMGrid/issues) tab to see planned work, in-progress features and open ideas. That's the source of truth for what's coming — feel free to comment on anything that interests you or open a new issue if you have something in mind.

## License

See [LICENSE](./LICENSE). Source is available for review and contributions; redistribution and commercial use are restricted.
