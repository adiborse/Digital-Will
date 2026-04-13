const hre = require("hardhat");

async function main() {
  // Get test accounts from the local Hardhat network.
  const [deployer, nomineeSigner] = await hre.ethers.getSigners();

  // Set release time to the current block timestamp so the nominee can access it immediately.
  const currentBlock = await hre.ethers.provider.getBlock("latest");
  const releaseTime = currentBlock.timestamp;

  console.log("Deploying contract with account:", deployer.address);
  console.log("Nominee address:", nomineeSigner.address);
  console.log("Release time (unix):", releaseTime);

  // Create a contract factory for the DigitalWill contract.
  const DigitalWill = await hre.ethers.getContractFactory("DigitalWill");

  // Deploy the contract by passing nominee and release time to the constructor.
  const digitalWill = await DigitalWill.deploy(nomineeSigner.address, releaseTime);
  await digitalWill.waitForDeployment();

  const contractAddress = await digitalWill.getAddress();

  console.log("DigitalWill deployed successfully.");
  console.log("Contract address:", contractAddress);
  console.log("");
  console.log("Next step:");
  console.log("1. Copy the contract address.");
  console.log("2. Open frontend/index.html in a browser.");
  console.log("3. Paste the address into the Contract Address field.");
}

main().catch((error) => {
  console.error("Deployment failed:", error);
  process.exitCode = 1;
});
