import "@nomicfoundation/hardhat-toolbox";

import { HardhatUserConfig } from "hardhat/config";
// Almacenar de manera global los datos de la aplicación
require("dotenv").config();

const { DEPLOYER_SIGNER_PRIVATE_KEY, INFURA_PROJECT_ID } = process.env;

const config: HardhatUserConfig = {
	solidity: "0.8.9",
	networks: {
		rinkeby: {
			// Link de la red
			url: `https://rinkeby.infura.io/v3/${INFURA_PROJECT_ID}`,
			// Cuenta que va a firmar el despliege
			accounts: [DEPLOYER_SIGNER_PRIVATE_KEY + ""]
		},
		goerli: {
			url: "https://eth-goerli.g.alchemy.com/v2/9mYf2dtlfUcmZwMbv9KeRyvl7CRfYupy",
			accounts: [DEPLOYER_SIGNER_PRIVATE_KEY + ""]
		}
	}
};

export default config;
