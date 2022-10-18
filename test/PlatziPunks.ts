import { expect } from "chai";
import { ethers } from "hardhat";

describe("PlatziPunks Contract", () => {
	const setup = async ({ maxSupply = 1000 }) => {
		const [owner] = await ethers.getSigners();
		// Crear una instancia de la aplicacion
		const PlatziPunks = await ethers.getContractFactory("PlatziPunks");
		const deployed = await PlatziPunks.deploy(maxSupply);

		return {
			deployed,
			owner
		};
	};

	// Despliege
	describe("Deployment", () => {
		it("Set max supply", async () => {
			const maxSupply = 4000;

			const { deployed } = await setup({ maxSupply });

			const returnMaxSupply = await deployed.maxSupply();
			expect(maxSupply).to.equal(returnMaxSupply);
		});
	});

	// Minteo
	describe("Minting", () => {
		it("Mint new tokens", async () => {
			const { deployed, owner } = await setup({});

			// const minted = await deployed.mint(owner.address, 100);
			await deployed.mint();
			const ownerOfMinter = await deployed.ownerOf(0);

			expect(ownerOfMinter).to.equal(owner.address);
			// expect(minted.logs[0].args.amount).to.equal(100);
		});

		it("Tienen un limite de minteo", async () => {
			const maxSupply = 2;

			const { deployed } = await setup({ maxSupply });

			// Mint all
			await Promise.all([deployed.mint(), deployed.mint()]);

			// Assert the last minting
			await expect(deployed.mint()).to.be.revertedWith("No se puede crear mas platzi punks");
		});
	});

	// Prueba para el tokenURI
	describe("Token URI", () => {
		it("Retorna una metadata valida", async () => {
			const { deployed } = await setup({});

			await deployed.mint();

			const tokenURI = await deployed.tokenURI(0);
			const stringifiedTokenURI = await tokenURI.toString();
			const [, base64JSON] = stringifiedTokenURI.split("data:application/json;base64,");

			// console.log(pefix, base64JSON);
			// const stringifiedMetadata = Buffer.from(base64JSON, "base64").toString("utf8");
			const stringifiedMetadata = await Buffer.from(base64JSON, "base64").toString("ascii");

			const metadata = JSON.parse(stringifiedMetadata);

			expect(metadata).to.have.all.keys("name", "description", "image");
		});
	});
});
