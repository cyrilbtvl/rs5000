/* eslint-disable no-restricted-globals */
import { useState, useEffect } from "react";
import { Message } from "semantic-ui-react";
import { useEth } from "../../contexts/EthContext";

function Winner() {
  const { state: { accounts, contract, artifact }, } = useEth();
  const [proposalWinner, setProposalWinner] = useState([]);

  useEffect(() => {
    async function getWinner() {
      if (contract) {
        console.log('Winner : contrat exist');
        const winnerId = await contract.methods.winningProposalID().call({ from: accounts[0] });
        const winnerProposal = await contract.methods.getOneProposal(parseInt(winnerId)).call({ from: accounts[0] });
        console.log(winnerProposal);
        setProposalWinner(winnerProposal);
      } else {
        console.log('Winner : contrat does not exist');
      }
    };

    getWinner();
  }, [accounts, contract, artifact]);

  return (proposalWinner !== null) && (
    <Message color='green' size='massive'>
      The winner is : {proposalWinner.description} with {proposalWinner.voteCount} votes !
    </Message>
  );
}

export default Winner;
