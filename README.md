<div align="center">

![Propio — De token a propietario](./assets/banner.png)

# Propio

**De token a propietario.** Inversión fraccionada en bienes raíces sobre Monad Testnet.
Compra fracciones de propiedades reales desde 0.001 MON, recibe renta on-chain y reclámala con una sola transacción. Sin banco, sin notario, sin cuenta de email — solo tu wallet.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![Monad Testnet](https://img.shields.io/badge/Network-Monad%20Testnet-6E55D6.svg)](https://testnet.monadexplorer.com)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.27-363636.svg)](./src/SplitRent.sol)
[![Foundry](https://img.shields.io/badge/Built%20with-Foundry-FFB454.svg)](https://book.getfoundry.sh)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000.svg)](https://vercel.com)

[**Live demo**](#) · [**Smart contract**](https://testnet.monadexplorer.com/address/0x4CeDfE9b6A7B288c9ec12b0331d2D96B38009294) · [**Pitch**](#por-qué)

</div>

---

## Por qué

El **72% de los jóvenes en México** no puede comprar casa.
La propiedad —el mejor instrumento histórico de generación de patrimonio— está bloqueada para quienes no tienen ahorros, historial crediticio o aval. Propio reduce el ticket mínimo a **0.001 MON** y elimina banco, notario y trámites.

Una persona joven puede empezar a construir patrimonio inmobiliario desde el primer día, con la wallet que ya tiene.

## Cómo

| | |
|---|---|
| **1.** Conecta tu wallet (MetaMask, Rabby, Coinbase) en Monad Testnet | **Sin email, sin registro.** Tu wallet es tu identidad. |
| **2.** Elige una propiedad del mercado | 14 propiedades reales: Condesa, Polanco, Tulum, Los Cabos, San Miguel… |
| **3.** Compra los tokens que quieras | Desde 1 token. Cada token es una fracción del inmueble. |
| **4.** Recibe renta on-chain | El owner distribuye renta pro-rata. Reclamas con una tx. |

Finalidad de transacción: **<1s** sobre Monad. Comprar bienes raíces se siente como Spotify, no como un trámite del SAT.

---

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | HTML/CSS/JS vanilla, single-page app, sin build step |
| Charts | [Chart.js 4.4](https://www.chartjs.org) |
| Wallet | [ethers.js 5.7](https://docs.ethers.org/v5/) + EIP-1193 |
| Smart contract | Solidity 0.8.27, [Foundry](https://book.getfoundry.sh) |
| Red | [Monad Testnet](https://docs.monad.xyz) (Chain ID `10143`) |
| Hosting | Vercel (estático) |
| Tipografía | Inter (Google Fonts) |

## Smart contract

`SplitRent.sol` ([source](./src/SplitRent.sol)) — implementa propiedad fraccionada con distribución de renta pro-rata usando el patrón `rewardPerToken` (gas-eficiente, sin loops).

```solidity
function buyTokens(uint256 propId, uint256 amount) external payable;
function distributeRent(uint256 propId) external payable; // owner-only
function claimRent(uint256 propId) external;
function earned(uint256 propId, address account) external view returns (uint256);
```

**Dirección desplegada:** [`0x4CeDfE9b6A7B288c9ec12b0331d2D96B38009294`](https://testnet.monadexplorer.com/address/0x4CeDfE9b6A7B288c9ec12b0331d2D96B38009294)

---

## Correr local

```bash
git clone https://github.com/<tu-usuario>/propio.git
cd propio
git submodule update --init --recursive   # trae forge-std

# servidor estático en :4321
python3 -m http.server 4321
# abre http://localhost:4321
```

## Re-deploy del contrato

```bash
# Foundry
curl -L https://foundry.paradigm.xyz | bash && foundryup

# .env desde el ejemplo
cp .env.example .env     # edita y pon tu PRIVATE_KEY
./deploy.sh

# Actualiza CONTRACT_ADDRESS en splitrent.js con la address impresa
```

> Tu private key NUNCA debe quedar versionada. `.env` ya está en `.gitignore`.

## Deploy a Vercel

```bash
npm i -g vercel
vercel --prod
```

O conecta el repo de GitHub a Vercel — los pushes a `main` publican automáticamente.

---

## Estructura

```
.
├── index.html              # SPA shell + landing
├── splitrent.css           # Sistema de diseño completo
├── splitrent.js            # Lógica frontend, charts, wallet, vistas
├── src/
│   └── SplitRent.sol       # Smart contract
├── script/
│   └── Deploy.s.sol        # Deploy script (registra 14 propiedades)
├── lib/forge-std/          # Submodule
├── assets/                 # Imágenes públicas (banner, etc.)
├── foundry.toml            # Config Foundry
├── vercel.json             # Headers + cache policy
├── deploy.sh               # Wrapper del forge script
└── .env.example            # Template
```

## Vistas

- **Mercado** — 14 propiedades con fotos, filtros por tipo, búsqueda, sort. Único view público sin wallet.
- **Detalle de propiedad** — gallery de 5 fotos, stats strip, descripción rica, amenities, gráfico de velocidad de venta, panel sticky de compra con cálculo en tiempo real.
- **Dashboard** — KPIs, 4 gráficos Chart.js (donut de allocation, área de renta acumulada, bars de yield, bars de velocidad), holdings y actividad. Requiere wallet.
- **Portafolio** — holdings detallados, claim rent.
- **Crear listado** — wizard de 4 pasos para tokenizar propiedad propia.
- **Historial** — txs on-chain con links al explorer.

---

## Por qué Monad

- **Finalidad sub-segundo** — UX retail real: la compra confirma antes de que sueltes el botón.
- **10K TPS** — escala para mercado masivo de fracciones.
- **EVM-compatible** — cualquier wallet/lib Ethereum funciona sin cambios.
- **Faucet público** — `faucet.monad.xyz` te da MON de testnet sin KYC.

## Roadmap (post-hackathon)

- [ ] Mainnet: deploy + auditoría
- [ ] KYC opcional para listadores con propiedades de mayor valor
- [ ] Marketplace secundario (P2P) para liquidez de tokens
- [ ] Multi-firma para owners institucionales
- [ ] Index de yield público + ranking histórico
- [ ] Mobile app nativa (React Native)

---

## Disclaimer

Proyecto de hackathon en **testnet**. No es un instrumento financiero registrado, no constituye asesoría de inversión, y los tokens no representan derechos legales sobre las propiedades reales. La información y modelos de yield son ilustrativos.

## Licencia

[MIT](./LICENSE)
