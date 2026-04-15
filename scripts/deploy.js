const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contract with account:", deployer.address);

  const DigitalWill = await hre.ethers.getContractFactory("DigitalWill");
  const digitalWill = await DigitalWill.deploy();
  await digitalWill.waitForDeployment();

  const contractAddress = await digitalWill.getAddress();

  console.log("DigitalWill deployed successfully.");
  console.log("Contract address:", contractAddress);
  console.log("");
  console.log("Next step:");
  console.log("1. Copy the contract address.");
  console.log("2. Open the frontend in your browser.");
  console.log("3. Paste the address into the Contract Address field.");
  console.log("4. Enter nominee address, release time, and will data in the form.");
}

main().catch((error) => {
  console.error("Deployment failed:", error);
  process.exitCode = 1;
});
