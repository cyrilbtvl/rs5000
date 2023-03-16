import { useState, useEffect } from "react";
import { Segment, Header, Form, Input, Button, Modal } from "semantic-ui-react";
import { useEth } from "../../contexts/EthContext";

function VoterPanel({ proposals, setProposals, currentPhase, setWinner }) {
  const { state: { accounts, contract, artifact }, } = useEth();
  const [isVoter, setIsVoter] = useState(false);
  const [inputProposalValue, setInputProposalValue] = useState("");
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorCode, setErrorCode] = useState("");

  useEffect(() => {
    async function getVoterData() {
      if (artifact) {
        console.log("VoterPanel : User trouvé");

        try {
          let allVoterRegistered = await contract.getPastEvents('VoterRegistered', { fromBlock: 0, toBlock: "latest" });
          let allVoterAddress = allVoterRegistered.map(_ev => _ev.returnValues.voterAddress);
          let isAVoter = allVoterAddress.includes(accounts[0]);
          console.log("VoterPanel :isVoter ? " + isAVoter);
          if (isAVoter) {
            setIsVoter(true);
            const voterData = await contract.methods.getVoter(accounts[0]).call({ from: accounts[0] });
            console.log("VoterPanel :HasVoter ? " + voterData.hasVoted);
          } else {
            console.log("VoterPanel :it is not a Voter");
            setIsVoter(false);
          }

        } catch (e) {
          console.log("VoterPanel : " + e)
        }
      } else {
        console.log("VoterPanel : Smartcontract non détecté");
      }
    }

    getVoterData();
  }, [accounts, contract, artifact]);

  // champs pour saisir proposal
  // champs pour voter
  const inputProposalChange = (proposal) => {
    setInputProposalValue(proposal.currentTarget.value);
  };

  const submitAddProposal = async () => {
    if (inputProposalValue === "") {
      setErrorCode("Proposal format is not correct !");
      setErrorMessage("Please add a correct proposal.");
      //alert("Please enter a voter address");
      setOpen(true);
    } else {
      try {
        const newProposal = await contract.methods.addProposal(inputProposalValue).send({ from: accounts[0] });
        //Error: invalid address
        //Catcher les erreurs avec des popup

        console.log("VoterPanel : newProposal : " + newProposal);
        window.location.reload();
      } catch (e) {
        setOpen(true);
        setErrorCode(e.code);
        console.error("VoterPanel : mon erreur : " + errorCode);
        setErrorMessage(e.message);
        console.error("VoterPanel : mon erreur message : " + errorMessage);
      }
    }
  };
  /*
    const handleChangeProposal = (e, data) => {
      setSelectedProposal(data.value);
    };
  
    const handleVote = async () => {
      await contract.methods.setVote(parseInt(selectedProposal)).send({ from: accounts[0] });
 
  // const winnerId = await contract.methods.winningProposalID().call({ from: accounts[0] });
  // const winnerProposal = await contract.methods.getOneProposal(parseInt(winnerId)).call({ from: accounts[0] });
  // console.log(winnerProposal);
  // setWinner(winnerProposal);

  window.location.reload();
};
 */
  // ne peux pas voter 2x  


  return (
    isVoter && (

      <Segment raised size="huge" color="green">

        <Modal
          centered={false}
          open={open}
          onClose={() => setOpen(false)}
          onOpen={() => setOpen(true)}
        >
          <Header className="ui red header" icon='warning sign' content={errorCode} />
          <Modal.Content>
            <Modal.Description>
              {errorMessage}
            </Modal.Description>
          </Modal.Content>
          <Modal.Actions>
            <Button positive onClick={() => setOpen(false)}>OK</Button>
          </Modal.Actions>
        </Modal>

        <Header as="h2">Voter's panel</Header>


        {currentPhase === 1 && (
          <Segment size="huge">
            <Form onSubmit={submitAddProposal}>
              <Form.Field>
                <Input value={inputProposalValue} onChange={inputProposalChange}
                  icon="file alternate outline" iconPosition="left" placeholder="Add a Proposal" size="huge" fluid />
              </Form.Field>
              <Button icon='add' content='Add a proposal' color="rgeen" type="submit" size="huge" fluid />
            </Form>
          </Segment>
        )}



      </Segment>
    )
  );
}

export default VoterPanel;
