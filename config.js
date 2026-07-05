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

  // Backend endpoint that returns the real, live holder count for the
  // token above. This is a small serverless function (see the
  // ansem-holder-api repo) backed by Helius, since public browser-side
  // indexer APIs are unreliable/CORS-blocked for this purpose.
  api: {
    holdersEndpoint: "https://ansem-holder-api.vercel.app/api/holders",
    // Polling interval for live updates, in milliseconds
    pollIntervalMs: 60000
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

// Expose on window so script.js (a separate, non-module script) can read it.
// A top-level `const` does NOT automatically attach to `window`, so this
// explicit assignment is required.
window.ANSEM_CONFIG = ANSEM_CONFIG;
