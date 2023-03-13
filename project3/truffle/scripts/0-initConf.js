/*
  Try `truffle exec scripts/increment.js`, you should `truffle migrate` first.

  Learn more about Truffle external scripts: 
  https://trufflesuite.com/docs/truffle/getting-started/writing-external-scripts
*/
const AVoting = artifacts.require("Voting");

module.exports = async function (callback) {
  const instanceVoting = await AVoting.deployed();

  const winningProposalID = (await instanceVoting.winningProposalID()).toNumber();
  console.log(`Current winningProposalID value: ${winningProposalID}`);

  const currentWorkflowStatus = (await instanceVoting.workflowStatus());
  console.log(`Current workflowStatus : ${currentWorkflowStatus}`);
  callback();
};
