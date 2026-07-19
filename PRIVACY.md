# Privacy

ROMGrid is built to keep your data on your device. This page describes what the app touches and why.

## What we store

- **SteamGridDB API key** — stored only in your browser's `localStorage`. It never leaves your device except when your browser calls the SteamGridDB API directly (proxied through our Next.js API route to avoid CORS). It is not sent to any ROMGrid server.
- **Selected games, icons and customization state** — kept in memory during your session. Nothing is persisted server-side.

We do not have user accounts, we do not run a database of users, and we do not sell or share any information.

## Analytics

ROMGrid uses [Vercel Analytics](https://vercel.com/docs/analytics) to measure aggregate usage of the site (page views, referrers, roughly which pages people visit).

- It is **cookieless** — no tracking cookies are set on your device.
- It does **not** collect personal data, does not build user profiles, and does not identify individual visitors.
- It's used only to understand how the site is being used so we can prioritize what to work on next.

You can read more in [Vercel's Analytics data policy](https://vercel.com/docs/analytics/privacy-policy).

## Third-party services

- **SteamGridDB** — image and game data comes from their public API. Their own [privacy policy](https://www.steamgriddb.com/privacy) applies to any request routed to their servers.
- **Vercel** — hosts the site and provides the analytics described above.

## Contact

If you have any privacy-related question, please open an [issue](https://github.com/TheJhoxX/ROMGrid/issues).
