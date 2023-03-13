const AVoting = artifacts.require("Voting");

module.exports = (deployer) => {
  // Deployer le smart contract!
  deployer.deploy(AVoting);
}