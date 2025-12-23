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

Data is stored on Dash Platform testnet:

```
Contract ID: 7tyexVc1ivSzep11v486bmUwTgMymUKvQxFeNEBtFVdN
Explorer: https://testnet.platform-explorer.com/dataContract/7tyexVc1ivSzep11v486bmUwTgMymUKvQxFeNEBtFVdN
```

### Document Types

**torrent**
- `name` — torrent name (6-160 chars)
- `description` — description (16-4000 chars)
- `magnet` — magnet link (16-1000 chars)

**comment**
- `torrentId` — reference to torrent document (32-byte identifier)
- `text` — comment text (1-1000 chars)

## License

MIT
