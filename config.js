/**
 * config.js
 * Central configuration for the ANSEM Live Tracker dashboard.
 * Edit the values below to point the dashboard at your token, wallet, and socials.
 */

const ANSEM_CONFIG = {
  // Solana token mint address being tracked
  tokenMint: "9cRCn9rGT8V2imeM2BaKs13yhMEais3ruM3rPvTGpump",

  // Display name / ticker
  tokenName: "ANSEM",
  tokenTicker: "$ANSEM",

  // Tip / donation wallet (Solana address)
  tipWallet: "CykNaBUPZqPjsFwPffCoriaadondj27arTw7Df9ajNZc",

  // Social links
  socials: {
    x: "https://x.com/Bigmayor_16",
  },

  // Holder goal displayed on the dashboard
  holderGoal: 1000000,

  // Milestones shown on the tracker (holder counts)
  milestones: [
    1000,
    5000,
    10000,
    25000,
    50000,
    100000,
    250000,
    500000,
    750000,
    1000000
  ],

  // Public data endpoints (no API key required) used to fetch live holder counts.
  // Solscan's public API is used as the primary source; Solana Beach as fallback.
  // Note: these endpoints may rate-limit; the app gracefully falls back to
  // simulated/cached data if all network requests fail (useful for demos or
  // when running purely on GitHub Pages without a backend proxy).
  api: {
    solscanHolderUrl: (mint) =>
      `https://public-api.solscan.io/token/holders?tokenAddress=${mint}&limit=1&offset=0`,
    solscanMetaUrl: (mint) =>
      `https://public-api.solscan.io/token/meta?tokenAddress=${mint}`,
    // Polling interval for live updates, in milliseconds
    pollIntervalMs: 30000
  },

  // Explorer links
  explorers: {
    solscan: (mint) => `https://solscan.io/token/${mint}`,
    solanaFm: (mint) => `https://solana.fm/address/${mint}`,
    birdeye: (mint) => `https://birdeye.so/token/${mint}?chain=solana`
  }
};

// Freeze to avoid accidental mutation at runtime
Object.freeze(ANSEM_CONFIG);
Object.freeze(ANSEM_CONFIG.socials);
Object.freeze(ANSEM_CONFIG.api);
Object.freeze(ANSEM_CONFIG.explorers);
