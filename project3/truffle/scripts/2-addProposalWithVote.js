/*
  Try `truffle exec scripts/increment.js`, you should `truffle migrate` first.

  Learn more about Truffle external scripts: 
  https://trufflesuite.com/docs/truffle/getting-started/writing-external-scripts
*/
const AVoting = artifacts.require("Voting");

module.exports = async function (callback) {
  const instanceVoting = await AVoting.deployed();

  await instanceVoting.startProposalsRegistering({ from: "0x784A782d0E09fb2CcB446222F7CD04567E7Db1cE" })
  console.log(`startProposalsRegistering`);
  await instanceVoting.addProposal("proposalTest1", { from: "0x47eE64dcf5d613af30f4bDD1B7021aCD03d87576" });
  console.log(`new proposal : proposalTest1`);

  await instanceVoting.endProposalsRegistering({ from: "0x784A782d0E09fb2CcB446222F7CD04567E7Db1cE" })
  console.log(`endProposalsRegistering`);
  await instanceVoting.startVotingSession({ from: "0x784A782d0E09fb2CcB446222F7CD04567E7Db1cE" })
  console.log(`startVotingSession`);
  await instanceVoting.setVote(1, { from: "0x47eE64dcf5d613af30f4bDD1B7021aCD03d87576" });
  console.log(`add a vote to essai proposal 1`);
  await instanceVoting.endVotingSession({ from: "0x784A782d0E09fb2CcB446222F7CD04567E7Db1cE" })
  console.log(`startProposalsRegistering`);

  await instanceVoting.tallyVotes({ from: "0x784A782d0E09fb2CcB446222F7CD04567E7Db1cE" })
  console.log(`VotesTallied`);

  const currentWorkflowStatus = (await instanceVoting.workflowStatus());
  console.log(`Current workflowStatus : ${currentWorkflowStatus}`);
  callback();
};
