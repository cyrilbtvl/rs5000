/* eslint-disable no-restricted-globals */
import { useState, useEffect } from "react";
import { Message } from "semantic-ui-react";
import { useEth } from "../../contexts/EthContext";

function Winner({ winner, currentPhase }) {
  const { state: { accounts, contract, artifact }, } = useEth();
  const [proposalWinner, setProposalWinner] = useState([]);
  const [proposalWinnerId, setProposalWinnerId] = useState(0);
  const [isVoter, setIsVoter] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

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
            getOwner();
          }

        } catch (e) {
          console.log(e)
        }
      } else {
        console.log("WinnerrPanel : user not connected");
      }
    };

    async function getOwner() {
      if (artifact) {
        const owner = await contract.methods.owner().call({ from: accounts[0] });
        accounts[0] === owner ? setIsOwner(true) : setIsOwner(false);
      } else {
        console.log("WinnerrPanel : user not connected");
      }
    }

    async function getWinner() {

      if (contract) {
        console.log('Winner : contrat exist');
        const winnerId = await contract.methods.winningProposalID().call({ from: accounts[0] });
        setProposalWinnerId(winnerId);
        if (isVoter) {
          const winnerProposal = await contract.methods.getOneProposal(parseInt(winnerId)).call({ from: accounts[0] });
          console.log(winnerProposal);
          setProposalWinner(winnerProposal);

        } else {
          console.log('Winner : You are not a voter');
        }
      } else {
        console.log("WinnerrPanel : user not connected");
      }
    };
    /*
    async function getPhase() {
      if (artifact) {
        const phase = await contract.methods.workflowStatus().call({ from: accounts[0] });
      }
    }*/

    getVoterData();
    getWinner();
    //getPhase();
  }, [accounts, contract, artifact, isVoter]);

  return (proposalWinner !== null && currentPhase === 5) && (
    //return (proposalWinner !== null && isVoter) && (
    isVoter ? (
      <Message color='green' size='massive'>
        The winner is : {proposalWinner.description} with {proposalWinner.voteCount} votes !
      </Message>
    ) :
      isOwner ? (
        <Message color='blue' size='massive'>
          The winner has the Id : {proposalWinnerId} !
        </Message>
      ) : (
        <Message color='orange' size='massive' />
      )
  );
}

export default Winner;
