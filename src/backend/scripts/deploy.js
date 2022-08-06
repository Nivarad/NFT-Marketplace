const { ethers } = require("hardhat");
async function main() {
  // const addresses = [
  //   "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
  //   "0x70997970c51812dc3a010c7d01b50e0d17dc79c8",
  //   "0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc",
  //   "0x90f79bf6eb2c4f870365e785982e1f101e93b906",
  //   "0x15d34aaf54267db7d7c367839aaf71a00a2c6a65",
  //   "0x9965507d1a55bcc2695c58ba16fb37d819b0a4dc",
  //   "0x976ea74026e726554db657fa54763abd0c3a0aa9",
  // ];

  console.log(await ethers.getSigners());
  const [owner, address1, addr2, addr3] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", owner);
  console.log("Account balance:", (await owner.getBalance()).toString());

  const PIRATE = await ethers.getContractFactory("PIRATE");
  const pirate = await PIRATE.deploy();

  await pirate.connect(address1).mint();
  await pirate.connect(addr2).mint();
  await pirate.connect(addr3).mint();
  // await pirate.connect(address2).mint();
  // await pirate.connect(address3).mint();
  // await pirate.connect(address4).mint();

  // Get the ContractFactories and Signers here.
  const NFT = await ethers.getContractFactory("NFT");
  const Marketplace = await ethers.getContractFactory("Marketplace");
  // deploy contracts
  const marketplace = await Marketplace.deploy(1);
  const nft = await NFT.deploy();
  // Save copies of each contracts abi and address to the frontend.
  saveFrontendFiles(pirate, "PIRATE");
  saveFrontendFiles(marketplace, "Marketplace");
  saveFrontendFiles(nft, "NFT");
}

function saveFrontendFiles(contract, name) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../../frontend/contractsData";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + `/${name}-address.json`,
    JSON.stringify({ address: contract.address }, undefined, 2)
  );

  const contractArtifact = artifacts.readArtifactSync(name);

  fs.writeFileSync(
    contractsDir + `/${name}.json`,
    JSON.stringify(contractArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
