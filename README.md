# ANSEM Live Tracker

A premium glassmorphism crypto dashboard tracking **$ANSEM** on Solana toward a goal of **1,000,000 holders**. Built with plain HTML, CSS, and JavaScript — no build step required — and ready to deploy on GitHub Pages.

![status](https://img.shields.io/badge/status-live-brightgreen) ![license](https://img.shields.io/badge/license-MIT-blue)

## ✨ Features

- **Glassmorphism UI** — frosted glass cards, animated gradient orbs, subtle noise texture
- **Live holder tracking** — polls public Solana data sources on an interval, with automatic fallback to simulated data if a source is rate-limited or unavailable (keeps the demo alive on a static host with no backend)
- **Animated progress bar & counter** toward the 1,000,000 holder goal
- **Milestone tracker** — visually marks reached, upcoming, and future milestones
- **Holder growth chart** — lightweight canvas-based line chart, no chart library dependency
- **QR code** for the tip wallet, generated client-side
- **Copy-to-clipboard** buttons for the token mint and tip wallet addresses
- **Fully responsive** — mobile, tablet, and desktop layouts
- **PWA-ready** — installable via `manifest.json` and works offline via `service-worker.js`
- **One-click deploy** — GitHub Actions workflow publishes to GitHub Pages automatically

## 📁 Project Structure

```
ansem-live-tracker/
├── .github/
│   └── workflows/
│       └── deploy.yml       # GitHub Pages deployment workflow
├── assets/
│   ├── favicon.svg
│   ├── icon-192.svg
│   ├── icon-512.svg
│   └── og-image.svg
├── config.js                 # Token mint, wallet, socials, goals, API endpoints
├── index.html                 # Dashboard markup
├── style.css                  # Glassmorphism styling & responsive layout
├── script.js                  # Dashboard logic (fetching, animation, chart, QR, copy)
├── manifest.json               # PWA manifest
├── service-worker.js           # Offline app-shell caching
└── README.md
```

## 🚀 Getting Started

### 1. Clone or download this repository

```bash
git clone https://github.com/YOUR_USERNAME/ansem-live-tracker.git
cd ansem-live-tracker
```

### 2. Run locally

No build tools needed — any static file server works:

```bash
# Python 3
python3 -m http.server 8080

# or Node.js
npx serve .
```

Then open `http://localhost:8080` in your browser.

### 3. Deploy to GitHub Pages

1. Push this repository to GitHub (see below).
2. In your repo, go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to **GitHub Actions**.
4. Push to the `main` branch — the included workflow (`.github/workflows/deploy.yml`) will automatically build and publish your site.
5. Your dashboard will be live at `https://YOUR_USERNAME.github.io/ansem-live-tracker/`.

```bash
git init
git add .
git commit -m "Initial commit: ANSEM Live Tracker"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/ansem-live-tracker.git
git push -u origin main
```

## ⚙️ Configuration

All customizable values live in **`config.js`**:

| Setting | Description |
|---|---|
| `tokenMint` | Solana token mint address being tracked |
| `tokenName` / `tokenTicker` | Display name and ticker symbol |
| `tipWallet` | Solana wallet address for tips/donations |
| `socials.x` | Link to X (Twitter) profile |
| `holderGoal` | Target holder count (default: 1,000,000) |
| `milestones` | Array of milestone holder counts to display |
| `api` | Public data endpoint URLs and polling interval |
| `explorers` | Block explorer link templates |

Example — updating the token mint:

```js
const ANSEM_CONFIG = {
  tokenMint: "YOUR_NEW_MINT_ADDRESS_HERE",
  // ...
};
```

## 🔌 Live Data Notes

This dashboard is a **static site** with no backend server. It attempts to fetch holder counts directly from a public Solana indexer API in the browser. Because of this:

- Some public APIs enforce **CORS restrictions** or **rate limits** that can block direct browser requests.
- When a live fetch fails, the dashboard **automatically falls back to a locally simulated, slowly-growing count** derived deterministically from the token mint address, so the UI remains functional and demonstrates live-updating behavior rather than showing an error state.
- The status pill in the header indicates whether the dashboard is currently showing **Live** or **Simulated (offline)** data.

### Using your own backend (optional, recommended for production)

For guaranteed accuracy in production, consider running a small serverless function (e.g., Cloudflare Worker, Vercel Function, or AWS Lambda) that:

1. Fetches holder data server-side from a Solana RPC node or an indexer with an API key (e.g., Helius, Solscan Pro).
2. Returns clean JSON without CORS issues.
3. Update `config.js`'s `api` endpoints to point to your proxy instead of the public endpoint.

## 🎨 Customization

- **Colors & theme**: edit the CSS custom properties at the top of `style.css` (`:root { ... }`).
- **Milestones**: edit the `milestones` array in `config.js`.
- **Polling frequency**: edit `api.pollIntervalMs` in `config.js` (default: 30 seconds).
- **Icons/branding**: replace the SVGs in `assets/` with your own artwork (keep the same filenames, or update references in `index.html` and `manifest.json`).

## 🧩 Tech Stack

- Vanilla HTML5, CSS3, JavaScript (ES6+) — zero framework dependencies
- [qrcodejs](https://github.com/davidshimjs/qrcodejs) (via CDN) for client-side QR code generation
- Native `<canvas>` for the holder growth chart
- GitHub Actions + GitHub Pages for hosting and CI/CD

## 📄 License

MIT — free to use, modify, and distribute.

## 🔗 Links

- **Token Mint**: `9cRCn9rGT8V2imeM2BaKs13yhMEais3ruM3rPvTGpump`
- **X Profile**: https://x.com/Bigmayor_16

---

Built with ♥ for the $ANSEM community.
