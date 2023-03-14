/*
  Try `truffle exec scripts/increment.js`, you should `truffle migrate` first.

  Learn more about Truffle external scripts: 
  https://trufflesuite.com/docs/truffle/getting-started/writing-external-scripts
*/
const AVoting = artifacts.require("Voting");

module.exports = async function (callback) {
    const instanceVoting = await AVoting.deployed();

    await instanceVoting.startVotingSession({ from: "0x784A782d0E09fb2CcB446222F7CD04567E7Db1cE" })
    console.log(`startVotingSession`);

    const currentWorkflowStatus = (await instanceVoting.workflowStatus());
    console.log(`Current workflowStatus : ${currentWorkflowStatus}`);

    callback();
};
