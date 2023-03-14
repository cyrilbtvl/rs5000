/* eslint-disable no-restricted-globals */
import { useState, useEffect } from "react";
import { Message } from "semantic-ui-react";
import { useEth } from "../../contexts/EthContext";

function Winner() {
  const { state: { accounts, contract, artifact }, } = useEth();
  const [proposalWinner, setProposalWinner] = useState([]);
  const [isVoter, setIsVoter] = useState(false);

  useEffect(() => {
    async function getVoterData() {
      if (artifact) {
        console.log("VoterPanel : User trouvé");

        try {
          let allVoterRegistered = await contract.getPastEvents('VoterRegistered', { fromBlock: 0, toBlock: "latest" });
          let allVoterAddress = allVoterRegistered.map(_ev => _ev.returnValues.voterAddress);
          let isAVoter = allVoterAddress.includes(accounts[0]);
          console.log("isVoter ? " + isAVoter);
          if (isAVoter) {
            setIsVoter(true);
            const voterData = await contract.methods.getVoter(accounts[0]).call({ from: accounts[0] });
            console.log("HasVoter ? " + voterData.hasVoted);
          } else {
            console.log("it is not a Voter");
            setIsVoter(false);
          }

        } catch (e) {
          console.log(e)
        }
      } else {
        console.log("VoterPanel : Smartcontract non détecté");
      }
    };

    async function getWinner() {
      if (isVoter) {
        if (contract) {
          console.log('Winner : contrat exist');
          const winnerId = await contract.methods.winningProposalID().call({ from: accounts[0] });
          const winnerProposal = await contract.methods.getOneProposal(parseInt(winnerId)).call({ from: accounts[0] });
          console.log(winnerProposal);
          setProposalWinner(winnerProposal);
        } else {
          console.log('Winner : contrat does not exist');
        }
      } else {
        console.log('Winner : You are not a voter');
      }
    };

    getVoterData();
    getWinner();
  }, [accounts, contract, artifact, isVoter]);

  return (proposalWinner !== null && isVoter) && (
    <Message color='green' size='massive'>
      The winner is : {proposalWinner.description} with {proposalWinner.voteCount} votes !
    </Message>
  );
}

export default Winner;
