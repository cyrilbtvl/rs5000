const voting = artifacts.require("Voting");

module.exports = (deployer) => {
    // Deployer le smart contract!
    deployer.deploy(voting);
}