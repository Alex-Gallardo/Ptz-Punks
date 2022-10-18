import { ethers } from "hardhat";

const deploy = async () => {
	// Informacion de la llave privada
	const [deployer] = await ethers.getSigners();

	console.log("Desplegando contrato...", deployer.address);

	// Crear una instancia de la aplicacion
	const PlatziPunks = await ethers.getContractFactory("PlatziPunks");
	const deployed = await PlatziPunks.deploy(1000);

	console.log("Contrato desplegado en:", deployed.address);
};

deploy()
	.then(() => process.exit())
	.catch((err) => {
		console.log(err);
		process.exit(1);
	});
