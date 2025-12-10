# Dash Torrent Tracker

Decentralized torrent tracker built on [Dash Platform](https://dashplatform.readme.io/). Magnet links are stored on-chain, making the tracker censorship-resistant.

**Live demo:** https://litury.github.io/dash-torrent-tracker/

## Features

- Browse torrents stored on Dash Platform testnet
- Add new torrents (requires [Dash Platform Extension](https://chromewebstore.google.com/detail/dash-platform-extension))
- No central server — data lives on blockchain

## Tech Stack

- React 19 + Vite
- Tailwind CSS
- [dash-platform-sdk](https://www.npmjs.com/package/dash-platform-sdk)

## Development

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Build

```bash
npm run build
```

Output in `dist/`

## Data Contract

Torrents are stored using this schema on Dash Platform testnet:

```
Contract ID: 6hVQW16jyvZyGSQk2YVty4ND6bgFXozizYWnPt753uW5
```

Each torrent document contains:
- `name` — torrent name (6-160 chars)
- `description` — description (16-160 chars)
- `magnet` — magnet link (16-1000 chars)

## License

MIT
