import { ethers } from 'hardhat';

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(`deployer: ${deployer.address}`);

  const contract = await ethers.getContractFactory('Rogue', deployer);
  const rogue = await contract.deploy();
  await rogue.deployed();

  console.log('deployed to:', rogue.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
