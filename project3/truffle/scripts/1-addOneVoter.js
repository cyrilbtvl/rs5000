/*
  Try `truffle exec scripts/increment.js`, you should `truffle migrate` first.

  Learn more about Truffle external scripts: 
  https://trufflesuite.com/docs/truffle/getting-started/writing-external-scripts
*/
const AVoting = artifacts.require("Voting");

module.exports = async function (callback) {
  const instanceVoting = await AVoting.deployed();

  await instanceVoting.addVoter("0x47eE64dcf5d613af30f4bDD1B7021aCD03d87576", { from: "0x784A782d0E09fb2CcB446222F7CD04567E7Db1cE" });
  console.log(`New voter : 0x47eE64dcf5d613af30f4bDD1B7021aCD03d87576`);
  // console.log(owner);

  // const voter1 = await instanceVoting.getVoter("0x784A782d0E09fb2CcB446222F7CD04567E7Db1cE");
  // const voter2 = await instanceVoting.getVoter("0x47eE64dcf5d613af30f4bDD1B7021aCD03d87576");
  // const voter3 = await instanceVoting.getVoter("0x12b5321Dd5C84Dc5C185cFa6D59E97f441000dE2");

  // console.log(voter1);
  // console.log(voter2);
  // console.log(voter3);

  // let voters = await instanceVoting.getPastEvents("VoterRegistered", { fromBlock: 0, toBlock: "latest" });

  // console.log(voters);
  callback();
};
