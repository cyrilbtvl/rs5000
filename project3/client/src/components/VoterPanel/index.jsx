import { useState, useEffect } from "react";
import { Segment, Header, Form, Input, Button, Modal, Radio, Select } from "semantic-ui-react";
import { useEth } from "../../contexts/EthContext";

function VoterPanel({ proposals, setProposals, currentPhase, setWinner }) {
  const { state: { accounts, contract, artifact }, } = useEth();
  const [isVoter, setIsVoter] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [inputProposalValue, setInputProposalValue] = useState("");
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorCode, setErrorCode] = useState("");
  const [selectedProposal, setSelectedProposal] = useState(0);
  const [proposalsArray, setProposalsArray] = useState([]);

  const countryOptions = [
    { key: 'af', value: 'af', text: 'Afghanistan' },
    { key: 'ax', value: 'ax', text: 'Aland Islands' },
    { key: 'al', value: 'al', text: 'Albania' },
    { key: 'dz', value: 'dz', text: 'Algeria' },
    { key: 'as', value: 'as', text: 'American Samoa' },
    { key: 'ad', value: 'ad', text: 'Andorra' },
    { key: 'ao', value: 'ao', text: 'Angola' },
    { key: 'ai', value: 'ai', text: 'Anguilla' },
    { key: 'ag', value: 'ag', text: 'Antigua' },
    { key: 'ar', value: 'ar', text: 'Argentina' },
    { key: 'am', value: 'am', text: 'Armenia' },
    { key: 'aw', value: 'aw', text: 'Aruba' },
    { key: 'au', value: 'au', text: 'Australia' },
    { key: 'at', value: 'at', text: 'Austria' },
    { key: 'az', value: 'az', text: 'Azerbaijan' },
    { key: 'bs', value: 'bs', text: 'Bahamas' },
    { key: 'bh', value: 'bh', text: 'Bahrain' },
    { key: 'bd', value: 'bd', text: 'Bangladesh' },
    { key: 'bb', value: 'bb', text: 'Barbados' },
    { key: 'by', value: 'by', text: 'Belarus' },
    { key: 'be', value: 'be', text: 'Belgium' },
    { key: 'bz', value: 'bz', text: 'Belize' },
    { key: 'bj', value: 'bj', text: 'Benin' },
  ];

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
            setHasVoted(voterData.hasVoted);
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
    async function getProposals() {
      if (contract) {
        // On recup les proposals
        const eventAllProposals = await contract.getPastEvents("ProposalRegistered", { fromBlock: 0, toBlock: "latest" });
        // On fait un tableau avec leur ids
        const allProposalsId = eventAllProposals.map((proposal) => proposal.returnValues.proposalId);

        // Pour chaque ID on va recup la description et constituer un tableau pour le select
        // On se prépare un tableau vide qu'on va remplir avec chaque proposals
        let proposalsDatas = [];

        // Utilisation de la boucle for
        // Foreach ne permet pas de déclencher plusieurs call asynchrone correctement
        //https://stackoverflow.com/questions/37576685/using-async-await-with-a-foreach-loop
        for (const id of allProposalsId) {
          // On recup les données de la proposal
          const proposal = await contract.methods.getOneProposal(parseInt(id)).call({ from: accounts[0] });
          // On rempli le tableau
          proposalsDatas.push(
            {
              key: id,
              text: proposal.description,
              value: id
            }
          );
        }

        // On mémorise dans le state
        setProposalsArray(proposalsDatas);
      }
    }
    getVoterData();
    getProposals();
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




  const selectChangeProposal = (e, data) => {
    setSelectedProposal(data.value);
    console.log("VoterPanel : selectChangeProposal :" + data.value);
  };

  const submitVote = async () => {
    await contract.methods.setVote(parseInt(selectedProposal)).send({ from: accounts[0] });

    // const winnerId = await contract.methods.winningProposalID().call({ from: accounts[0] });
    // const winnerProposal = await contract.methods.getOneProposal(parseInt(winnerId)).call({ from: accounts[0] });
    // console.log(winnerProposal);
    // setWinner(winnerProposal);

    window.location.reload();
  };

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

        {(currentPhase === 3 && !hasVoted) && (
          <Segment size="huge" compact>
            <Select placeholder='Select a proposal' options={proposalsArray} onChange={selectChangeProposal} />
            <Button color="green" type="submit" size="huge" onClick={submitVote}>Vote</Button>
          </Segment>
        )}
      </Segment >
    )
  );
}

export default VoterPanel;
