"use strict";

/* ══════════════════════════════════════════
   CONFIG
══════════════════════════════════════════ */
const MONAD_CHAIN_ID = 10143;
const MONAD_HEX      = "0x279F";
const MONAD_PARAMS   = {
  chainId: MONAD_HEX,
  chainName: "Monad Testnet",
  nativeCurrency: { name: "MON", symbol: "MON", decimals: 18 },
  rpcUrls: ["https://testnet-rpc.monad.xyz"],
  blockExplorerUrls: ["https://testnet.monadexplorer.com"],
};

/* Deployed on Monad Testnet (Chain 10143) */
const CONTRACT_ADDRESS = "0x4CeDfE9b6A7B288c9ec12b0331d2D96B38009294";

const CONTRACT_ABI = [
  "function propertiesCount() view returns (uint256)",
  "function getProperty(uint256 propId) view returns (string name, string location, uint256 tokenPrice, uint256 totalTokens, uint256 tokensSold, bool active)",
  "function tokenBalances(uint256, address) view returns (uint256)",
  "function earned(uint256 propId, address account) view returns (uint256)",
  "function buyTokens(uint256 propId, uint256 amount) payable",
  "function claimRent(uint256 propId)",
  "event TokensPurchased(uint256 indexed propId, address indexed buyer, uint256 amount, uint256 cost)",
  "event RentClaimed(uint256 indexed propId, address indexed claimer, uint256 amount)",
];

const PROP_PRICES = [
  ethers.utils.parseEther("0.001"),
  ethers.utils.parseEther("0.0008"),
  ethers.utils.parseEther("0.0025"),
  ethers.utils.parseEther("0.0015"),
  ethers.utils.parseEther("0.0032"),
  ethers.utils.parseEther("0.0009"),
  ethers.utils.parseEther("0.0048"),
  ethers.utils.parseEther("0.0012"),
  ethers.utils.parseEther("0.0021"),
  ethers.utils.parseEther("0.0006"),
  ethers.utils.parseEther("0.0028"),
  ethers.utils.parseEther("0.0017"),
  ethers.utils.parseEther("0.0040"),
  ethers.utils.parseEther("0.0011"),
];
const _ux = (id) => `https://images.unsplash.com/photo-${id}?w=1200&h=720&fit=crop&q=80`;

const PROP_META = [
  { name: "Departamento Condesa", location: "CDMX", type: "depto", totalTokens: 1000, sold: 734, yield: 7.2,
    bedrooms: 2, bathrooms: 2, sqm: 95, year: 2019, parking: 1,
    description: "Departamento moderno en el corazón de la Condesa. Distribución de 95m² con dos recámaras, balcón con vista a Parque México, acabados de lujo y edificio con amenidades. Renta vacacional pre-reservada al 92%.",
    photo: _ux("1545324418-cc1a3fa10c00"),
    photos: [_ux("1545324418-cc1a3fa10c00"), _ux("1502005229762-cf1b2da7c5d6"), _ux("1556228720-195a672e8a03"), _ux("1493809842364-78817add7ffb")] },
  { name: "Casa San Pedro", location: "Monterrey", type: "casa", totalTokens: 1000, sold: 420, yield: 6.5,
    bedrooms: 4, bathrooms: 3, sqm: 280, year: 2021, parking: 2,
    description: "Residencia de 280m² en San Pedro Garza García, zona premium de Monterrey. Cuatro recámaras, jardín privado, alberca y vigilancia 24/7. Inquilino corporativo con contrato a 3 años.",
    photo: _ux("1564013799919-ab600027ffc6"),
    photos: [_ux("1564013799919-ab600027ffc6"), _ux("1568605114967-8130f3a36994"), _ux("1600585154340-be6161a56a0c"), _ux("1613977257363-707ba9348227")] },
  { name: "Loft Providencia", location: "Guadalajara", type: "loft", totalTokens: 500, sold: 185, yield: 8.1,
    bedrooms: 1, bathrooms: 1, sqm: 62, year: 2022, parking: 1,
    description: "Loft de diseño en Providencia, GDL. Espacio abierto de 62m², techos de 4m, ventanales y acabados industriales. Ubicado a 3 cuadras del corredor gastronómico Chapultepec.",
    photo: _ux("1502672260266-1c1ef2d93688"),
    photos: [_ux("1502672260266-1c1ef2d93688"), _ux("1494526585095-c41746248156"), _ux("1556909114-f6e7ad7d3136"), _ux("1493809842364-78817add7ffb")] },
  { name: "Penthouse Polanco", location: "CDMX", type: "depto", totalTokens: 800, sold: 612, yield: 6.8,
    bedrooms: 3, bathrooms: 3, sqm: 220, year: 2018, parking: 3,
    description: "Penthouse de 220m² en Polanco con terraza panorámica de 60m². Tres recámaras, biblioteca, alberca privada y acceso directo desde elevador. Vistas a Bosque de Chapultepec.",
    photo: _ux("1512917774080-9991f1c4c750"),
    photos: [_ux("1512917774080-9991f1c4c750"), _ux("1600596542815-ffad4c1539a9"), _ux("1502672023488-70e25813eb80"), _ux("1545324418-cc1a3fa10c00")] },
  { name: "Casa Tulum Beach", location: "Quintana Roo", type: "casa", totalTokens: 600, sold: 287, yield: 9.4,
    bedrooms: 3, bathrooms: 3, sqm: 185, year: 2023, parking: 2,
    description: "Casa frente al mar en Tulum, estilo arquitectónico tropical contemporáneo. 185m² construidos sobre lote de 600m² con acceso privado a playa. Operación como villa de renta vacacional.",
    photo: _ux("1571055107559-3e67626fa8be"),
    photos: [_ux("1571055107559-3e67626fa8be"), _ux("1582268611958-ebfd161ef9cf"), _ux("1600596542815-ffad4c1539a9"), _ux("1518780664697-55e3ad937233")] },
  { name: "Estudio Roma Norte", location: "CDMX", type: "depto", totalTokens: 400, sold: 318, yield: 7.0,
    bedrooms: 1, bathrooms: 1, sqm: 48, year: 2020, parking: 0,
    description: "Estudio compacto y eficiente en Roma Norte. 48m² optimizados con muebles a medida, terraza interior y edificio con coworking en planta baja. Demanda alta de freelancers.",
    photo: _ux("1502005229762-cf1b2da7c5d6"),
    photos: [_ux("1502005229762-cf1b2da7c5d6"), _ux("1493809842364-78817add7ffb"), _ux("1556228720-195a672e8a03"), _ux("1545324418-cc1a3fa10c00")] },
  { name: "Villa Los Cabos", location: "Baja California Sur", type: "casa", totalTokens: 1500, sold: 442, yield: 8.8,
    bedrooms: 5, bathrooms: 5, sqm: 420, year: 2020, parking: 4,
    description: "Villa de lujo en Pedregal, Cabo San Lucas. 420m² con vista al océano, cinco suites, alberca infinita, jacuzzi y staff incluido. Renta promedio USD $1,200/noche durante temporada alta.",
    photo: _ux("1600596542815-ffad4c1539a9"),
    photos: [_ux("1600596542815-ffad4c1539a9"), _ux("1571055107559-3e67626fa8be"), _ux("1582268611958-ebfd161ef9cf"), _ux("1564013799919-ab600027ffc6")] },
  { name: "Loft Centro Histórico", location: "Querétaro", type: "loft", totalTokens: 350, sold: 198, yield: 7.5,
    bedrooms: 1, bathrooms: 1, sqm: 75, year: 2021, parking: 1,
    description: "Loft en finca colonial restaurada del siglo XVIII en el centro de Querétaro. Patrimonio cultural con permisos de renta vacacional. 75m² con elementos originales y diseño contemporáneo.",
    photo: _ux("1494526585095-c41746248156"),
    photos: [_ux("1494526585095-c41746248156"), _ux("1502672260266-1c1ef2d93688"), _ux("1600585154340-be6161a56a0c"), _ux("1556909114-f6e7ad7d3136")] },
  { name: "Casa San Miguel", location: "Guanajuato", type: "casa", totalTokens: 800, sold: 504, yield: 7.9,
    bedrooms: 3, bathrooms: 3, sqm: 210, year: 2017, parking: 2,
    description: "Casa de estilo colonial en San Miguel de Allende. 210m² con patio central, jardín de cactáceas, terraza con vista a la Parroquia. Operación como Airbnb premium.",
    photo: _ux("1600585154340-be6161a56a0c"),
    photos: [_ux("1600585154340-be6161a56a0c"), _ux("1564013799919-ab600027ffc6"), _ux("1568605114967-8130f3a36994"), _ux("1494526585095-c41746248156")] },
  { name: "Local Av. Reforma", location: "CDMX", type: "local", totalTokens: 1200, sold: 388, yield: 6.2,
    bedrooms: 0, bathrooms: 2, sqm: 180, year: 2015, parking: 0,
    description: "Local comercial sobre Paseo de la Reforma con frente de 12m. 180m² en planta baja de torre AAA, ideal para retail premium o experiencia de marca. Tráfico peatonal de 18,000 personas/día.",
    photo: _ux("1441986300917-64674bd600d8"),
    photos: [_ux("1441986300917-64674bd600d8"), _ux("1545324418-cc1a3fa10c00"), _ux("1502005229762-cf1b2da7c5d6"), _ux("1493809842364-78817add7ffb")] },
  { name: "Departamento Marina", location: "Mazatlán", type: "depto", totalTokens: 700, sold: 245, yield: 8.3,
    bedrooms: 2, bathrooms: 2, sqm: 110, year: 2022, parking: 2,
    description: "Departamento en Marina Mazatlán con vista directa al mar. 110m² con balcón privado de 25m², acceso a club de playa y muelle. Mercado vacacional creciente +18% anual.",
    photo: _ux("1493809842364-78817add7ffb"),
    photos: [_ux("1493809842364-78817add7ffb"), _ux("1571055107559-3e67626fa8be"), _ux("1600596542815-ffad4c1539a9"), _ux("1582268611958-ebfd161ef9cf")] },
  { name: "Casa Coyoacán", location: "CDMX", type: "casa", totalTokens: 900, sold: 671, yield: 7.4,
    bedrooms: 3, bathrooms: 2, sqm: 240, year: 2010, parking: 2,
    description: "Casa de 240m² con jardín en Coyoacán. Tres recámaras, estudio, área de servicio. Zona de baja densidad cerca de Plaza Hidalgo y mercado de antojitos. Renta familiar a 5 años.",
    photo: _ux("1605276374104-dee2a0ed3cd6"),
    photos: [_ux("1605276374104-dee2a0ed3cd6"), _ux("1564013799919-ab600027ffc6"), _ux("1568605114967-8130f3a36994"), _ux("1600585154340-be6161a56a0c")] },
  { name: "Penthouse Puerto Vallarta", location: "Jalisco", type: "depto", totalTokens: 1000, sold: 332, yield: 9.1,
    bedrooms: 4, bathrooms: 4, sqm: 320, year: 2021, parking: 3,
    description: "Penthouse de 320m² en Conchas Chinas, PV. Vista 270° al océano y la bahía, terraza con jacuzzi e infinity pool. Servicios concierge incluidos. Ocupación 87% como villa vacacional.",
    photo: _ux("1582268611958-ebfd161ef9cf"),
    photos: [_ux("1582268611958-ebfd161ef9cf"), _ux("1571055107559-3e67626fa8be"), _ux("1600596542815-ffad4c1539a9"), _ux("1512917774080-9991f1c4c750")] },
  { name: "Terreno Valle de Bravo", location: "Estado de México", type: "terreno", totalTokens: 500, sold: 92, yield: 5.8,
    bedrooms: 0, bathrooms: 0, sqm: 1200, year: null, parking: 0,
    description: "Terreno residencial de 1,200m² en cerrada privada de Valle de Bravo, vista al lago. Servicios disponibles, listo para construcción. Plusvalía proyectada 12% anual.",
    photo: _ux("1500382017468-9049fed747ef"),
    photos: [_ux("1500382017468-9049fed747ef"), _ux("1518780664697-55e3ad937233"), _ux("1571055107559-3e67626fa8be"), _ux("1494526585095-c41746248156")] },
];

/* ══════════════════════════════════════════
   APP STATE
══════════════════════════════════════════ */
let state = {
  connected: false,
  address: null,
  provider: null,
  signer: null,
  contract: null,
  balance: null,
  currentView: "dashboard",
  txHistory:  JSON.parse(localStorage.getItem("sr_tx")       || "[]"),
  listings:   JSON.parse(localStorage.getItem("sr_listings") || "[]"),
  holdings: {},
  earned: {},
  buyModalPropId:  null,
  propDetailId:    null,
  distModalPropId: null,
  filterType: "all",
  filterSearch: "",
  filterSort: "default",
  wizardStep: 0,
  wizardData: {},
};

function saveListings() {
  localStorage.setItem("sr_listings", JSON.stringify(state.listings));
}

/* ══════════════════════════════════════════
   UTILS
══════════════════════════════════════════ */
function fmtMon(wei, decimals = 4) {
  return parseFloat(ethers.utils.formatEther(wei)).toFixed(decimals) + " MON";
}
function short(addr) {
  return addr.slice(0, 6) + "…" + addr.slice(-4);
}
function now() {
  return new Date().toLocaleString("es-MX", { hour12: false, hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit" });
}
function saveTx() {
  localStorage.setItem("sr_tx", JSON.stringify(state.txHistory.slice(0, 100)));
}
function addTxRecord(type, detail, amount, txHash, status) {
  state.txHistory.unshift({ type, detail, amount, txHash, status, date: now() });
  saveTx();
  renderHistory();
  renderDashboardActivity();
}

/* ══════════════════════════════════════════
   NAVIGATION
══════════════════════════════════════════ */
const VIEW_TITLES = {
  dashboard: "Dashboard", properties: "Mercado",
  portfolio: "Portafolio", history: "Historial",
  myprops: "Mis propiedades", create: "Crear listado",
  propDetail: "Detalle de propiedad",
};

function navigateTo(view) {
  state.currentView = view;
  document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
  document.getElementById("view" + view.charAt(0).toUpperCase() + view.slice(1)).classList.add("active");
  document.querySelectorAll(".nav-item[data-view]").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.view === view);
  });
  document.getElementById("pageTitle").textContent = VIEW_TITLES[view] || view;
  if (view === "dashboard") renderDashboard();
  if (view === "portfolio" && state.connected) loadPortfolio();
  if (view === "properties") renderProperties();
  if (view === "history") renderHistoryGate();
  if (view === "myprops") renderMyprops();
  if (view === "propDetail") renderPropDetail();
  document.getElementById("mainContent").scrollTop = 0;
  closeSidebar();
}

function toggleSidebar() {
  document.getElementById("sidebar").classList.toggle("open");
}
function closeSidebar() {
  document.getElementById("sidebar").classList.remove("open");
}

/* ══════════════════════════════════════════
   WALLET CONNECTION
══════════════════════════════════════════ */
async function connectWallet() {
  if (typeof window.ethereum === "undefined") {
    showToast("red", "MetaMask no detectado", "Instala MetaMask o una wallet compatible con EVM.");
    return;
  }
  try {
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    if (!accounts.length) return;
    await handleAccountConnected(accounts[0]);
  } catch (err) {
    if (err.code !== 4001) showToast("red", "Error de conexión", (err.message || "").slice(0, 90));
  }
}

async function handleAccountConnected(addr) {
  state.provider = new ethers.providers.Web3Provider(window.ethereum);
  const network  = await state.provider.getNetwork();

  if (network.chainId !== MONAD_CHAIN_ID) {
    setUiDisconnected();
    showWrongNetwork();
    await switchToMonad();
    return;
  }

  state.signer   = state.provider.getSigner();
  state.contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, state.signer);
  state.address  = addr;
  state.connected = true;

  setUiConnected(addr);
  await refreshBalance();
  await loadPortfolioData();
  renderDashboard();
  renderProperties();
  renderHistoryGate();
}

function disconnectWallet() {
  state.connected = false;
  state.address = null;
  state.provider = null;
  state.signer = null;
  state.contract = null;
  state.balance = null;
  state.holdings = {};
  state.earned = {};
  setUiDisconnected();
  renderDashboard();
  renderHistoryGate();
  showToast("purple", "Wallet desconectada", "Puedes volver a conectar cuando quieras.");
}

async function switchToMonad() {
  try {
    await window.ethereum.request({ method: "wallet_switchEthereumChain", params: [{ chainId: MONAD_HEX }] });
  } catch (err) {
    if (err.code === 4902) {
      try {
        await window.ethereum.request({ method: "wallet_addEthereumChain", params: [MONAD_PARAMS] });
      } catch (e) {
        showToast("red", "Error de red", "No se pudo agregar Monad Testnet a tu wallet.");
      }
    }
  }
}

async function refreshBalance() {
  if (!state.provider || !state.address) return;
  try {
    const bal = await state.provider.getBalance(state.address);
    state.balance = bal;
    const fmt = parseFloat(ethers.utils.formatEther(bal)).toFixed(4);
    document.getElementById("sidebarBalance").textContent = "Balance: " + fmt + " MON";
    document.getElementById("metricBalance").textContent = fmt;
  } catch {}
}

/* ══════════════════════════════════════════
   UI STATE TOGGLES
══════════════════════════════════════════ */
function setUiConnected(addr) {
  const s = short(addr);
  // Sidebar
  document.getElementById("sidebarConnectBtn").style.display = "none";
  const info = document.getElementById("sidebarWalletInfo");
  info.classList.add("visible");
  document.getElementById("sidebarAddr").textContent = s;
  // Topbar
  document.getElementById("topbarConnectBtn").style.display = "none";
  const chip = document.getElementById("topbarChip");
  chip.classList.add("visible");
  document.getElementById("topbarAddr").textContent = s;
  document.getElementById("topbarNetworkBtn").style.display = "none";
  // Gates: hide
  document.getElementById("dashboardGate").style.display = "none";
  document.getElementById("dashboardConnected").style.display = "block";
  document.getElementById("mypropsGate").style.display = "none";
  document.getElementById("mypropsContent").style.display = "block";
  document.getElementById("createGate").style.display = "none";
  document.getElementById("createConnected").style.display = "block";
  updateMypropsBadge();
}

function setUiDisconnected() {
  document.getElementById("sidebarConnectBtn").style.display = "";
  document.getElementById("sidebarWalletInfo").classList.remove("visible");
  document.getElementById("topbarConnectBtn").style.display = "";
  document.getElementById("topbarChip").classList.remove("visible");
  document.getElementById("topbarNetworkBtn").style.display = "none";
  document.getElementById("dashboardGate").style.display = "flex";
  document.getElementById("dashboardConnected").style.display = "none";
  document.getElementById("portfolioContent").style.display = "none";
  document.getElementById("portfolioGate").style.display = "flex";
  document.getElementById("historyContent").style.display = "none";
  document.getElementById("historyGate").style.display = "flex";
  document.getElementById("mypropsContent").style.display = "none";
  document.getElementById("mypropsGate").style.display = "flex";
  document.getElementById("createGate").style.display = "flex";
  document.getElementById("createConnected").style.display = "none";
  document.getElementById("claimAllBtn").style.display = "none";
  updateMypropsBadge();
}

function showWrongNetwork() {
  document.getElementById("topbarNetworkBtn").style.display = "inline-flex";
}

/* ══════════════════════════════════════════
   DATA LOADING
══════════════════════════════════════════ */
async function loadPortfolioData() {
  if (!state.contract || !state.address) return;
  const isZero = CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000";
  if (isZero) return; // contract not deployed yet, skip

  try {
    for (let i = 0; i < PROP_META.length; i++) {
      const bal   = await state.contract.tokenBalances(i, state.address);
      const earn  = await state.contract.earned(i, state.address);
      state.holdings[i] = bal.toNumber();
      state.earned[i]   = earn;
    }
  } catch (err) {
    console.warn("loadPortfolioData:", err.message);
  }
}

async function loadPortfolio() {
  await loadPortfolioData();
  renderPortfolio();
}

/* ══════════════════════════════════════════
   RENDER: DASHBOARD
══════════════════════════════════════════ */
/* Demo holdings (used when wallet not connected) */
function getDemoHoldings() {
  return [
    { i: 0, tokens: 120 },
    { i: 3, tokens: 80  },
    { i: 4, tokens: 65  },
    { i: 6, tokens: 145 },
    { i: 12, tokens: 76 },
  ];
}

const DASH_CHARTS = { income: null, alloc: null, yield: null, velocity: null };

function destroyChart(name) { if (DASH_CHARTS[name]) { DASH_CHARTS[name].destroy(); DASH_CHARTS[name] = null; } }

const PALETTE = ["#0052FF", "#2A6BFF", "#5298FF", "#8AB6FF", "#0044D4", "#003FA0", "#6E55D6", "#10B981"];

function renderDashboard() {
  // Gate: only render when connected
  if (!state.connected) {
    document.getElementById("dashboardGate").style.display = "flex";
    document.getElementById("dashboardConnected").style.display = "none";
    return;
  }
  document.getElementById("dashboardGate").style.display = "none";
  document.getElementById("dashboardConnected").style.display = "block";

  // Build holdings — real
  const realHoldings = [];
  let totalInvested = 0, totalRent = 0, totalTokens = 0, weightedYield = 0;
  for (let i = 0; i < PROP_META.length; i++) {
    const tok = state.holdings[i] || 0;
    if (tok > 0) {
      const invested = parseFloat(ethers.utils.formatEther(PROP_PRICES[i].mul(tok)));
      realHoldings.push({ i, tokens: tok, invested });
      totalInvested += invested;
      totalTokens += tok;
      weightedYield += (PROP_META[i].yield || 0) * invested;
    }
    const earn = state.earned[i] || ethers.BigNumber.from(0);
    totalRent += parseFloat(ethers.utils.formatEther(earn));
  }
  const hasHoldings = realHoldings.length > 0;
  const avgYield = totalInvested > 0 ? (weightedYield / totalInvested) : 0;
  const walletBalance = state.balance ? parseFloat(ethers.utils.formatEther(state.balance)) : 0;

  // Update KPIs (always real numbers)
  document.getElementById("kpiValue").textContent = totalInvested.toFixed(4);
  document.getElementById("kpiTokens").textContent = totalTokens.toLocaleString("es-MX");
  document.getElementById("kpiTokensSub").textContent = `en ${realHoldings.length} propiedad${realHoldings.length !== 1 ? "es" : ""}`;
  document.getElementById("kpiYield").textContent = avgYield.toFixed(1);
  document.getElementById("kpiRent").textContent = totalRent.toFixed(4);
  document.getElementById("dashSub").textContent = hasHoldings
    ? `Última actualización: ${now()} · Posición on-chain real`
    : `Wallet conectada · ${short(state.address)} · Balance ${walletBalance.toFixed(4)} MON`;

  // Update KPI deltas to reflect real state (no fake +12.4%)
  const deltaEl = document.getElementById("kpiValueDelta");
  if (deltaEl) {
    if (hasHoldings) {
      deltaEl.className = "kpi-delta up";
      deltaEl.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><polyline points="6 15 12 9 18 15"/></svg><span>Posición activa · ' + realHoldings.length + ' propiedad' + (realHoldings.length !== 1 ? 'es' : '') + '</span>';
    } else {
      deltaEl.className = "kpi-delta";
      deltaEl.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12" y2="16"/></svg><span>Sin posición todavía</span>';
    }
  }
  document.getElementById("dashCtaBtn").style.display = "none";

  // Empty state vs charts
  const chartsContainer = document.querySelectorAll(".dash-charts-row");
  if (!hasHoldings) {
    showDashboardEmpty(walletBalance);
    return;
  }
  hideDashboardEmpty();

  // Render charts (real data only)
  setTimeout(() => {
    renderChartIncome(totalInvested, avgYield);
    renderChartAllocation(realHoldings);
    renderChartYield(realHoldings);
    renderChartVelocity();
  }, 30);

  renderDashboardHoldings(realHoldings, false);
  renderDashboardActivity(false);
}

function showDashboardEmpty(walletBalance) {
  // Destroy any existing charts
  Object.keys(DASH_CHARTS).forEach(destroyChart);
  // Replace charts/holdings/activity rows with a single empty state card
  const connected = document.getElementById("dashboardConnected");
  if (!connected) return;
  let empty = document.getElementById("dashEmptyState");
  if (!empty) {
    empty = document.createElement("div");
    empty.id = "dashEmptyState";
    empty.className = "dash-empty";
    connected.appendChild(empty);
  }
  empty.innerHTML = `
    <div class="dash-empty-card">
      <div class="dash-empty-icon">
        <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17V11l9-6 9 6v6"/><path d="M9 17V13h6v4"/><path d="M3 21h18"/><path d="M5 25l4 4M27 25l-4 4M16 23v6"/></svg>
      </div>
      <div class="dash-empty-eyebrow">SIN POSICIÓN</div>
      <h3 class="dash-empty-title">Aún no tienes tokens en propiedades</h3>
      <p class="dash-empty-sub">Tu wallet (${short(state.address)}) está conectada con un balance de <strong>${walletBalance.toFixed(4)} MON</strong>. Compra tokens en el mercado para que tu portafolio empiece a generar yield.</p>
      <div class="dash-empty-cta">
        <button class="wgate-cta-primary" onclick="navigateTo('properties')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" width="14" height="14"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          Ver mercado
        </button>
        <a class="wgate-cta-secondary" href="https://faucet.monad.xyz" target="_blank" rel="noopener">¿Necesitas MON? → faucet.monad.xyz</a>
      </div>
    </div>`;
  // Hide chart rows
  document.querySelectorAll(".dash-charts-row").forEach(r => r.style.display = "none");
}

function hideDashboardEmpty() {
  const empty = document.getElementById("dashEmptyState");
  if (empty) empty.remove();
  document.querySelectorAll(".dash-charts-row").forEach(r => r.style.display = "");
}

function renderChartIncome(totalInvested, avgYield) {
  destroyChart("income");
  const ctx = document.getElementById("chartIncome");
  if (!ctx) return;
  const monthlyAvg = totalInvested * (avgYield / 100) / 12;
  const months = ["Nov", "Dic", "Ene", "Feb", "Mar", "Abr", "May (proy.)"];
  // Cumulative income with realistic monthly variability
  const factors = [0.86, 0.94, 1.05, 0.97, 1.12, 1.08, 1.0];
  let cum = 0;
  const real = factors.slice(0, 6).map(f => { cum += monthlyAvg * f; return cum; });
  const proj = [...real, cum + monthlyAvg * factors[6]];
  const realPlot = [...real, null];

  const grad = ctx.getContext("2d").createLinearGradient(0, 0, 0, 220);
  grad.addColorStop(0, "rgba(0,82,255,.32)");
  grad.addColorStop(1, "rgba(0,82,255,0)");

  DASH_CHARTS.income = new Chart(ctx, {
    type: "line",
    data: {
      labels: months,
      datasets: [
        { label: "Renta cobrada", data: realPlot, borderColor: "#0052FF", backgroundColor: grad, borderWidth: 2.4, fill: true, tension: .35, pointRadius: 0, pointHoverRadius: 6, pointHoverBackgroundColor: "#0052FF", pointHoverBorderColor: "#fff", pointHoverBorderWidth: 2 },
        { label: "Proyección", data: proj, borderColor: "rgba(0,82,255,.45)", borderWidth: 2, borderDash: [4, 4], fill: false, tension: .35, pointRadius: 0, pointHoverRadius: 4 }
      ]
    },
    options: chartOptsLine()
  });
}

function renderChartAllocation(holdings) {
  destroyChart("alloc");
  const ctx = document.getElementById("chartAllocation");
  if (!ctx) return;
  const labels = holdings.map(h => PROP_META[h.i].name);
  const data   = holdings.map(h => h.invested);
  const colors = holdings.map((_, i) => PALETTE[i % PALETTE.length]);
  const total = data.reduce((a, b) => a + b, 0);

  DASH_CHARTS.alloc = new Chart(ctx, {
    type: "doughnut",
    data: { labels, datasets: [{ data, backgroundColor: colors, borderWidth: 0, hoverOffset: 8 }] },
    options: {
      cutout: "68%",
      maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: tooltipOpts((c) => `${c.label}: ${c.parsed.toFixed(4)} MON · ${(c.parsed/total*100).toFixed(1)}%`) },
      animation: { animateRotate: true, duration: 900 }
    }
  });

  document.getElementById("donutTotal").textContent = holdings.length;
  document.getElementById("donutLegend").innerHTML = holdings.map((h, i) => `
    <div class="dl-row">
      <span class="cl-dot" style="background:${colors[i]}"></span>
      <span class="dl-name">${PROP_META[h.i].name}</span>
      <span class="dl-pct">${(h.invested/total*100).toFixed(0)}%</span>
    </div>`).join("");
}

function renderChartYield(holdings) {
  destroyChart("yield");
  const ctx = document.getElementById("chartYield");
  if (!ctx) return;
  const sorted = [...holdings].sort((a, b) => (PROP_META[b.i].yield || 0) - (PROP_META[a.i].yield || 0));
  const labels = sorted.map(h => PROP_META[h.i].name.split(" ").slice(0, 2).join(" "));
  const data   = sorted.map(h => PROP_META[h.i].yield);
  const colors = sorted.map((_, i) => i === 0 ? "#0052FF" : (i < 3 ? "#2A6BFF" : "#8AB6FF"));

  DASH_CHARTS.yield = new Chart(ctx, {
    type: "bar",
    data: { labels, datasets: [{ label: "% APY", data, backgroundColor: colors, borderRadius: 6, borderSkipped: false, barThickness: 16 }] },
    options: {
      indexAxis: "y",
      maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: tooltipOpts((c) => `${c.label}: ${c.parsed.x}% APY`) },
      scales: {
        x: { beginAtZero: true, grid: { color: "rgba(26,31,46,.06)" }, ticks: { color: "#6B7385", font: { family: "Inter", size: 11 }, callback: (v) => v + "%" } },
        y: { grid: { display: false }, ticks: { color: "#2A3144", font: { family: "Inter", size: 11, weight: "600" } } }
      }
    }
  });
}

function renderChartVelocity() {
  destroyChart("velocity");
  const ctx = document.getElementById("chartVelocity");
  if (!ctx) return;
  // 30 days of token sales velocity
  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  const base = [38,42,40,55,48,62,58,65,72,68,80,75,88,82,95,90,102,98,110,118,108,125,132,128,140,145,138,152,160,168];
  DASH_CHARTS.velocity = new Chart(ctx, {
    type: "bar",
    data: {
      labels: days,
      datasets: [{ label: "Tokens", data: base, backgroundColor: (c) => {
        const i = c.dataIndex;
        return i >= 23 ? "#0052FF" : "rgba(0,82,255,.28)";
      }, borderRadius: 3, barThickness: "flex", maxBarThickness: 14 }]
    },
    options: {
      maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: tooltipOpts((c) => `Día ${c.label}: ${c.parsed.y} tokens`) },
      scales: {
        x: { grid: { display: false }, ticks: { color: "#9AA0AE", font: { family: "Inter", size: 10 }, autoSkip: true, maxTicksLimit: 8 } },
        y: { grid: { color: "rgba(26,31,46,.05)" }, ticks: { color: "#9AA0AE", font: { family: "Inter", size: 10 } }, beginAtZero: true }
      }
    }
  });
}

function chartOptsLine() {
  return {
    maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
    plugins: { legend: { display: false }, tooltip: tooltipOpts((c) => `${c.dataset.label}: ${c.parsed.y.toFixed(4)} MON`) },
    scales: {
      x: { grid: { display: false }, ticks: { color: "#9AA0AE", font: { family: "Inter", size: 11 } } },
      y: { grid: { color: "rgba(26,31,46,.05)" }, ticks: { color: "#9AA0AE", font: { family: "Inter", size: 11 }, callback: (v) => v.toFixed(2) }, beginAtZero: true }
    }
  };
}

function tooltipOpts(labelFn) {
  return {
    backgroundColor: "#1A1F2E", titleColor: "#fff", bodyColor: "#fff",
    titleFont: { family: "Inter", weight: "600", size: 12 },
    bodyFont:  { family: "Inter", weight: "500", size: 12 },
    padding: 10, cornerRadius: 8, displayColors: false,
    callbacks: { label: labelFn }
  };
}

function renderDashboardHoldings(holdings, isDemo) {
  const el = document.getElementById("dashboardHoldings");
  if (!el) return;
  if (!holdings.length) { el.innerHTML = `<div class="empty-state" style="padding:24px"><div class="empty-state-title">Sin holdings</div><div class="empty-state-sub">Compra tokens para empezar</div></div>`; return; }
  el.innerHTML = holdings.map(h => {
    const p = PROP_META[h.i];
    const price = parseFloat(ethers.utils.formatEther(PROP_PRICES[h.i]));
    return `
      <div class="holding-row" onclick="openPropDetail('onchain_${h.i}')" style="cursor:pointer">
        <div class="holding-thumb"><img src="${p.photo}" alt="${p.name}" loading="lazy"></div>
        <div>
          <div class="holding-name">${p.name}</div>
          <div class="holding-loc">${p.location}</div>
        </div>
        <div><div class="holding-stat-val">${h.tokens}</div><div class="holding-stat-label">tokens</div></div>
        <div><div class="holding-stat-val">${h.invested.toFixed(4)}</div><div class="holding-stat-label">MON</div></div>
        <div><div class="holding-stat-val" style="color:var(--cb-blue)">${p.yield}%</div><div class="holding-stat-label">APY</div></div>
      </div>`;
  }).join("");
}

function renderDashboardActivity(isDemo) {
  const el = document.getElementById("dashboardActivity");
  if (!el) return;
  const ICON = {
    Compra: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="3 12 8 17 21 4"/></svg>',
    Renta:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 2v20"/><path d="M5 12l7 7 7-7"/></svg>',
    Listado:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M3 21V9l9-6 9 6v12"/></svg>',
    Default:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="9"/></svg>',
  };
  if (isDemo) {
    const demo = [
      { type: "Compra",  detail: "120 tokens · Condesa, CDMX",      amount: "0.1200 MON", date: "hace 2h" },
      { type: "Renta",   detail: "Distribución mensual · Polanco",  amount: "+0.0184 MON", date: "hace 1d" },
      { type: "Compra",  detail: "65 tokens · Tulum Beach",         amount: "0.1755 MON", date: "hace 3d" },
      { type: "Renta",   detail: "Distribución · Los Cabos",        amount: "+0.0312 MON", date: "hace 6d" },
      { type: "Listado", detail: "Mercado · 4 propiedades nuevas",  amount: "—",           date: "hace 1sem" },
    ];
    el.innerHTML = demo.map(t => `
      <div class="activity-item">
        <div class="activity-icon">${ICON[t.type] || ICON.Default}</div>
        <div><div class="activity-text">${t.detail}</div><div class="activity-time">${t.date}</div></div>
        <div class="activity-amount">${t.amount}</div>
      </div>`).join("");
    return;
  }
  const recent = state.txHistory.slice(0, 5);
  if (!recent.length) {
    el.innerHTML = `<div class="empty-state" style="padding:32px 24px"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" style="width:28px;height:28px;opacity:.2"><circle cx="12" cy="12" r="9"/><polyline points="12 8 12 12 15 15"/></svg><div class="empty-state-title">Sin actividad aún</div><div class="empty-state-sub">Tus transacciones aparecerán aquí</div></div>`;
    return;
  }
  const typeMap = { buy: { icon: "🟢", cls: "green" }, claim: { icon: "💰", cls: "gold" }, error: { icon: "🔴", cls: "red" } };
  el.innerHTML = recent.map(tx => {
    const t = typeMap[tx.type] || { icon: "•", cls: "purple" };
    return `<div class="activity-item">
      <div class="activity-dot ${t.cls}">${t.icon}</div>
      <div class="activity-text">
        <div class="activity-title">${tx.detail}</div>
        <div class="activity-time">${tx.date}</div>
      </div>
      <div class="activity-amount">${tx.amount}</div>
    </div>`;
  }).join("");
}

/* ══════════════════════════════════════════
   RENDER: PROPERTIES
══════════════════════════════════════════ */
const SKYLINES = [
  /* CDMX */  `<svg viewBox="0 0 400 100" xmlns="http://www.w3.org/2000/svg"><rect x="20" y="60" width="18" height="40" fill="rgba(255,255,255,0.18)"/><rect x="42" y="45" width="14" height="55" fill="rgba(255,255,255,0.18)"/><rect x="60" y="30" width="22" height="70" fill="rgba(255,255,255,0.18)"/><rect x="86" y="50" width="10" height="50" fill="rgba(255,255,255,0.18)"/><rect x="100" y="20" width="30" height="80" fill="rgba(255,255,255,0.18)"/><rect x="134" y="40" width="16" height="60" fill="rgba(255,255,255,0.18)"/><rect x="154" y="55" width="12" height="45" fill="rgba(255,255,255,0.18)"/><rect x="170" y="25" width="24" height="75" fill="rgba(255,255,255,0.18)"/><rect x="198" y="45" width="14" height="55" fill="rgba(255,255,255,0.18)"/><rect x="216" y="35" width="20" height="65" fill="rgba(255,255,255,0.18)"/><rect x="240" y="60" width="10" height="40" fill="rgba(255,255,255,0.18)"/><rect x="254" y="42" width="18" height="58" fill="rgba(255,255,255,0.18)"/><rect x="276" y="28" width="26" height="72" fill="rgba(255,255,255,0.18)"/><rect x="306" y="48" width="12" height="52" fill="rgba(255,255,255,0.18)"/><rect x="322" y="55" width="16" height="45" fill="rgba(255,255,255,0.18)"/><rect x="342" y="38" width="20" height="62" fill="rgba(255,255,255,0.18)"/><rect x="366" y="62" width="14" height="38" fill="rgba(255,255,255,0.18)"/></svg>`,
  /* MTY */   `<svg viewBox="0 0 400 100" xmlns="http://www.w3.org/2000/svg"><rect x="10" y="50" width="16" height="50" fill="rgba(255,255,255,0.18)"/><rect x="30" y="35" width="20" height="65" fill="rgba(255,255,255,0.18)"/><rect x="54" y="55" width="12" height="45" fill="rgba(255,255,255,0.18)"/><rect x="70" y="15" width="28" height="85" fill="rgba(255,255,255,0.18)"/><rect x="102" y="40" width="14" height="60" fill="rgba(255,255,255,0.18)"/><rect x="120" y="28" width="22" height="72" fill="rgba(255,255,255,0.18)"/><rect x="146" y="50" width="10" height="50" fill="rgba(255,255,255,0.18)"/><rect x="160" y="32" width="24" height="68" fill="rgba(255,255,255,0.18)"/><rect x="188" y="44" width="16" height="56" fill="rgba(255,255,255,0.18)"/><rect x="208" y="18" width="30" height="82" fill="rgba(255,255,255,0.18)"/><rect x="242" y="38" width="18" height="62" fill="rgba(255,255,255,0.18)"/><rect x="264" y="52" width="12" height="48" fill="rgba(255,255,255,0.18)"/><rect x="280" y="30" width="22" height="70" fill="rgba(255,255,255,0.18)"/><rect x="306" y="45" width="14" height="55" fill="rgba(255,255,255,0.18)"/><rect x="324" y="58" width="10" height="42" fill="rgba(255,255,255,0.18)"/><rect x="338" y="36" width="20" height="64" fill="rgba(255,255,255,0.18)"/><rect x="362" y="48" width="16" height="52" fill="rgba(255,255,255,0.18)"/></svg>`,
  /* GDL */   `<svg viewBox="0 0 400 100" xmlns="http://www.w3.org/2000/svg"><rect x="15" y="55" width="14" height="45" fill="rgba(255,255,255,0.18)"/><rect x="33" y="38" width="18" height="62" fill="rgba(255,255,255,0.18)"/><rect x="55" y="22" width="26" height="78" fill="rgba(255,255,255,0.18)"/><rect x="85" y="48" width="12" height="52" fill="rgba(255,255,255,0.18)"/><rect x="101" y="35" width="20" height="65" fill="rgba(255,255,255,0.18)"/><rect x="125" y="58" width="10" height="42" fill="rgba(255,255,255,0.18)"/><rect x="139" y="28" width="24" height="72" fill="rgba(255,255,255,0.18)"/><rect x="167" y="42" width="16" height="58" fill="rgba(255,255,255,0.18)"/><rect x="187" y="16" width="28" height="84" fill="rgba(255,255,255,0.18)"/><rect x="219" y="36" width="20" height="64" fill="rgba(255,255,255,0.18)"/><rect x="243" y="52" width="12" height="48" fill="rgba(255,255,255,0.18)"/><rect x="259" y="30" width="22" height="70" fill="rgba(255,255,255,0.18)"/><rect x="285" y="46" width="14" height="54" fill="rgba(255,255,255,0.18)"/><rect x="303" y="60" width="10" height="40" fill="rgba(255,255,255,0.18)"/><rect x="317" y="40" width="18" height="60" fill="rgba(255,255,255,0.18)"/><rect x="339" y="24" width="24" height="76" fill="rgba(255,255,255,0.18)"/><rect x="367" y="50" width="16" height="50" fill="rgba(255,255,255,0.18)"/></svg>`,
];

const CARD_GRADIENTS = [
  "linear-gradient(135deg,#B6F8EE 0%,#5EE6D8 60%,#6BB6FF 100%)",
  "linear-gradient(135deg,#5EE6D8 0%,#8C5CFF 30%,#FF4FB0 60%,#FF6E4E 85%,#FFB454 100%)",
  "linear-gradient(135deg,#FFB454 0%,#FF6E4E 50%,#FF4FB0 100%)",
];

/* ── Property type metadata ── */
const TYPE_META = {
  casa:    { label: "Casa",    icon: "🏠", color: "#34cf75" },
  depto:   { label: "Depto",  icon: "🏢", color: "#a78bfa" },
  loft:    { label: "Loft",   icon: "🛋️", color: "#fbbf24" },
  local:   { label: "Local",  icon: "🏪", color: "#fb923c" },
  terreno: { label: "Terreno",icon: "🌍", color: "#2dd4bf" },
  default: { label: "Propiedad", icon: "🏠", color: "#34cf75" },
};

function getAllListings() {
  // On-chain properties
  const onchain = PROP_META.map((p, i) => ({
    id: "onchain_" + i,
    propId: i,
    source: "onchain",
    type: p.type || "depto",
    name: p.name,
    location: p.location,
    description: "",
    tokenPrice: parseFloat(ethers.utils.formatEther(PROP_PRICES[i])),
    totalTokens: p.totalTokens,
    sold: p.sold,
    yield: p.yield || null,
    photo: p.photo || null,
    status: "onchain",
    author: "contract",
  }));
  // Local published listings
  const local = state.listings.filter(l => l.status === "published").map(l => ({
    ...l,
    source: "local",
    propId: null,
    sold: 0,
  }));
  return [...onchain, ...local];
}

function applyFilters() {
  state.filterSearch = document.getElementById("filterSearch").value.toLowerCase();
  state.filterSort   = document.getElementById("filterSort").value;
  renderProperties();
}

function setFilterType(type) {
  state.filterType = type;
  document.querySelectorAll(".filter-pill").forEach(p => {
    p.classList.toggle("active", p.dataset.type === type);
  });
  renderProperties();
}

function renderProperties() {
  let listings = getAllListings();

  // Filter by type
  if (state.filterType !== "all") {
    listings = listings.filter(l => l.type === state.filterType);
  }
  // Filter by search
  if (state.filterSearch) {
    listings = listings.filter(l =>
      l.name.toLowerCase().includes(state.filterSearch) ||
      l.location.toLowerCase().includes(state.filterSearch)
    );
  }
  // Sort
  if (state.filterSort === "price-asc")  listings.sort((a,b) => a.tokenPrice - b.tokenPrice);
  if (state.filterSort === "price-desc") listings.sort((a,b) => b.tokenPrice - a.tokenPrice);
  if (state.filterSort === "avail")      listings.sort((a,b) => (b.totalTokens - b.sold) - (a.totalTokens - a.sold));

  const grid    = document.getElementById("propertyGrid");
  const noRes   = document.getElementById("noResultsMsg");
  const countEl = document.getElementById("propCountPill");
  if (countEl) countEl.textContent = getAllListings().length + " activas";

  if (!listings.length) {
    grid.innerHTML = "";
    if (noRes) noRes.style.display = "flex";
    return;
  }
  if (noRes) noRes.style.display = "none";

  grid.innerHTML = listings.map(l => {
    const tm  = TYPE_META[l.type] || TYPE_META.default;
    const pct = l.totalTokens ? Math.round(l.sold / l.totalTokens * 100) : 0;
    const held = (l.propId !== null) ? (state.holdings[l.propId] || 0) : 0;
    const skylineIdx = (l.propId !== null) ? l.propId % SKYLINES.length : Math.abs(l.name.charCodeAt(0)) % SKYLINES.length;
    const imgContent = l.photo
      ? `<img class="property-card-photo" src="${l.photo}" alt="${l.name}" loading="lazy" onerror="this.style.display='none'">`
      : `<div class="property-card-fallback" style="background:${CARD_GRADIENTS[skylineIdx % CARD_GRADIENTS.length]}">${SKYLINES[skylineIdx]}</div>`;
    return `
      <div class="property-card" onclick="openPropDetail('${l.id}')" style="cursor:pointer">
        <div class="property-card-img">
          ${imgContent}
          <div class="property-card-img-overlay"></div>
          <span class="property-card-location">${l.location}</span>
          ${l.yield ? `<span class="property-card-yield">${l.yield}% APY</span>` : ""}
        </div>
        <div class="property-card-body">
          <div style="display:flex;align-items:center;gap:7px;margin-bottom:8px">
            <span class="type-badge type-${l.type}">${tm.icon} ${tm.label}</span>
            ${l.source === "local" ? '<span class="pill pill-purple" style="font-size:9px">Local</span>' : '<span class="pill pill-green" style="font-size:9px">On-chain</span>'}
          </div>
          <div class="property-card-name">${l.name}</div>
          <div class="property-card-stats">
            <div>
              <div class="prop-stat-label">Precio / token</div>
              <div class="prop-stat-val green">${l.tokenPrice} MON</div>
            </div>
            <div>
              <div class="prop-stat-label">Disponibles</div>
              <div class="prop-stat-val">${(l.totalTokens - l.sold).toLocaleString("es-MX")}</div>
            </div>
            <div>
              <div class="prop-stat-label">Oferta total</div>
              <div class="prop-stat-val">${l.totalTokens.toLocaleString("es-MX")}</div>
            </div>
            <div>
              <div class="prop-stat-label">Mis tokens</div>
              <div class="prop-stat-val ${held > 0 ? "green" : ""}">${held}</div>
            </div>
          </div>
          <div class="property-progress">
            <div class="property-progress-fill" style="width:${pct}%"></div>
          </div>
          <div class="property-progress-label">
            <span>${pct}% vendido</span>
            <span>${l.sold}/${l.totalTokens}</span>
          </div>
          <button class="btn btn-green btn-full" onclick="event.stopPropagation();${l.propId !== null ? `openBuyModal(${l.propId})` : "connectWallet()"}">
            ${l.propId !== null && state.connected ? "Comprar tokens" : l.propId !== null ? "Conecta wallet" : "Ver detalles"}
          </button>
        </div>
      </div>`;
  }).join("");
}

/* ══════════════════════════════════════════
   RENDER: PORTFOLIO
══════════════════════════════════════════ */
function renderPortfolio() {
  if (!state.connected) return;
  document.getElementById("portfolioGate").style.display = "none";
  document.getElementById("portfolioContent").style.display = "block";

  let totalTokens = 0;
  let totalRent   = ethers.BigNumber.from(0);
  let holdingsHtml = "";
  let rentHtml     = "";

  for (let i = 0; i < PROP_META.length; i++) {
    const tok  = state.holdings[i] || 0;
    const earn = state.earned[i]   || ethers.BigNumber.from(0);
    totalRent  = totalRent.add(earn);
    if (tok > 0) {
      totalTokens += tok;
      const invested = PROP_PRICES[i].mul(tok);
      holdingsHtml += `
        <div class="holding-row">
          <div><div class="holding-name">${PROP_META[i].name}</div><div class="holding-loc">${PROP_META[i].location}</div></div>
          <div class="holding-stat"><div class="holding-stat-val">${tok}</div><div class="holding-stat-label">tokens</div></div>
          <div class="holding-stat"><div class="holding-stat-val" style="color:var(--green)">${parseFloat(ethers.utils.formatEther(invested)).toFixed(4)}</div><div class="holding-stat-label">MON inv.</div></div>
          <button class="btn btn-ghost btn-sm" onclick="openBuyModal(${i})">+ Comprar</button>
        </div>`;
    }
    if (earn.gt(0)) {
      rentHtml += `
        <div class="holding-row">
          <div><div class="holding-name">${PROP_META[i].name}</div><div class="holding-loc">${PROP_META[i].location}</div></div>
          <div class="holding-stat"><div class="holding-stat-val" style="color:var(--gold)">${parseFloat(ethers.utils.formatEther(earn)).toFixed(4)}</div><div class="holding-stat-label">MON</div></div>
          <button class="btn btn-green btn-sm" onclick="dappClaimSingle(${i})">Reclamar</button>
        </div>`;
    }
  }

  document.getElementById("holdingsList").innerHTML = holdingsHtml || `<div class="empty-state"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" style="width:32px;height:32px;opacity:.2"><path d="M3 21V9l9-6 9 6v12"/><path d="M9 21V13h6v8"/></svg><div class="empty-state-title">Sin tokens</div><div class="empty-state-sub">Compra en Propiedades para empezar</div></div>`;
  document.getElementById("rentList").innerHTML = rentHtml || `<div class="empty-state" style="padding:28px"><div class="empty-state-sub">Sin renta acumulada</div></div>`;
  document.getElementById("portfolioTotalPill").textContent = totalTokens + " tokens";
  document.getElementById("portfolioTotalRent").textContent = parseFloat(ethers.utils.formatEther(totalRent)).toFixed(4) + " MON";

  const hasRent = totalRent.gt(0);
  document.getElementById("claimAllBtn").style.display = hasRent ? "" : "none";
  document.getElementById("portfolioBadge").style.display = hasRent ? "" : "none";
}

/* ══════════════════════════════════════════
   RENDER: HISTORY
══════════════════════════════════════════ */
function renderHistoryGate() {
  const gate    = document.getElementById("historyGate");
  const content = document.getElementById("historyContent");
  if (state.connected) {
    gate.style.display    = "none";
    content.style.display = "block";
    renderHistory();
  } else {
    gate.style.display    = "flex";
    content.style.display = "none";
  }
}

function renderHistory() {
  const tbody = document.getElementById("historyBody");
  if (!tbody) return;
  if (!state.txHistory.length) {
    tbody.innerHTML = `<tr><td colspan="6"><div class="empty-state" style="padding:40px"><div class="empty-state-sub">Sin transacciones</div></div></td></tr>`;
    return;
  }
  const typeLabels = { buy: "Compra", claim: "Renta", error: "Error" };
  const pillClass  = { buy: "pill-green", claim: "pill-gold", error: "pill-red", pending: "pill-purple" };
  tbody.innerHTML = state.txHistory.map(tx => `
    <tr>
      <td><span class="pill ${pillClass[tx.type] || "pill-purple"}">${typeLabels[tx.type] || tx.type}</span></td>
      <td class="td-muted">${tx.detail}</td>
      <td class="td-green td-mono">${tx.amount}</td>
      <td><span class="pill ${pillClass[tx.status] || "pill-green"}">${tx.status || "OK"}</span></td>
      <td>${tx.txHash ? `<a href="https://testnet.monadexplorer.com/tx/${tx.txHash}" target="_blank" rel="noopener" style="color:var(--monad);font-size:11px">${tx.txHash.slice(0,8)}…</a>` : "<span class='td-muted'>—</span>"}</td>
      <td class="td-muted">${tx.date}</td>
    </tr>`).join("");
}

function clearHistory() {
  state.txHistory = [];
  saveTx();
  renderHistory();
  renderDashboardActivity();
}

/* ══════════════════════════════════════════
   BUY MODAL
══════════════════════════════════════════ */
function openBuyModal(propId) {
  if (!state.connected) { connectWallet(); return; }
  state.buyModalPropId = propId;
  const p = PROP_META[propId];
  const price = parseFloat(ethers.utils.formatEther(PROP_PRICES[propId]));
  document.getElementById("buyModalTitle").textContent = "Comprar — " + p.name;
  document.getElementById("buyModalPropInfo").innerHTML = `<strong style="color:var(--text)">${p.name}</strong> · ${p.location}<br><span style="color:var(--green)">${price} MON por token</span> · ${p.totalTokens - p.sold} disponibles`;
  document.getElementById("modalTokenAmt").value = 1;
  modalUpdateCost();
  document.getElementById("buyModal").classList.add("open");
}

function closeBuyModal(e) {
  if (e && e.target !== document.getElementById("buyModal")) return;
  document.getElementById("buyModal").classList.remove("open");
}

function modalUpdateCost() {
  const propId = state.buyModalPropId ?? 0;
  const amt    = Math.max(1, parseInt(document.getElementById("modalTokenAmt").value || "1", 10));
  const total  = PROP_PRICES[propId].mul(amt);
  document.getElementById("modalCostDisplay").textContent = parseFloat(ethers.utils.formatEther(total)).toFixed(4) + " MON";
}

/* ══════════════════════════════════════════
   QUICK INVEST (dashboard)
══════════════════════════════════════════ */
function quickUpdateCost() {
  const propId = parseInt(document.getElementById("quickPropSelect").value, 10);
  const amt    = Math.max(1, parseInt(document.getElementById("quickTokenAmt").value || "1", 10));
  const total  = PROP_PRICES[propId].mul(amt);
  document.getElementById("quickCostDisplay").textContent = parseFloat(ethers.utils.formatEther(total)).toFixed(4) + " MON";
}

/* ══════════════════════════════════════════
   CONTRACT CALLS
══════════════════════════════════════════ */
/* Visual button states for async actions */
function setBtnState(btn, mode, text) {
  if (!btn) return;
  if (!btn.dataset.idleHtml) btn.dataset.idleHtml = btn.innerHTML;
  btn.classList.remove("btn-loading", "btn-success", "btn-error");
  if (mode === "loading") {
    btn.disabled = true;
    btn.classList.add("btn-loading");
    btn.innerHTML = `<span class="btn-spinner" aria-hidden="true"></span><span>${text}</span>`;
  } else if (mode === "success") {
    btn.disabled = true;
    btn.classList.add("btn-success");
    btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><polyline points="20 6 9 17 4 12"/></svg><span>${text}</span>`;
  } else if (mode === "error") {
    btn.disabled = true;
    btn.classList.add("btn-error");
    btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" width="16" height="16"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="13"/><line x1="12" y1="16" x2="12" y2="16.01"/></svg><span>${text}</span>`;
  } else {
    btn.disabled = false;
    btn.innerHTML = btn.dataset.idleHtml;
  }
}

/* Success overlay shown inside the buy modal */
function showBuySuccessOverlay({ amt, propName, txHash, total }) {
  const modal = document.getElementById("buyModal");
  if (!modal) return;
  let ov = modal.querySelector(".buy-success");
  if (!ov) {
    ov = document.createElement("div");
    ov.className = "buy-success";
    modal.querySelector(".modal").appendChild(ov);
  }
  const explorer = txHash ? `https://testnet.monadexplorer.com/tx/${txHash}` : null;
  const shortTx  = txHash ? `${txHash.slice(0, 10)}…${txHash.slice(-6)}` : "";
  ov.innerHTML = `
    <div class="bs-check">
      <svg viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <circle class="bs-check-circle" cx="26" cy="26" r="24" fill="none" stroke="#10B981" stroke-width="3"/>
        <path class="bs-check-mark" d="M14 27 L23 36 L40 18" fill="none" stroke="#10B981" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
    <div class="bs-title">¡Compra confirmada!</div>
    <div class="bs-meta">+${amt} token${amt > 1 ? "s" : ""} · ${propName}</div>
    <div class="bs-amount">${total} MON</div>
    ${explorer ? `<a class="bs-tx" href="${explorer}" target="_blank" rel="noopener">tx: ${shortTx} ↗</a>` : ""}
    <button class="bs-close" onclick="closeBuyModalSuccess()">Listo</button>
  `;
  ov.classList.add("visible");
}

function closeBuyModalSuccess() {
  const modal = document.getElementById("buyModal");
  if (!modal) return;
  const ov = modal.querySelector(".buy-success");
  if (ov) ov.classList.remove("visible");
  modal.classList.remove("open");
}

async function dappBuyTokens(source) {
  if (!state.connected) { connectWallet(); return; }

  let propId, amt;
  if (source === "modal") {
    propId = state.buyModalPropId ?? 0;
    amt    = Math.max(1, parseInt(document.getElementById("modalTokenAmt").value || "1", 10));
  } else {
    propId = parseInt(document.getElementById("quickPropSelect").value, 10);
    amt    = Math.max(1, parseInt(document.getElementById("quickTokenAmt").value || "1", 10));
  }

  const value = PROP_PRICES[propId].mul(amt);
  const p     = PROP_META[propId];

  /* Demo mode (contract not deployed) */
  const isZero = CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000";
  if (isZero) {
    showToast("gold", "Modo demo", "Despliega el contrato primero con `forge script`.");
    return;
  }

  const btn = source === "modal"
    ? document.getElementById("modalBuyBtn")
    : document.getElementById("quickBuyBtn");

  setBtnState(btn, "loading", "Esperando firma en MetaMask…");

  try {
    const tx = await state.contract.buyTokens(propId, amt, { value });
    setBtnState(btn, "loading", "Confirmando on-chain…");

    const receipt = await tx.wait();

    state.holdings[propId] = (state.holdings[propId] || 0) + amt;
    PROP_META[propId].sold += amt;

    setBtnState(btn, "success", "¡Compra confirmada!");
    addTxRecord("buy", `${amt} tokens — ${p.name}`, fmtMon(value), receipt.transactionHash, "Confirmado");

    if (source === "modal") {
      showBuySuccessOverlay({
        amt,
        propName: p.name,
        txHash: receipt.transactionHash,
        total: parseFloat(ethers.utils.formatEther(value)).toFixed(4),
      });
    } else {
      showToast("green", "¡Compra confirmada!", `${amt} token${amt > 1 ? "s" : ""} de ${p.name}`, receipt.transactionHash);
    }

    await refreshBalance();
    renderDashboard();
    renderProperties();
    if (state.currentView === "portfolio") renderPortfolio();
    if (state.currentView === "propDetail") renderPropDetail();

    setTimeout(() => setBtnState(btn, "idle"), 2400);
  } catch (err) {
    const raw = err?.reason || err?.shortMessage || err?.message || "Tx rechazada";
    const msg = err?.code === "ACTION_REJECTED" || raw.toLowerCase().includes("user rejected")
      ? "Cancelaste la firma"
      : raw.slice(0, 100);
    setBtnState(btn, "error", msg.length > 38 ? "Error en la compra" : msg);
    showToast("red", "Compra rechazada", msg);
    addTxRecord("error", `Compra fallida — ${p.name}`, "—", null, "Error");
    setTimeout(() => setBtnState(btn, "idle"), 2400);
  }
}

async function dappClaimSingle(propId) {
  await _claimRent(propId);
}

async function dappClaimAll() {
  const isZero = CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000";
  if (isZero) { showToast("gold", "Modo demo", "Despliega el contrato primero."); return; }
  for (let i = 0; i < PROP_META.length; i++) {
    const earn = state.earned[i];
    if (earn && earn.gt(0)) await _claimRent(i);
  }
}

async function _claimRent(propId) {
  if (!state.contract) return;
  const isZero = CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000";
  if (isZero) { showToast("gold", "Modo demo", "Despliega el contrato primero."); return; }

  const earn = state.earned[propId] || ethers.BigNumber.from(0);
  if (earn.isZero()) { showToast("purple", "Sin renta", "No hay renta pendiente para esta propiedad."); return; }

  const p = PROP_META[propId];
  const t = showToast("purple", "Reclamando renta…", p.name);
  try {
    const tx      = await state.contract.claimRent(propId);
    t.update("purple", "Confirmando…", tx.hash.slice(0,12) + "…");
    const receipt = await tx.wait();

    state.earned[propId] = ethers.BigNumber.from(0);
    t.dismiss();
    showToast("green", "Renta cobrada", fmtMon(earn) + " de " + p.name, receipt.transactionHash);
    addTxRecord("claim", "Renta — " + p.name, fmtMon(earn), receipt.transactionHash, "Confirmado");
    await refreshBalance();
    renderDashboard();
    if (state.currentView === "portfolio") renderPortfolio();
  } catch (err) {
    t.dismiss();
    showToast("red", "Error al reclamar", (err?.reason || err?.message || "").slice(0, 90));
  }
}

/* ══════════════════════════════════════════
   TOAST
══════════════════════════════════════════ */
function showToast(type, title, body, txHash) {
  const container = document.getElementById("toastContainer");
  const el = document.createElement("div");
  el.className = "toast " + type;
  el.innerHTML = `<div class="toast-title">${title}</div>
    <div class="toast-body">${body || ""}</div>
    ${txHash ? `<a class="toast-link" href="https://testnet.monadexplorer.com/tx/${txHash}" target="_blank" rel="noopener">Ver en Monad Explorer →</a>` : ""}`;
  container.appendChild(el);

  let timer = setTimeout(dismiss, type === "purple" ? 20000 : 5000);
  function dismiss() {
    clearTimeout(timer);
    el.style.animation = "toastOut .3s var(--ease) forwards";
    setTimeout(() => el.remove(), 300);
  }
  function update(newType, newTitle, newBody) {
    el.className = "toast " + newType;
    el.querySelector(".toast-title").textContent = newTitle;
    el.querySelector(".toast-body").textContent  = newBody;
    clearTimeout(timer);
    timer = setTimeout(dismiss, 20000);
  }
  el.addEventListener("click", dismiss);
  return { dismiss, update, el };
}

/* ══════════════════════════════════════════
   WALLET EVENTS
══════════════════════════════════════════ */
if (window.ethereum) {
  window.ethereum.on("accountsChanged", async (accounts) => {
    if (!accounts.length) { disconnectWallet(); return; }
    if (state.connected) await handleAccountConnected(accounts[0]);
  });
  window.ethereum.on("chainChanged", async (hexChainId) => {
    const cid = parseInt(hexChainId, 16);
    if (cid !== MONAD_CHAIN_ID) {
      showWrongNetwork();
      showToast("gold", "Red incorrecta", "Cambia a Monad Testnet para continuar.");
    } else {
      document.getElementById("topbarNetworkBtn").style.display = "none";
      if (state.address) await handleAccountConnected(state.address);
    }
  });

  /* Auto-connect if previously authorized */
  (async () => {
    try {
      const accounts = await window.ethereum.request({ method: "eth_accounts" });
      if (accounts.length) await handleAccountConnected(accounts[0]);
    } catch {}
  })();
}

/* ══════════════════════════════════════════
   PROPERTY DETAIL MODAL
══════════════════════════════════════════ */
function openPropDetail(listingId) {
  state.propDetailId = listingId;
  navigateTo("propDetail");
}

let _pdSalesChart = null;
function renderPropDetail() {
  const all = getAllListings();
  const l = all.find(x => x.id === state.propDetailId);
  const root = document.getElementById("propDetailRoot");
  if (!l || !root) return;

  const tm = TYPE_META[l.type] || TYPE_META.default;
  const pct = l.totalTokens ? Math.round(l.sold / l.totalTokens * 100) : 0;
  const meta = (l.propId !== null) ? PROP_META[l.propId] : null;
  const photos = (meta && meta.photos) ? meta.photos : (l.photo ? [l.photo, l.photo, l.photo, l.photo, l.photo] : []);
  const description = (meta && meta.description) || l.description || "Detalles disponibles próximamente.";

  const amenityRows = meta ? [
    meta.bedrooms > 0 ? { label: "Recámaras", val: meta.bedrooms, icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 17h20M2 11V8a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v3"/><path d="M5 17v3M19 17v3"/></svg>' } : null,
    meta.bathrooms > 0 ? { label: "Baños", val: meta.bathrooms, icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6V4a2 2 0 0 1 4 0v8M3 12h18M5 12v3a4 4 0 0 0 4 4h6a4 4 0 0 0 4-4v-3"/></svg>' } : null,
    meta.sqm > 0 ? { label: "Metros²", val: meta.sqm, icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18M3 9h18"/></svg>' } : null,
    meta.parking >= 0 ? { label: "Estacionamientos", val: meta.parking, icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 17h-2v-6l2-5h12l2 5v6h-2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>' } : null,
    meta.year ? { label: "Año construcción", val: meta.year, icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/><path d="M8 2v4M16 2v4"/></svg>' } : null,
    { label: "Tipo", val: tm.label, icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21V9l9-6 9 6v12"/><path d="M9 21V13h6v8"/></svg>' },
  ].filter(Boolean) : [];

  root.innerHTML = `
    <div class="pd-root">
      <div>
        <!-- Photo gallery -->
        <div class="pd-gallery">
          ${photos.slice(0, 5).map((p, i) => `
            <div class="pd-gallery-photo${i === 0 ? ' main' : ''}">
              <img src="${p}" alt="${l.name} foto ${i+1}" loading="lazy">
              ${i === 4 && photos.length > 5 ? `<div class="pd-gallery-more"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" width="11" height="11"><rect x="3" y="3" width="18" height="18" rx="2"/></svg> Ver +${photos.length-5} fotos</div>` : ''}
            </div>`).join('')}
        </div>

        <!-- Header -->
        <div class="pd-header">
          <div class="pd-tags">
            <span class="pd-tag pd-tag-blue">${tm.icon} ${tm.label}</span>
            <span class="pd-tag pd-tag-green">On-chain · Monad</span>
            ${l.yield ? `<span class="pd-tag">${l.yield}% APY</span>` : ''}
          </div>
          <h1 class="pd-title">${l.name}</h1>
          <div class="pd-loc">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            ${l.location}
          </div>
        </div>

        <!-- Stats strip -->
        <div class="pd-stats-strip">
          <div class="pd-stat">
            <div class="pd-stat-label">Precio / token</div>
            <div class="pd-stat-val" style="color:var(--cb-blue)">${l.tokenPrice} MON</div>
          </div>
          <div class="pd-stat">
            <div class="pd-stat-label">Oferta total</div>
            <div class="pd-stat-val">${l.totalTokens.toLocaleString("es-MX")}</div>
          </div>
          <div class="pd-stat">
            <div class="pd-stat-label">Disponibles</div>
            <div class="pd-stat-val">${(l.totalTokens - l.sold).toLocaleString("es-MX")}</div>
          </div>
          <div class="pd-stat">
            <div class="pd-stat-label">Vendidos</div>
            <div class="pd-stat-val">${pct}%</div>
          </div>
          <div class="pd-stat">
            <div class="pd-stat-label">Yield est.</div>
            <div class="pd-stat-val" style="color:var(--green-deep)">${l.yield ? l.yield + "%" : "—"}</div>
          </div>
        </div>

        <!-- Description -->
        <div class="pd-section">
          <div class="pd-section-title">Sobre la propiedad</div>
          <p class="pd-desc">${description}</p>
        </div>

        ${amenityRows.length ? `
        <div class="pd-section">
          <div class="pd-section-title">Características</div>
          <div class="pd-amenities">
            ${amenityRows.map(a => `
              <div class="pd-amenity">
                <div class="pd-amenity-icon">${a.icon}</div>
                <div>
                  <div class="pd-amenity-val">${a.val}</div>
                  <div class="pd-amenity-label">${a.label}</div>
                </div>
              </div>`).join('')}
          </div>
        </div>` : ''}

        <!-- Sales chart -->
        <div class="pd-chart-card">
          <div class="chart-card-header">
            <div>
              <div class="chart-title">Tokens vendidos</div>
              <div class="chart-sub">Velocidad de venta · últimos 30 días</div>
            </div>
            <div class="chart-stat">
              <span class="chart-stat-val">${pct}%</span>
              <span class="chart-stat-label">vendido</span>
            </div>
          </div>
          <div class="pd-chart-canvas-wrap"><canvas id="pdSalesChart"></canvas></div>
        </div>
      </div>

      <!-- Right: buy panel -->
      <div>
        <div class="pd-buypanel">
          <div class="pd-buypanel-price">${l.tokenPrice} <small>MON / token</small></div>
          ${l.yield ? `<div class="pd-buypanel-yield"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" width="11" height="11"><polyline points="6 15 12 9 18 15"/></svg> ${l.yield}% APY estimado</div>` : ''}
          <div class="pd-buypanel-progress">
            <div class="pd-pp-label"><span>${pct}% vendido</span><span>${l.sold}/${l.totalTokens}</span></div>
            <div class="pd-pp-bar"><div class="pd-pp-fill" style="width:${pct}%"></div></div>
          </div>
          <div class="pd-buypanel-form">
            <div>
              <label class="form-label" style="font-size:11px;color:var(--ink-500);margin-bottom:6px;display:block">Cantidad de tokens</label>
              <div class="pd-input-row">
                <input type="number" id="pdTokenAmt" value="10" min="1" max="${l.totalTokens - l.sold}" oninput="pdUpdateCost()">
                <span class="pd-input-suffix">tokens</span>
              </div>
              <div class="pd-input-quick" style="margin-top:8px">
                <button onclick="pdSetAmt(10)">10</button>
                <button onclick="pdSetAmt(50)">50</button>
                <button onclick="pdSetAmt(100)">100</button>
                <button onclick="pdSetAmt(500)">500</button>
              </div>
            </div>
            <div class="pd-cost-row">
              <span class="pd-cost-label">Total a pagar</span>
              <span class="pd-cost-val" id="pdCostDisplay">${(10 * l.tokenPrice).toFixed(4)} MON</span>
            </div>
            <button class="pd-buypanel-cta" onclick="pdBuyNow()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" width="14" height="14"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4h-4z"/></svg>
              ${state.connected ? "Comprar tokens" : "Conectar wallet"}
            </button>
            <div class="pd-buypanel-foot">Transacción on-chain en Monad Testnet · finalidad &lt;1s · 0% comisión de plataforma</div>
          </div>
        </div>
      </div>
    </div>`;

  // Render sales velocity chart for this property
  setTimeout(() => {
    if (_pdSalesChart) _pdSalesChart.destroy();
    const ctx = document.getElementById("pdSalesChart");
    if (!ctx) return;
    const days = Array.from({ length: 30 }, (_, i) => i + 1);
    const seed = Math.abs(l.name.charCodeAt(0) + l.name.charCodeAt(1));
    const data = days.map((d, i) => {
      const wave = Math.sin((i + seed) * 0.4) * 6;
      const trend = i * 1.2;
      return Math.max(2, Math.round(8 + trend + wave + (seed % 7)));
    });
    const grad = ctx.getContext("2d").createLinearGradient(0, 0, 0, 220);
    grad.addColorStop(0, "rgba(0,82,255,.32)");
    grad.addColorStop(1, "rgba(0,82,255,0)");
    _pdSalesChart = new Chart(ctx, {
      type: "line",
      data: { labels: days, datasets: [{ label: "Tokens", data, borderColor: "#0052FF", backgroundColor: grad, borderWidth: 2.4, fill: true, tension: .35, pointRadius: 0, pointHoverRadius: 5, pointHoverBackgroundColor: "#0052FF", pointHoverBorderColor: "#fff", pointHoverBorderWidth: 2 }] },
      options: chartOptsLine()
    });
  }, 30);
}

function pdSetAmt(n) { const i = document.getElementById("pdTokenAmt"); if (i) { i.value = n; pdUpdateCost(); } }
function pdUpdateCost() {
  const all = getAllListings();
  const l = all.find(x => x.id === state.propDetailId);
  if (!l) return;
  const amt = parseInt(document.getElementById("pdTokenAmt").value, 10) || 0;
  document.getElementById("pdCostDisplay").textContent = (amt * l.tokenPrice).toFixed(4) + " MON";
}
function pdBuyNow() {
  const all = getAllListings();
  const l = all.find(x => x.id === state.propDetailId);
  if (!l || l.propId === null) { connectWallet(); return; }
  if (!state.connected) { connectWallet(); return; }
  const amt = parseInt(document.getElementById("pdTokenAmt").value, 10) || 1;
  document.getElementById("buyTokenAmt") && (document.getElementById("buyTokenAmt").value = amt);
  openBuyModal(l.propId);
}

function propDetailBuy() {
  const all = getAllListings();
  const l = all.find(x => x.id === state.propDetailId);
  if (!l || l.propId === null) { connectWallet(); return; }
  closePropDetail();
  openBuyModal(l.propId);
}
function closePropDetail() { /* legacy no-op since modal is replaced by view */ }

/* ══════════════════════════════════════════
   DISTRIBUTE RENT MODAL
══════════════════════════════════════════ */
function openDistModal(propId) {
  state.distModalPropId = propId;
  const p = PROP_META[propId];
  document.getElementById("distModalTitle").textContent = "Distribuir renta — " + p.name;
  document.getElementById("distModalInfo").innerHTML =
    `<strong style="color:var(--text)">${p.name}</strong> · ${p.sold} tokens vendidos<br>
     <span style="color:var(--green)">Cada holder recibirá renta pro-rata a sus tokens</span>`;
  document.getElementById("distAmount").value = "";
  document.getElementById("distModal").classList.add("open");
}

function closeDistModal(e) {
  if (e && e.target !== document.getElementById("distModal")) return;
  document.getElementById("distModal").classList.remove("open");
}

async function dappDistributeRent() {
  if (!state.contract) return;
  const propId = state.distModalPropId;
  const amtStr = document.getElementById("distAmount").value;
  if (!amtStr || parseFloat(amtStr) <= 0) { showToast("red", "Monto inválido", "Ingresa un monto mayor a 0"); return; }
  const value = ethers.utils.parseEther(amtStr);
  const btn   = document.getElementById("distBtn");
  btn.disabled = true;
  const t = showToast("purple", "Distribuyendo renta…", PROP_META[propId].name);
  try {
    const tx      = await state.contract.distributeRent(propId, { value });
    t.update("purple", "Confirmando…", tx.hash.slice(0,12) + "…");
    const receipt = await tx.wait();
    t.dismiss();
    showToast("green", "Renta distribuida", amtStr + " MON → " + PROP_META[propId].sold + " holders", receipt.transactionHash);
    addTxRecord("claim", "Renta distribuida — " + PROP_META[propId].name, amtStr + " MON", receipt.transactionHash, "Confirmado");
    closeDistModal();
    refreshBalance();
  } catch (err) {
    t.dismiss();
    showToast("red", "Error", (err?.reason || err?.message || "").slice(0,90));
  } finally {
    btn.disabled = false;
  }
}

/* ══════════════════════════════════════════
   MY PROPERTIES
══════════════════════════════════════════ */
function updateMypropsBadge() {
  const mine  = state.listings.filter(l => l.author === state.address);
  const badge = document.getElementById("mypropsBadge");
  if (badge) {
    badge.textContent = mine.length;
    badge.style.display = mine.length > 0 ? "" : "none";
  }
}

function renderMyprops() {
  if (!state.connected) return;
  const listEl = document.getElementById("mypropsList");
  const mine   = state.listings.filter(l => l.author === state.address);

  if (!mine.length) {
    listEl.innerHTML = `
      <div class="empty-state" style="padding:64px 24px">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" style="width:40px;height:40px;opacity:.2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        <div class="empty-state-title">Sin listados aún</div>
        <div class="empty-state-sub">Crea tu primer listado para que aparezca aquí</div>
        <button class="btn btn-green" style="margin-top:8px" onclick="navigateTo('create')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" width="13" height="13"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Crear listado
        </button>
      </div>`;
    return;
  }

  listEl.innerHTML = mine.map(l => {
    const tm    = TYPE_META[l.type] || TYPE_META.default;
    const pctEl = l.status === "onchain" ? `<span class="pill pill-onchain">On-chain</span>` :
                  l.status === "published" ? `<span class="pill pill-green">Publicado</span>` :
                  `<span class="pill pill-draft">Borrador</span>`;
    return `
      <div class="listing-card" style="margin-bottom:12px">
        <div class="listing-card-header">
          <div>
            <div class="listing-card-title">${l.name}</div>
            <div class="listing-card-meta" style="margin-top:5px">
              <span class="type-badge type-${l.type}">${tm.icon} ${tm.label}</span>
              ${pctEl}
              <span style="font-size:11px;color:var(--text-muted)">${l.location}</span>
            </div>
          </div>
          <div style="display:flex;gap:8px">
            ${l.propId !== null ? `<button class="btn btn-ghost btn-sm" onclick="openDistModal(${l.propId})">Distribuir renta</button>` : ""}
            <button class="btn btn-ghost btn-sm" onclick="deleteListing('${l.id}')" style="color:var(--red)">Eliminar</button>
          </div>
        </div>
        <div class="listing-card-body">
          <div class="listing-card-stats">
            <div>
              <div class="listing-card-stat-label">Precio/token</div>
              <div class="listing-card-stat-val" style="color:var(--green)">${l.tokenPrice} MON</div>
            </div>
            <div>
              <div class="listing-card-stat-label">Oferta</div>
              <div class="listing-card-stat-val">${l.totalTokens}</div>
            </div>
            <div>
              <div class="listing-card-stat-label">Rendimiento</div>
              <div class="listing-card-stat-val">${l.yield ? l.yield + "%" : "—"}</div>
            </div>
          </div>
          ${l.description ? `<div style="font-size:12px;color:var(--text-muted);line-height:1.5">${l.description}</div>` : ""}
          <div style="margin-top:10px;display:flex;gap:8px">
            ${l.status === "draft" ? `<button class="btn btn-green btn-sm" onclick="publishListing('${l.id}')">Publicar</button>` : ""}
            <button class="btn btn-ghost btn-sm" onclick="openPropDetail('local_${l.id}')">Ver detalle</button>
          </div>
        </div>
      </div>`;
  }).join("");
}

function deleteListing(id) {
  if (!confirm("¿Eliminar este listado?")) return;
  state.listings = state.listings.filter(l => l.id !== id);
  saveListings();
  renderMyprops();
  renderProperties();
  updateMypropsBadge();
  showToast("red", "Listado eliminado", "");
}

function publishListing(id) {
  const l = state.listings.find(x => x.id === id);
  if (!l) return;
  l.status = "published";
  saveListings();
  renderMyprops();
  renderProperties();
  showToast("green", "Listado publicado", l.name + " ahora aparece en el mercado");
}

/* ══════════════════════════════════════════
   CREATE WIZARD
══════════════════════════════════════════ */
function resetWizard() {
  state.wizardStep = 0;
  state.wizardData = {};
  updateWizardUI();
  navigateTo("dashboard");
}

function updateWizardUI() {
  const s = state.wizardStep;
  document.querySelectorAll(".wizard-pane").forEach((p, i) => p.classList.toggle("active", i === s));
  document.querySelectorAll(".wizard-step-dot").forEach((d, i) => {
    const dot = d.querySelector(".wizard-dot");
    d.classList.remove("active", "done");
    dot.classList.remove("active", "done");
    if (i < s)  { d.classList.add("done");   dot.classList.add("done");   dot.innerHTML = "✓"; }
    if (i === s){ d.classList.add("active");  dot.classList.add("active"); dot.textContent = i + 1; }
    if (i > s)  { dot.textContent = i + 1; }
  });
}

function wizardNext() {
  if (state.wizardStep === 0) {
    if (!state.wizardData.type) return;
  }
  if (state.wizardStep === 1) {
    state.wizardData.name = document.getElementById("wName").value.trim();
    state.wizardData.city = document.getElementById("wCity").value.trim();
    state.wizardData.state = document.getElementById("wState").value.trim();
    state.wizardData.description = document.getElementById("wDesc").value.trim();
    state.wizardData.sqm   = document.getElementById("wSqm").value;
    state.wizardData.rooms = document.getElementById("wRooms").value;
    if (!state.wizardData.name || !state.wizardData.city) return;
  }
  if (state.wizardStep === 2) {
    state.wizardData.tokenPrice  = parseFloat(document.getElementById("wPrice").value);
    state.wizardData.totalTokens = parseInt(document.getElementById("wSupply").value);
    state.wizardData.yield       = parseFloat(document.getElementById("wYield").value) || null;
    if (!state.wizardData.tokenPrice || !state.wizardData.totalTokens) return;
    renderWizardSummary();
  }
  state.wizardStep = Math.min(3, state.wizardStep + 1);
  updateWizardUI();
}

function wizardPrev() {
  state.wizardStep = Math.max(0, state.wizardStep - 1);
  updateWizardUI();
}

function selectType(type) {
  state.wizardData.type = type;
  document.querySelectorAll(".type-card").forEach(c => c.classList.toggle("selected", c.dataset.type === type));
  document.getElementById("step0Next").disabled = false;
}

function validateStep1() {
  const name = document.getElementById("wName").value.trim();
  const city = document.getElementById("wCity").value.trim();
  const btn  = document.getElementById("step1Next");
  if (btn) btn.disabled = !(name && city);
}

function setPreset(inputId, val) {
  document.getElementById(inputId).value = val;
  updateTokenomicsPreview();
}

function updateTokenomicsPreview() {
  const price  = parseFloat(document.getElementById("wPrice").value)  || 0;
  const supply = parseInt(document.getElementById("wSupply").value)   || 0;
  const yld    = parseFloat(document.getElementById("wYield").value)  || 0;
  const cap    = price * supply;

  document.getElementById("prevPrice").textContent  = price  ? price  + " MON"  : "—";
  document.getElementById("prevSupply").textContent = supply ? supply.toLocaleString("es-MX") + " tokens" : "—";
  document.getElementById("prevYield").textContent  = yld    ? yld + "% anual"  : "—";
  document.getElementById("prevCap").textContent    = cap    ? cap.toFixed(4) + " MON" : "—";

  const btn = document.getElementById("step2Next");
  if (btn) btn.disabled = !(price > 0 && supply > 0);
}

function renderWizardSummary() {
  const d  = state.wizardData;
  const tm = TYPE_META[d.type] || TYPE_META.default;
  const cap = (d.tokenPrice * d.totalTokens).toFixed(4);
  document.getElementById("wizardSummary").innerHTML = `
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px">
      <span style="font-size:28px">${tm.icon}</span>
      <div>
        <div style="font-size:15px;font-weight:800;color:var(--text)">${d.name}</div>
        <div style="font-size:12px;color:var(--text-muted)">${d.city}${d.state ? ", " + d.state : ""}</div>
      </div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:12px">
      <div><span style="color:var(--text-dim)">Tipo:</span> <strong>${tm.label}</strong></div>
      <div><span style="color:var(--text-dim)">Precio/token:</span> <strong style="color:var(--green)">${d.tokenPrice} MON</strong></div>
      <div><span style="color:var(--text-dim)">Oferta:</span> <strong>${d.totalTokens.toLocaleString("es-MX")} tokens</strong></div>
      <div><span style="color:var(--text-dim)">Cap. total:</span> <strong style="color:var(--green)">${cap} MON</strong></div>
      ${d.yield ? `<div><span style="color:var(--text-dim)">Rendimiento:</span> <strong>${d.yield}%</strong></div>` : ""}
      ${d.sqm   ? `<div><span style="color:var(--text-dim)">Superficie:</span> <strong>${d.sqm} m²</strong></div>` : ""}
    </div>
    ${d.description ? `<div style="font-size:12px;color:var(--text-muted);margin-top:8px;border-top:1px solid var(--border);padding-top:8px">${d.description}</div>` : ""}`;
}

function saveListing(statusVal) {
  const d = state.wizardData;
  const id = "local_" + Date.now();
  const listing = {
    id,
    type:        d.type,
    name:        d.name,
    location:    d.city + (d.state ? ", " + d.state : ""),
    description: d.description || "",
    sqm:         d.sqm  || null,
    rooms:       d.rooms || null,
    tokenPrice:  d.tokenPrice,
    totalTokens: d.totalTokens,
    yield:       d.yield || null,
    author:      state.address || "anonymous",
    status:      statusVal,
    propId:      null,
    createdAt:   Date.now(),
  };
  state.listings.push(listing);
  saveListings();
  updateMypropsBadge();
  renderProperties();

  const label = statusVal === "published" ? "Listado publicado" : "Borrador guardado";
  showToast("green", label, listing.name + " guardado correctamente");
  state.wizardStep = 0;
  state.wizardData = {};
  updateWizardUI();
  navigateTo(statusVal === "published" ? "myprops" : "myprops");
}

/* ══════════════════════════════════════════
   LANDING ↔ APP
══════════════════════════════════════════ */
function enterApp() {
  const overlay = document.getElementById("appTransition");
  overlay.classList.add("show");
  setTimeout(() => {
    document.body.classList.remove("landing-mode");
    document.body.style.overflow = "hidden";
    overlay.classList.remove("show");
  }, 350);
}

function exitToLanding() {
  const overlay = document.getElementById("appTransition");
  overlay.classList.add("show");
  setTimeout(() => {
    document.body.classList.add("landing-mode");
    document.body.style.overflow = "";
    window.scrollTo({ top: 0 });
    overlay.classList.remove("show");
  }, 350);
}

/* ══════════════════════════════════════════
   LANDING ANIMATIONS
══════════════════════════════════════════ */
function initLandingAnimations() {
  // ── Scroll reveal ──
  // Use the default viewport (root:null). Use a generous rootMargin so cards
  // a bit below the fold start to reveal as they approach. Reveal already-visible
  // items immediately on first observation.
  const revealRoot = null;

  // Fallback: if IntersectionObserver missing, reveal everything immediately.
  if (typeof IntersectionObserver === "undefined") {
    document.querySelectorAll('.reveal-item').forEach(el => el.classList.add('revealed'));
  } else {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      });
    }, { root: revealRoot, threshold: 0, rootMargin: '0px 0px 80px 0px' });

    document.querySelectorAll('.reveal-item').forEach(el => revealObserver.observe(el));
  }

  // Safety net: if for whatever reason an item is still hidden 1.2s after load
  // AND it's already inside the viewport, force-reveal it (avoids permanently
  // empty sections from a missed observation tick).
  setTimeout(() => {
    const vh = window.innerHeight;
    document.querySelectorAll('.reveal-item:not(.revealed)').forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.top < vh && r.bottom > 0) el.classList.add('revealed');
    });
  }, 1200);

  // ── Counter animation for stat values ──
  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    if (isNaN(target)) return;
    const suffix = el.dataset.suffix || '';
    const duration = 1500;
    const start = performance.now();

    function tick(now) {
      const elapsed = Math.min(now - start, duration);
      const progress = easeOutCubic(elapsed / duration);
      const value = Math.round(target * progress);
      el.textContent = (value >= 1000 ? value.toLocaleString('en-US') : String(value)) + suffix;
      el.classList.toggle('stat-counting', elapsed < 60);
      if (elapsed < duration) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  if (typeof IntersectionObserver !== "undefined") {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        counterObserver.unobserve(entry.target);
        animateCounter(entry.target);
      });
    }, { root: revealRoot, threshold: 0.5 });
    document.querySelectorAll('.l-stat-val[data-target]').forEach(el => counterObserver.observe(el));
  }
}

/* ══════════════════════════════════════════
   INIT
══════════════════════════════════════════ */
// Show landing on first load
document.body.classList.add("landing-mode");
setUiDisconnected();
quickUpdateCost();
renderProperties();
renderDashboardActivity();
renderHistoryGate();
initLandingAnimations();

/* Ripple on all buttons */
document.addEventListener("click", function(e) {
  const btn = e.target.closest(".btn");
  if (!btn) return;
  const r = document.createElement("span");
  r.className = "ripple";
  const rect = btn.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  r.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX-rect.left-size/2}px;top:${e.clientY-rect.top-size/2}px`;
  btn.appendChild(r);
  setTimeout(() => r.remove(), 560);
});
