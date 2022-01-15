import { ethers } from "hardhat";
const { provider } = ethers;

const main = async () => {
  let address = await provider.resolveName("zapaz.eth");
  console.log("address zapaz.eth", address);

  address = await provider.resolveName("tennis3.eth");
  console.log("address tennis3.eth", address);

  address = await provider.resolveName("roger.tennis3.eth");
  console.log("roger.tennis3.eth", address);
};

main().then(console.log).catch(console.error);
