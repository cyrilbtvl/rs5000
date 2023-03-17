import { useEffect } from "react";
import { Message } from "semantic-ui-react";

function Winner({ isOwner, isVoter, winner, currentPhase }) {

  useEffect(() => {
    //async function getLog() {
    console.log("WinnerPanel : proposalWinner " + winner);
    // }

    //getLog();
  }, [winner]);


  return (winner !== null && currentPhase === 5 && (isVoter || isOwner)) && (
    <Message color='green' size='massive'>
      The winner is : {winner.description} with {winner.voteCount} votes !
    </Message>
  )
}
export default Winner;