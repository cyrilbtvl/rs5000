/*
  Try `truffle exec scripts/increment.js`, you should `truffle migrate` first.

  Learn more about Truffle external scripts: 
  https://trufflesuite.com/docs/truffle/getting-started/writing-external-scripts
*/
const AVoting = artifacts.require("Voting");

module.exports = async function (callback) {
    const instanceVoting = await AVoting.deployed();

    await instanceVoting.setVote(1, { from: "0x47eE64dcf5d613af30f4bDD1B7021aCD03d87576" });
    console.log(`add a vote to essai proposal 1`);

    const currentWorkflowStatus = (await instanceVoting.workflowStatus());
    console.log(`Current workflowStatus : ${currentWorkflowStatus}`);

    callback();
};
