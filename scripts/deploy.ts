const color = require("cli-color")
var msg = color.xterm(39).bgXterm(128);
import hre, { ethers, network } from 'hardhat'

async function main() {

  const daoAddress = "0xbFBaa5a59e3b6c06afF9c975092B8705f804Fa1c"
  const sponsorshipAmount = ethers.parseEther("0.1")
  const ExponentialLove = await ethers.getContractFactory("ExponentialLove");
  const exponentialLove = await ExponentialLove.deploy(daoAddress, sponsorshipAmount);

  console.log('\nExponentialLove deployed at', msg(await exponentialLove.getAddress()));

  try {
    console.log("\nEtherscan verification in progress...")
    await exponentialLove.deploymentTransaction()?.wait(6);
    await hre.run("verify:verify", { network: network.name, address: await exponentialLove.getAddress(), constructorArguments: [daoAddress, sponsorshipAmount], })
    console.log("Etherscan verification done. ✅")
  } catch (error) {
    console.error(error)
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});