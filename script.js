/**
 * script.js
 * ANSEM Live Tracker — dashboard logic:
 *  - Live holder count fetching (with graceful fallback/simulation)
 *  - Animated counters & progress bar
 *  - Milestones rendering
 *  - Copy-to-clipboard buttons
 *  - QR code generation for the tip wallet
 *  - Lightweight canvas line chart for holder growth
 */

(function () {
  "use strict";

  const cfg = window.ANSEM_CONFIG;

  // ---------- DOM references ----------
  const els = {
    statusPill: document.getElementById("statusPill"),
    statusText: document.getElementById("statusText"),
    heroLiveText: document.getElementById("heroLiveText"),
    tokenTicker: document.getElementById("tokenTicker"),
    holderCount: document.getElementById("holderCount"),
    progressBar: document.getElementById("progressBar"),
    progressFill: document.getElementById("progressFill"),
    progressPercent: document.getElementById("progressPercent"),
    progressGoal: document.getElementById("progressGoal"),
    statChange24h: document.getElementById("statChange24h"),
    statRemaining: document.getElementById("statRemaining"),
    statUpdated: document.getElementById("statUpdated"),
    mintAddress: document.getElementById("mintAddress"),
    tipAddress: document.getElementById("tipAddress"),
    explorerLinks: document.getElementById("explorerLinks"),
    milestonesTrack: document.getElementById("milestonesTrack"),
    qrcode: document.getElementById("qrcode"),
    toast: document.getElementById("toast"),
    xLink: document.getElementById("xLink"),
    xLinkFooter: document.getElementById("xLinkFooter"),
    growthChart: document.getElementById("growthChart"),
    marketStatusBadge: document.getElementById("marketStatusBadge"),
    marketPrice: document.getElementById("marketPrice"),
    marketChange24h: document.getElementById("marketChange24h"),
    marketCap: document.getElementById("marketCap"),
    marketLiquidity: document.getElementById("marketLiquidity"),
    marketVolume: document.getElementById("marketVolume"),
    dexLink: document.getElementById("dexLink"),
  };
  };

  // ---------- Static content population ----------
  function populateStaticContent() {
    document.title = `${cfg.tokenTicker} Live Tracker — ${formatNumber(cfg.holderGoal)} Holders`;
    els.tokenTicker.textContent = cfg.tokenTicker;
    els.mintAddress.textContent = cfg.tokenMint;
    els.tipAddress.textContent = cfg.tipWallet;
    els.progressGoal.textContent = `Goal: ${formatNumber(cfg.holderGoal)}`;
    els.progressBar.setAttribute("aria-valuemax", String(cfg.holderGoal));
    els.xLink.href = cfg.socials.x;
    els.xLinkFooter.href = cfg.socials.x;

    // Explorer links
    const explorerEntries = [
      { label: "Solscan", url: cfg.explorers.solscan(cfg.tokenMint) },
      { label: "Solana.FM", url: cfg.explorers.solanaFm(cfg.tokenMint) },
      { label: "Birdeye", url: cfg.explorers.birdeye(cfg.tokenMint) },
    ];
    els.explorerLinks.innerHTML = explorerEntries
      .map(
        (e) =>
          `<a class="explorer-link" href="${e.url}" target="_blank" rel="noopener noreferrer">${e.label} ↗</a>`
      )
      .join("");
  }

  // ---------- Formatting helpers ----------
  function formatNumber(n) {
    return Math.round(n).toLocaleString("en-US");
  }

  function formatCompact(n) {
    return new Intl.NumberFormat("en-US", {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(n);
  }

  function formatUsd(n, opts = {}) {
    if (n === null || n === undefined || Number.isNaN(n)) return "—";
    if (opts.compact) {
      return (
        "$" +
        new Intl.NumberFormat("en-US", {
          notation: "compact",
          maximumFractionDigits: 2,
        }).format(n)
      );
    }
    const decimals = n < 0.01 ? 8 : n < 1 ? 6 : 2;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(n);
  }
  }

  // ---------- Toast ----------
  let toastTimer = null;
  function showToast(message) {
    els.toast.textContent = message;
    els.toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => els.toast.classList.remove("show"), 2200);
  }

  // ---------- Copy to clipboard ----------
  function setupCopyButtons() {
    document.querySelectorAll("[data-copy-target]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const targetId = btn.getAttribute("data-copy-target");
        const target = document.getElementById(targetId);
        if (!target) return;
        const text = target.textContent.trim();
        try {
          await copyText(text);
          showToast("Copied to clipboard!");
          btn.classList.add("copied");
          setTimeout(() => btn.classList.remove("copied"), 1500);
        } catch (err) {
          showToast("Copy failed — please copy manually.");
        }
      });
    });
  }

  async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    // Fallback for older browsers / non-secure contexts
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    try {
      document.execCommand("copy");
    } finally {
      document.body.removeChild(textarea);
    }
  }

  // ---------- QR Code ----------
  function renderQRCode() {
    if (typeof QRCode === "undefined") {
      // Library failed to load (e.g. offline) — show plain text fallback
      els.qrcode.textContent = "QR unavailable offline";
      return;
    }
    // Using a solana: URI scheme so compatible wallets can pre-fill the address
    const uri = `solana:${cfg.tipWallet}`;
    new QRCode(els.qrcode, {
      text: uri,
      width: 168,
      height: 168,
      colorDark: "#0b0e1a",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.M,
    });
  }

  // ---------- Milestones ----------
  function renderMilestones(currentHolders) {
    const nextMilestone = cfg.milestones.find((m) => m > currentHolders);
    els.milestonesTrack.innerHTML = cfg.milestones
      .map((m) => {
        const achieved = currentHolders >= m;
        const isNext = m === nextMilestone;
        const classes = ["milestone"];
        if (achieved) classes.push("achieved");
        if (isNext) classes.push("next");
        return `
          <div class="${classes.join(" ")}">
            <span class="milestone-value">${formatCompact(m)}</span>
            <span class="milestone-label">${achieved ? "Reached" : isNext ? "Next Up" : "Holders"}</span>
          </div>
        `;
      })
      .join("");
  }

  // ---------- Animated counter ----------
  let displayedCount = 0;
  function animateCountTo(target) {
    const start = displayedCount;
    const diff = target - start;
    const duration = 900;
    const startTime = performance.now();

    function step(now) {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
      const value = Math.round(start + diff * eased);
      els.holderCount.textContent = formatNumber(value);
      if (t < 1) {
        requestAnimationFrame(step);
      } else {
        displayedCount = target;
      }
    }
    requestAnimationFrame(step);
  }

  // ---------- Progress bar / stats update ----------
  let previousHolders = null;

  function updateDashboard(holders, opts = {}) {
    const pct = Math.min(100, (holders / cfg.holderGoal) * 100);

    animateCountTo(holders);
    els.progressFill.style.width = `${pct}%`;
    els.progressBar.setAttribute("aria-valuenow", String(holders));
    els.progressPercent.textContent = `${pct.toFixed(4)}%`;

    const remaining = Math.max(0, cfg.holderGoal - holders);
    els.statRemaining.textContent = formatNumber(remaining);

    if (previousHolders !== null) {
      const change = holders - previousHolders;
      const sign = change > 0 ? "+" : "";
      els.statChange24h.textContent = `${sign}${formatNumber(change)}`;
      els.statChange24h.style.color = change >= 0 ? "#86efac" : "#fca5a5";
    } else if (opts.simulatedChange !== undefined) {
      const sign = opts.simulatedChange >= 0 ? "+" : "";
      els.statChange24h.textContent = `${sign}${formatNumber(opts.simulatedChange)}`;
      els.statChange24h.style.color = opts.simulatedChange >= 0 ? "#86efac" : "#fca5a5";
    }

    els.statUpdated.textContent = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    renderMilestones(holders);
    updateChart(holders);

    previousHolders = holders;
  }

  function setStatus(state, text) {
    els.statusPill.classList.remove("online", "offline");
    if (state) els.statusPill.classList.add(state);
    els.statusText.textContent = text;
    if (els.heroLiveText) els.heroLiveText.textContent = text;
  }

  // ---------- Data fetching ----------
  // Public indexer APIs are frequently CORS-restricted or rate-limited when
  // called directly from a static GitHub Pages site. We attempt a real fetch
  // first; if it fails, we fall back to a locally-simulated, slowly-growing
  // count so the UI still demonstrates live-updating behavior.

  let simulatedBase = seedFromMint(cfg.tokenMint);

  function seedFromMint(mint) {
    // Deterministic pseudo-seed derived from the mint string so the
    // simulated starting point is stable across reloads.
    let hash = 0;
    for (let i = 0; i < mint.length; i++) {
      hash = (hash * 31 + mint.charCodeAt(i)) >>> 0;
    }
    // Map into a plausible holder range for a growing memecoin
    return 1200 + (hash % 8000);
  }

  async function fetchHolderCount() {
    // Guard against requests that hang by racing against a timeout. The
    // backend can take longer than usual on a cold cache (it may need to
    // paginate through many thousands of holder accounts), so this is
    // more generous than a typical API timeout.
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000);

    try {
      const res = await fetch(cfg.api.holdersEndpoint, {
        headers: { accept: "application/json" },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const total = data?.holders;
      if (typeof total === "number" && total > 0) {
        setStatus("online", "Live");
        return total;
      }
      throw new Error("Unexpected response shape");
    } catch (err) {
      // Fall back to simulated data — still useful for demo purposes and
      // keeps the dashboard visually "alive" even if the backend is briefly
      // unavailable or the request timed out.
      clearTimeout(timeoutId);
      setStatus("offline", "Simulated");
      simulatedBase += Math.floor(Math.random() * 6);
      return simulatedBase;
    }
  }

  async function refresh() {
    const holders = await fetchHolderCount();
    updateDashboard(holders);
  }

  // ---------- Market data (price / market cap / liquidity) ----------
  async function fetchAndRenderMarketData() {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const res = await fetch(cfg.api.marketEndpoint, {
        headers: { accept: "application/json" },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      els.marketPrice.textContent = formatUsd(data.priceUsd);
      els.marketCap.textContent = formatUsd(data.marketCapUsd, { compact: true });
      els.marketLiquidity.textContent = formatUsd(data.liquidityUsd, { compact: true });
      els.marketVolume.textContent = formatUsd(data.volume24hUsd, { compact: true });

      if (typeof data.priceChange24h === "number") {
        const sign = data.priceChange24h >= 0 ? "+" : "";
        els.marketChange24h.textContent = `${sign}${data.priceChange24h.toFixed(2)}%`;
        els.marketChange24h.style.color = data.priceChange24h >= 0 ? "#86efac" : "#fca5a5";
      } else {
        els.marketChange24h.textContent = "—";
      }

      if (data.dexUrl) {
        els.dexLink.href = data.dexUrl;
      }

      els.marketStatusBadge.textContent = data.source === "live" ? "Live" : "Cached";
      els.marketStatusBadge.classList.toggle("online", data.source === "live");
    } catch (err) {
      clearTimeout(timeoutId);
      els.marketStatusBadge.textContent = "Unavailable";
      els.marketStatusBadge.classList.remove("online");
    }
  }

  // ---------- Simple growth chart (canvas) ----------
  const chartHistory = [];
  const MAX_POINTS = 30;

  function updateChart(latestValue) {
    chartHistory.push(latestValue);
    if (chartHistory.length > MAX_POINTS) chartHistory.shift();
    drawChart();
  }

  function drawChart() {
    const canvas = els.growthChart;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const cssWidth = canvas.clientWidth || 800;
    const cssHeight = 260;

    canvas.width = cssWidth * dpr;
    canvas.height = cssHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cssWidth, cssHeight);

    if (chartHistory.length < 2) return;

    const padding = 24;
    const min = Math.min(...chartHistory);
    const max = Math.max(...chartHistory);
    const range = max - min || 1;

    const stepX = (cssWidth - padding * 2) / (chartHistory.length - 1);

    function xAt(i) {
      return padding + i * stepX;
    }
    function yAt(v) {
      return cssHeight - padding - ((v - min) / range) * (cssHeight - padding * 2);
    }

    // Grid lines
    ctx.strokeStyle = "rgba(255,255,255,0.06)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padding + ((cssHeight - padding * 2) / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(cssWidth - padding, y);
      ctx.stroke();
    }

    // Gradient fill under line
    const gradient = ctx.createLinearGradient(0, 0, 0, cssHeight);
    gradient.addColorStop(0, "rgba(139, 92, 246, 0.35)");
    gradient.addColorStop(1, "rgba(139, 92, 246, 0.0)");

    ctx.beginPath();
    ctx.moveTo(xAt(0), yAt(chartHistory[0]));
    chartHistory.forEach((v, i) => {
      if (i === 0) return;
      ctx.lineTo(xAt(i), yAt(v));
    });
    ctx.lineTo(xAt(chartHistory.length - 1), cssHeight - padding);
    ctx.lineTo(xAt(0), cssHeight - padding);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Line
    ctx.beginPath();
    ctx.moveTo(xAt(0), yAt(chartHistory[0]));
    chartHistory.forEach((v, i) => {
      if (i === 0) return;
      ctx.lineTo(xAt(i), yAt(v));
    });
    const lineGradient = ctx.createLinearGradient(0, 0, cssWidth, 0);
    lineGradient.addColorStop(0, "#a78bfa");
    lineGradient.addColorStop(0.5, "#60a5fa");
    lineGradient.addColorStop(1, "#2dd4bf");
    ctx.strokeStyle = lineGradient;
    ctx.lineWidth = 2.5;
    ctx.lineJoin = "round";
    ctx.stroke();

    // Latest point dot
    const lastIndex = chartHistory.length - 1;
    ctx.beginPath();
    ctx.arc(xAt(lastIndex), yAt(chartHistory[lastIndex]), 4, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
  }

  // ---------- Init ----------
  function init() {
    populateStaticContent();
    setupCopyButtons();
    renderQRCode();
    setStatus(null, "Connecting…");

    // Prime the chart + initial state instantly with a simulated value so
    // the UI isn't empty while the first fetch resolves.
    updateDashboard(simulatedBase, { simulatedChange: 0 });

    refresh();
    setInterval(refresh, cfg.api.pollIntervalMs);

    window.addEventListener("resize", drawChart);
  }

  document.addEventListener("DOMContentLoaded", init);
})();
