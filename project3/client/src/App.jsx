import { EthProvider } from "./contexts/EthContext";
import { useState } from "react";
//import { Message } from 'semantic-ui-react';

import Account from "./components/Account";
import OwnerPanel from "./components/OwnerPanel";
import VoterPanel from "./components/VoterPanel";
import Winner from "./components/Winner";
//import VotersList from "./components/VotersList";
//import ProposalsList from "./components/ProposalsList";

import "./App.css";

function App() {
  const [currentPhase, setCurrentPhase] = useState(0);
  const phases = [
    "RegisteringVoters",
    "ProposalsRegistrationStarted",
    "ProposalsRegistrationEnded",
    "VotingSessionStarted",
    "VotingSessionEnded",
    "VotesTallied"
  ];
  const [proposals, setProposals] = useState([]);
  const [winner, setWinner] = useState(null);

  return (
    <EthProvider>
      <div id="App">
        <div className="container">
          <Account />
          <OwnerPanel currentPhase={currentPhase} setCurrentPhase={setCurrentPhase} phases={phases} />
          <VoterPanel proposals={proposals} setProposals={setProposals} currentPhase={currentPhase} setWinner={setWinner} />
          <Winner winner={winner} currentPhase={currentPhase} />
        </div>
      </div>
    </EthProvider>
  );
}

export default App;
