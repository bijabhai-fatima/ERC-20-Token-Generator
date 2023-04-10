// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat"); 
const {run, network} = require("hardhat");
require("dotenv").config();

async function main() { // We get the contract to deploy
  const MyToken = await hre.ethers.getContractFactory("MyToken");
  const myToken = await MyToken.deploy();
  console.log("Deploying MyToken contract.....");

  await myToken.deployed(); 

  console.log("MyToken deployed to:", myToken.address);

  if(network.config.chainId === 11155111 && process.env.ETHERSCAN_API_KEY){
    await myToken.deployTransaction.wait(6);
    await verify(myToken.address, []);
  }

}

async function verify(contractAddress, args){
  console.log("Verifying MyToken contract.....");
  try{
    await run("verify:verify", {
      address: contractAddress,
      constructorArgument: args,
    })
  } catch(e){
    if(e.message.toLowerCase().includes("already verified")){
      console.log("Already verified");
    } else {
      console.log(e);  
    }
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
