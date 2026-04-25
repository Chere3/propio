# Propio — De token a propietario

Plataforma de inversión fraccionada en bienes raíces sobre **Monad Testnet**.
Compra fracciones (tokens) de propiedades reales desde 0.001 MON, recibe
renta on-chain y reclámala con una sola transacción. Sin banco, sin notario,
sin cuenta de email — solo tu wallet.

**Live demo:** _(actualiza esta línea con tu URL de Vercel)_

---

## Stack

- Frontend: HTML + CSS + JS vanilla (single-page app, sin build step)
- Smart contract: Solidity 0.8.27 (Foundry)
- Red: Monad Testnet (Chain ID `10143`)
- Charts: Chart.js 4.4
- Wallet: ethers.js 5.7 + MetaMask / Rabby / Coinbase Wallet
- Tipografía: Inter (Google Fonts)

## Stack on-chain

- Contrato `SplitRent` (`src/SplitRent.sol`)
  - 14 propiedades pre-registradas en deploy
  - `buyTokens(propId, amount)` payable
  - `distributeRent(propId)` (solo owner) → reparte pro-rata
  - `claimRent(propId)` (cualquier holder)
  - Eventos completos: `TokensPurchased`, `RentDistributed`, `RentClaimed`
- Address desplegada: `0x4CeDfE9b6A7B288c9ec12b0331d2D96B38009294`
- Explorer: https://testnet.monadexplorer.com/address/0x4CeDfE9b6A7B288c9ec12b0331d2D96B38009294

---

## Correr local

```bash
# clona el repo
git clone https://github.com/<tu-usuario>/propio.git
cd propio

# levantá un servidor estático en :4321
python3 -m http.server 4321

# abre http://localhost:4321
```

## Re-deploy del contrato

```bash
# 1) instala foundry si no lo tienes
curl -L https://foundry.paradigm.xyz | bash && foundryup

# 2) instala libs
forge install foundry-rs/forge-std

# 3) crea .env desde el ejemplo y pon tu PRIVATE_KEY
cp .env.example .env
# edita .env con tu key

# 4) deploy
./deploy.sh

# 5) actualiza CONTRACT_ADDRESS en splitrent.js con la dirección impresa
```

> Tu private key NUNCA debe quedar versionada. `.env` está en `.gitignore`.

## Deploy a Vercel

Como es 100% estático, Vercel lo deploya sin configuración.

```bash
# Instala Vercel CLI
npm i -g vercel

# Desde la raíz del proyecto
vercel

# Para producción
vercel --prod
```

O conecta el repo de GitHub a Vercel y los pushes a `main` se publican automáticos.

---

## Estructura del proyecto

```
.
├── index.html              # SPA: landing + app shell
├── splitrent.css           # Sistema de diseño completo (sky theme, Coinbase blue)
├── splitrent.js            # Lógica frontend, charts, wallet, vistas
├── src/
│   └── SplitRent.sol       # Contrato principal
├── script/
│   └── Deploy.s.sol        # Script de deploy con las 14 propiedades
├── lib/forge-std/          # Dependencia (gitignored, regenerable)
├── foundry.toml            # Config Foundry
├── vercel.json             # Headers + cache policy
├── deploy.sh               # Wrapper del forge script
└── .env.example            # Template — copia a .env
```

## Vistas de la app

- `/#dashboard` — KPIs, charts (allocation donut, income trend, yield bars,
  velocity), holdings, actividad
- `/#properties` — Mercado: 14 propiedades con fotos, filtros, búsqueda
- `/#propDetail` — Detalle: gallery 5 fotos, stats strip, descripción,
  amenities, sales chart, buy panel sticky
- `/#portfolio` — Holdings detallados, claim rent
- `/#myprops` — Tus listados publicados, distribuir renta (si owner)
- `/#create` — Wizard 4 pasos para tokenizar tu propiedad
- `/#history` — Todas tus transacciones on-chain

Sin wallet conectada solo `/properties` está disponible. El resto pide
conectar la wallet primero (gate dialog).

---

## Por qué Monad

- Finalidad sub-segundo: una compra se confirma en `<1s`, ideal para UX retail
- 10K TPS: escala para mercado masivo de fracciones de propiedades
- 100% EVM-compatible: cualquier wallet/herramienta Ethereum funciona
- Faucet público: cualquiera puede probar sin costo en https://faucet.monad.xyz

---

## Disclaimer

Este es un proyecto de hackathon en **testnet**. No es un instrumento
financiero registrado, no constituye asesoría de inversión, y los tokens
no representan derechos legales sobre las propiedades. La información
y modelos de yield son ilustrativos.

## Licencia

MIT
