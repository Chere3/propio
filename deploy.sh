#!/usr/bin/env bash
# Deploy SplitRent a Monad Testnet.
#
# Uso:
#   1) Copia .env.example a .env y pon tu PRIVATE_KEY
#   2) ./deploy.sh
#
# Requiere: foundry instalado (forge en PATH) y MON en Monad Testnet.

set -euo pipefail

# Asegura que forge está en PATH
export PATH="$HOME/.foundry/bin:$PATH"

# Carga .env automáticamente y exporta cada variable
if [[ -f .env ]]; then
  set -a
  # shellcheck disable=SC1091
  source .env
  set +a
fi

if [[ -z "${PRIVATE_KEY:-}" ]]; then
  echo "❌ PRIVATE_KEY no encontrada."
  echo "   Crea un archivo .env con:  PRIVATE_KEY=0xtu_key"
  echo "   (cp .env.example .env  y edita el valor)"
  exit 1
fi

if ! command -v forge >/dev/null 2>&1; then
  echo "❌ forge no encontrado. Instala foundry primero:"
  echo "   curl -L https://foundry.paradigm.xyz | bash && foundryup"
  exit 1
fi

echo "▶ Compilando contrato…"
forge build --silent

echo "▶ Desplegando a Monad Testnet…"
forge script script/Deploy.s.sol:DeployScript \
  --rpc-url https://testnet-rpc.monad.xyz \
  --private-key "$PRIVATE_KEY" \
  --broadcast \
  -vvv

echo ""
echo "✅ Deploy completado. Copia la dirección impresa arriba y pásamela"
echo "   para actualizar CONTRACT_ADDRESS en splitrent.js."
