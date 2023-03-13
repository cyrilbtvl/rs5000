import { useState, useEffect } from "react";
import { Segment, Header } from "semantic-ui-react";
import { useEth } from "../../contexts/EthContext";

function VoterPanel() {
  const {
    state: { accounts, contract, artifact },
  } = useEth();
  const [isVoter, setIsVoter] = useState(false);

  useEffect(() => {
    async function getVoterData() {
      if (artifact) {
        console.log("VoterPanel : Smartcontract trouvé");

        try {
          let allVoterRegistered = await contract.getPastEvents('VoterRegistered', { fromBlock: 0, toBlock: "latest" });
          let allVoterAddress = allVoterRegistered.map(_ev => _ev.returnValues.voterAddress);
          let isVoter = allVoterAddress.includes(accounts[0]);
          console.log("isVoter ? " + isVoter);
          if (isVoter) {
            setIsVoter(true);
            const voterData = await contract.methods.getVoter(accounts[0]).call({ from: accounts[0] });
            console.log("HasVoter ? " + voterData.hasVoted);
          } else {
            setIsVoter(false);
          }

        } catch (e) {
          console.log(e)
        }
      } else {
        console.log("VoterPanel : Smartcontract non détecté");
      }
    }


    getVoterData();
  }, [accounts, contract, artifact]);

  return (
    isVoter && (
      <Segment raised size="huge" color="green">
        <Header as="h2">Voter's panel</Header>

      </Segment>
    )
  );
}

export default VoterPanel;
