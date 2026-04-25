// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import {Script, console} from "forge-std/Script.sol";
import {SplitRent} from "../src/SplitRent.sol";

/// @notice Despliega SplitRent en Monad Testnet y registra las 14 propiedades
///         que aparecen en la UI (las 3 primeras vienen del constructor; las
///         11 restantes se añaden vía addProperty en el mismo broadcast).
///
/// Ejecución:
///   source .env && \
///   forge script script/Deploy.s.sol:DeployScript \
///     --rpc-url https://testnet-rpc.monad.xyz \
///     --private-key $PRIVATE_KEY \
///     --broadcast \
///     -vvv
contract DeployScript is Script {
    function run() external returns (SplitRent splitRent) {
        uint256 deployerKey = vm.envUint("PRIVATE_KEY");
        address deployer    = vm.addr(deployerKey);

        console.log("Deployer:", deployer);
        console.log("Balance (mMON):", deployer.balance / 1e15);

        vm.startBroadcast(deployerKey);

        // Constructor pre-registra: Condesa (0), San Pedro (1), Providencia (2)
        splitRent = new SplitRent();

        // Las 11 restantes — IDs 3..13 — coinciden con PROP_META en splitrent.js
        splitRent.addProperty("Penthouse Polanco",          "CDMX",                   0.0015 ether,  800);
        splitRent.addProperty("Casa Tulum Beach",           "Quintana Roo",           0.0032 ether,  600);
        splitRent.addProperty("Estudio Roma Norte",         "CDMX",                   0.0009 ether,  400);
        splitRent.addProperty("Villa Los Cabos",            "Baja California Sur",    0.0048 ether, 1500);
        splitRent.addProperty("Loft Centro Historico",      "Queretaro",              0.0012 ether,  350);
        splitRent.addProperty("Casa San Miguel",            "Guanajuato",             0.0021 ether,  800);
        splitRent.addProperty("Local Av. Reforma",          "CDMX",                   0.0006 ether, 1200);
        splitRent.addProperty("Departamento Marina",        "Mazatlan",               0.0028 ether,  700);
        splitRent.addProperty("Casa Coyoacan",              "CDMX",                   0.0017 ether,  900);
        splitRent.addProperty("Penthouse Puerto Vallarta",  "Jalisco",                0.0040 ether, 1000);
        splitRent.addProperty("Terreno Valle de Bravo",     "Estado de Mexico",       0.0011 ether,  500);

        vm.stopBroadcast();

        console.log("==============================================");
        console.log("SplitRent desplegado en:", address(splitRent));
        console.log("Total propiedades on-chain:", splitRent.propertiesCount());
        console.log("==============================================");
        console.log("");
        console.log("Siguiente paso: actualiza CONTRACT_ADDRESS en splitrent.js con:");
        console.log(vm.toString(address(splitRent)));
    }
}
