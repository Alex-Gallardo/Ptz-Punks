import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
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
		}
	}
};

export default config;
