import type { HardhatRuntimeEnvironment } from "hardhat/types";

const deployFirstName = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;

  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const deployResult = await deploy("FirstName", {
    from: deployer,
    args: [],
    log: true
  });

  if (deployResult.newlyDeployed) {
    console.log("FirstName newly deployed");
  }
};
deployFirstName.tags = ["FirstName"];

export default deployFirstName;
