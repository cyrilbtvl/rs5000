import { useState, useEffect } from "react";
import { Segment, Header, Form, Input, Button, Modal, Select } from "semantic-ui-react";
import { useEth } from "../../contexts/EthContext";

function VoterPanel({ isVoter, isOwner, proposals, setProposals, currentPhase, setWinner }) {
  const { state: { accounts, contract, artifact }, } = useEth();
  const [hasVoted, setHasVoted] = useState(false);
  const [inputProposalValue, setInputProposalValue] = useState("");
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorCode, setErrorCode] = useState("");
  const [selectedProposal, setSelectedProposal] = useState(0);

  useEffect(() => {
    async function getVoterData() {
      if (artifact) {
        console.log("VoterPanel : User is a Voter : " + isVoter + " ,isOwner : " + isOwner);

        try {
          if (isVoter) {
            const voterData = await contract.methods.getVoter(accounts[0]).call({ from: accounts[0] });
            console.log("VoterPanel :HasVoter ? " + voterData.hasVoted);
            setHasVoted(voterData.hasVoted);
          } else {
            console.log("VoterPanel :it is not a Voter");
          }
        } catch (e) {
          console.log("VoterPanel : " + e)
        }
      } else {
        console.log("VoterPanel : Smartcontract non détecté");
      }
    }

    async function getProposals() {
      if (contract) {
        // On recup les proposals
        const eventAllProposals = await contract.getPastEvents("ProposalRegistered", { fromBlock: 0, toBlock: "latest" });
        // On fait un tableau avec leur ids
        const allProposalsId = eventAllProposals.map((proposal) => proposal.returnValues.proposalId);

        // Pour chaque ID on va recup la description et constituer un tableau pour le select
        // On se prépare un tableau vide qu'on va remplir avec chaque proposals
        let proposalsDatas = [];
        for (const id of allProposalsId) {
          // On recup les données de la proposal        
          try {
            const proposal = await contract.methods.getOneProposal(parseInt(id)).call({ from: accounts[0] });
            // On rempli le tableau
            proposalsDatas.push(
              {
                key: id,
                text: proposal.description,
                value: id,
                voteCount: proposal.voteCount
              }
            );
          } catch (e) {
            console.log("VoterPanel :" + e);
          }
        }

        // On mémorise dans le state

        console.log("VoterPanel : nbProposals : " + proposalsDatas.length);
        setProposals(proposalsDatas);
      }
    }

    async function getWinner() {
      if (artifact) {
        console.log("VoterPanel : getWinner");

        try {
          if (isVoter) {
            const winnerId = await contract.methods.winningProposalID().call({ from: accounts[0] });
            const winnerProposal = await contract.methods.getOneProposal(parseInt(winnerId)).call({ from: accounts[0] });
            console.log(winnerProposal);
            setWinner(winnerProposal);
          } else {
            console.log("VoterPanel :it is not a Voter");
          }
        } catch (e) {
          console.log("VoterPanel : " + e)
        }
      } else {
        console.log("VoterPanel : Smartcontract non détecté");
      }
    }

    getVoterData();
    getProposals();
    getWinner();
  }, [accounts, contract, artifact, setProposals, isVoter, isOwner, setWinner]);

  // champs pour saisir proposal
  // champs pour voter
  const inputProposalChange = (proposal) => {
    setInputProposalValue(proposal.currentTarget.value);
  };

  const submitAddProposal = async () => {
    if (inputProposalValue === "") {
      setErrorCode("Proposal format is not correct !");
      setErrorMessage("Please add a correct proposal.");
      setOpen(true);
    } else {
      try {
        const newProposal = await contract.methods.addProposal(inputProposalValue).send({ from: accounts[0] });
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
  const selectChangeProposal = (e, data) => {
    setSelectedProposal(data.value);
    console.log("VoterPanel : selectChangeProposal :" + data.value);
  };



  const submitVote = async () => {
    try {
      let newVote = await contract.methods.setVote(parseInt(selectedProposal)).send({ from: accounts[0] });
      console.log("VoterPanel : newVote :" + newVote);
      /*
            const winnerId = await contract.methods.winningProposalID().call({ from: accounts[0] });
            const winnerProposal = await contract.methods.getOneProposal(parseInt(winnerId)).call({ from: accounts[0] });
            console.log(winnerProposal);
            setWinner(winnerProposal);
      */
      window.location.reload();

    } catch (e) {
      setOpen(true);
      setErrorCode(e.code);
      console.error("VoterPanel : mon erreur : " + errorCode);
      setErrorMessage(e.message);
      console.error("VoterPanel : mon erreur message : " + errorMessage);
    }
  };

  return (
    isVoter && !isOwner && (

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
              <Button icon='add' content='Add a proposal' color="green" type="submit" size="huge" fluid />
            </Form>
          </Segment>
        )}

        {(currentPhase === 3 && !hasVoted) && (
          <Segment size="huge" compact>
            <Select placeholder='Select a proposal' options={proposals} onChange={selectChangeProposal} />
            <Button color="green" type="submit" size="huge" onClick={submitVote}>Vote</Button>
          </Segment>
        )}
      </Segment >
    )
  );
}

export default VoterPanel;