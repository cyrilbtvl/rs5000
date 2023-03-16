import { useState, useEffect } from "react";
import { Segment, Header, Statistic, Form, Button, Input, Step, Icon, Grid, Divider, Modal } from "semantic-ui-react";
import { useEth } from "../../contexts/EthContext";

function OwnerPanel({ currentPhase, setCurrentPhase, phases }) {
  const { state: { accounts, contract, artifact }, } = useEth();
  const [isOwner, setIsOwner] = useState(false);
  const [inputValue, setInputValue] = useState("");
  //const [EventValue, setEventValue] = useState("");
  const [countVoters, setCountVoters] = useState(0);
  //const [allVoterAddress, setAllVoterAddress] = useState();
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorCode, setErrorCode] = useState("");

  useEffect(() => {
    async function getOwner() {
      if (artifact) {
        console.log("OwnerPanel : user connected");
        const owner = await contract.methods.owner().call({ from: accounts[0] });
        accounts[0] === owner ? setIsOwner(true) : setIsOwner(false);
      } else {
        console.log("OwnerPanel : user not connected");
      }
    }

    async function getPhase() {
      if (artifact) {
        const phase = await contract.methods.workflowStatus().call({ from: accounts[0] });
        setCurrentPhase(parseInt(phase));
      } else {
        console.log("OwnerPanel : user not connected");
      }
    }

    async function getEvents() {
      if (contract && artifact) {
        let allVoterRegistered = await contract.getPastEvents('VoterRegistered', { fromBlock: "earliest", toBlock: "latest" });
        let allVoterRegisteredSize = allVoterRegistered.length;
        console.log("OwnerPanel : allVoterRegistered size : " + allVoterRegistered.length);
        setCountVoters(allVoterRegisteredSize);

        //let allVoterAddress = allVoterRegistered.map(_ev => _ev.returnValues.voterAddress);
        //setAllVoterAddress(allVoterAddress);
        //console.log("allVoterAddress : " + allVoterAddress);

        let allWorkflowStatusChange = await contract.getPastEvents('WorkflowStatusChange', { fromBlock: "earliest", toBlock: "latest" });
        let allWorkflowStatusChangeSize = allWorkflowStatusChange.length;
        console.log("OwnerPanel : allVoterRegistered size : " + allWorkflowStatusChangeSize.length);

        //let allVoterAddress = allVoterRegistered.map(_ev => _ev.returnValues.voterAddress);
        //console.log("allVoterAddress : " + allVoterAddress);

        await contract.events.WorkflowStatusChange({ fromBlock: "earliest" })
          .on('data', event => {
            let newStatus = event.returnValues.newStatus;
            console.log("OwnerPanel : newStatus : " + newStatus);
            setCurrentPhase(newStatus);
          })
          .on('changed', changed => console.log("OwnerPanel :" + changed))
          .on('error', err => console.log("OwnerPanel :" + err))
          .on('connected', str => console.log("OwnerPanel :" + str))

        console.log("OwnerPanel : currentPhase useEffect : " + currentPhase);
      } else {
        console.log("OwnerPanel : user not connected");
      }
    }
    /*async function getEvents() {
      //      const deployTx = await web3.eth.getTransaction(txhash)
      //      const results = await contract.getPastEvents("Transfer", { fromBlock:deployTx.blockNumber , toBlock: "latest" });
      //      await contract.getPastEvents('VoterRegistered', { fromBlock: 0, toBlock: "latest" });
      if (artifact) {
        await contract.events.WorkflowStatusChange({ fromBlock: "earliest" })
          .on('data', event => {
            let newStatus = event.returnValues.newStatus;
            console.log("newStatus : " + newStatus);
            setEventValue(newStatus);
          })
          .on('changed', changed => console.log(changed))
          .on('error', err => console.log(err))
          .on('connected', str => console.log(str))
    }*/
    getOwner();
    getPhase();
    getEvents();
  }, [accounts, artifact, contract, currentPhase, setCurrentPhase, countVoters]);
  /*
    useEffect(() => {
      async function getEvents() {
        if (contract && artifact) {
          let allVoterRegistered = await contract.getPastEvents('VoterRegistered', { fromBlock: "earliest", toBlock: "latest" });
          let allVoterRegisteredSize = allVoterRegistered.length;
          console.log("allVoterRegistered size : " + allVoterRegistered.length);
          setCountVoters(allVoterRegisteredSize);
  
          let allVoterAddress = allVoterRegistered.map(_ev => _ev.returnValues.voterAddress);
          console.log("allVoterAddress : " + allVoterAddress);
        }
      }
  
      getEvents();
    });
  */


  const onInputChange = (evt) => {
    let newAddressVoter = evt.currentTarget.value;
    setInputValue(newAddressVoter.trim());
    console.log("OwnerPanel : setInputValue : " + evt.currentTarget.value);
  };

  const formSubmit = async () => {
    if (inputValue === "") {

      setErrorCode("Address format is not correct !");
      setErrorMessage("Please add a correct address.");
      //alert("Please enter a voter address");
      setOpen(true);
    } else {
      try {
        const newVoter = await contract.methods.addVoter(inputValue).send({ from: accounts[0] });
        //Error: invalid address
        //Catcher les erreurs avec des popup

        console.log("OwnerPanel : newVoter : " + newVoter);
        window.location.reload();
        // récupérer un event event VoterRegistered(address voterAddress);

      } catch (e) {

        setOpen(true);
        setErrorCode(e.code);
        console.error("OwnerPanel : mon erreur : " + errorCode);
        setErrorMessage(e.message);
        console.error("OwnerPanel : mon erreur message : " + errorMessage);
      }
    }
  };

  const eventChangePhase = async () => {
    console.log("OwnerPanel : Current phase before : " + currentPhase);

    switch (currentPhase) {
      case 0:
        await contract.methods.startProposalsRegistering().send({ from: accounts[0] });
        //setCurrentPhase(1);
        break;
      case 1:
        await contract.methods.endProposalsRegistering().send({ from: accounts[0] });
        //setCurrentPhase(2);
        break;
      case 2:
        await contract.methods.startVotingSession().send({ from: accounts[0] });
        //setCurrentPhase(3);
        break;
      case 3:
        await contract.methods.endVotingSession().send({ from: accounts[0] });
        //setCurrentPhase(4);
        break;
      case 4:
        await contract.methods.tallyVotes().send({ from: accounts[0] });
        //setCurrentPhase(5);
        break;
      default:
        break;
    }
  };

  return (
    isOwner && (
      <Segment raised size="huge" color="blue">
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
        <Header as="h2">Owner's panel</Header>
        {currentPhase === 0 && (
          <Form onSubmit={formSubmit}>
            <Form.Field>
              <Input icon="users" iconPosition="left" placeholder="Add Voter address" size="huge" fluid
                value={inputValue}
                onChange={onInputChange}
              />
            </Form.Field>

            <Button icon='add user' content='Add' color="blue" type="submit" fluid />
          </Form>
        )}
        <Divider />
        <Grid centered columns={2}>
          <Grid.Column textAlign='center'>
            <Statistic size='mini' >
              <Statistic.Label>{countVoters > 0 ? "Voters" : "Voter"}</Statistic.Label>
              <Statistic.Value>{countVoters}</Statistic.Value>
            </Statistic>
          </Grid.Column>
        </Grid >

        <Segment>
          <Grid columns={2} relaxed='very' stackable>
            <Grid.Column width={10}>
              <Step.Group vertical>

                <Step completed={currentPhase >= 0} >
                  <Icon name='add user' />
                  <Step.Content>
                    <Step.Title>Registering Voters</Step.Title>
                    <Step.Description>Add voters</Step.Description>
                  </Step.Content>
                </Step>

                <Step completed={currentPhase >= 1} >
                  <Icon name='edit' />
                  <Step.Content>
                    <Step.Title>Proposals Registration Started</Step.Title>
                    <Step.Description>voters can input proposals</Step.Description>
                  </Step.Content>
                </Step>

                <Step completed={currentPhase >= 2} >
                  <Icon name='edit outline' />
                  <Step.Content>
                    <Step.Title>Proposals Registration Ended</Step.Title>
                    <Step.Description>voters can no longer input proposals</Step.Description>
                  </Step.Content>
                </Step>

                <Step completed={currentPhase >= 3} >
                  <Icon name='envelope open' />
                  <Step.Content>
                    <Step.Title>Voting Session Started</Step.Title>
                    <Step.Description>voters can vote for one proposal</Step.Description>
                  </Step.Content>
                </Step>

                <Step completed={currentPhase >= 4} >
                  <Icon name='envelope outline' />
                  <Step.Content>
                    <Step.Title>Voting Session Ended</Step.Title>
                    <Step.Description>voters can no longer vote</Step.Description>
                  </Step.Content>
                </Step>

                <Step completed={currentPhase >= 5} >
                  <Icon name='calculator' />
                  <Step.Content>
                    <Step.Title>Votes Tallied</Step.Title>
                    <Step.Description>Counting of votes</Step.Description>
                  </Step.Content>
                </Step>
              </Step.Group>
            </Grid.Column>
            <Grid.Column width={6} verticalAlign='middle'>
              <Button positive size='huge' content='Next step' onClick={eventChangePhase} disabled={currentPhase >= 5} />
            </Grid.Column>
          </Grid>
          <Divider vertical><Icon name='angle double right' /></Divider>
        </Segment>
      </Segment >
    )
  );
}

export default OwnerPanel;