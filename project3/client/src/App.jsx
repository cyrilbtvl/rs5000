import { EthProvider } from "./contexts/EthContext";
import { useState } from "react";
//import { Message } from 'semantic-ui-react';

import Account from "./components/Account";
import OwnerPanel from "./components/OwnerPanel";
import VoterPanel from "./components/VoterPanel";
import Winner from "./components/Winner";
import VotersList from "./components/VotersList";
import ProposalsList from "./components/ProposalsList";

import "./App.css";

function App() {
  const [currentPhase, setCurrentPhase] = useState(0);
  /*const phases = [
    "RegisteringVoters",
    "ProposalsRegistrationStarted",
    "ProposalsRegistrationEnded",
    "VotingSessionStarted",
    "VotingSessionEnded",
    "VotesTallied"
  ];*/
  const [voters, setVoters] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [winner, setWinner] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [isVoter, setIsVoter] = useState(false);

  return (
    <EthProvider>
      <div id="App">
        <div className="container">
          <Account isOwner={isOwner} setIsOwner={setIsOwner} isVoter={isVoter} setIsVoter={setIsVoter} />
          <OwnerPanel isOwner={isOwner} currentPhase={currentPhase} setCurrentPhase={setCurrentPhase} setVoters={setVoters} />
          <VoterPanel isVoter={isVoter} isOwner={isOwner} proposals={proposals} setProposals={setProposals} currentPhase={currentPhase} setWinner={setWinner} />
          <VotersList isOwner={isOwner} isVoter={isVoter} voters={voters} />
          <ProposalsList isVoter={isVoter} proposals={proposals} currentPhase={currentPhase} />
          <Winner isOwner={isOwner} isVoter={isVoter} winner={winner} currentPhase={currentPhase} />
        </div>
      </div>
    </EthProvider>
  );
}

export default App;
