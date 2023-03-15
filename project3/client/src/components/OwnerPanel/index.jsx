import { useState, useEffect } from "react";
import { Segment, Header, Statistic, Form, Button, Input, Step, Icon, Grid, Divider } from "semantic-ui-react";
import { useEth } from "../../contexts/EthContext";

function OwnerPanel({ currentPhase, setCurrentPhase, phases }) {
  const { state: { accounts, contract, artifact }, } = useEth();
  const [isOwner, setIsOwner] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [EventValue, setEventValue] = useState("");
  const [countVoters, setCountVoters] = useState(0);

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
      }
    }

    async function getEvents() {

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

        await contract.events.VoterRegistered({ fromBlock: "earliest" })
          .on('data', event => {
            let voterAddress = event.returnValues.voterAddress;
            console.log("voterAddress : " + voterAddress);
            setCountVoters(countVoters + 1);
          })
          .on('changed', changed => console.log(changed))
          .on('error', err => console.log(err))
          .on('connected', str => console.log(str))
      }

    }

    getOwner();
    getPhase();
    getEvents();
  }, [accounts, contract, artifact, currentPhase, setCurrentPhase, countVoters]);

  const onInputChange = (evt) => {
    setInputValue(evt.currentTarget.value);
    console.log(evt.currentTarget.value);
  };

  const formSubmit = async () => {
    if (inputValue === "") {
      alert("Please enter a voter address");
      // return;
    } else {
      try {
        const newVoter = await contract.methods.addVoter(inputValue).send({ from: accounts[0] });
        //Error: invalid address
        console.log(newVoter);
        //location.reload();
        // récupérer un event event VoterRegistered(address voterAddress);

      } catch (e) {
        console.error(e)
      }
    }
  };

  const eventChangePhase = async () => {
    console.log("Current phase before : " + currentPhase);

    switch (currentPhase) {
      case 0:
        setCurrentPhase(1);
        await contract.methods.startProposalsRegistering().send({ from: accounts[0] });
        console.log("Current phase after 1 : " + EventValue);
        break;
      case 1:
        await contract.methods.endProposalsRegistering().send({ from: accounts[0] });
        setCurrentPhase(2);
        console.log("Current phase after 2 : " + EventValue);
        break;
      case 2:
        await contract.methods.startVotingSession().send({ from: accounts[0] });
        setCurrentPhase(3);
        console.log("Current phase after 3 : " + EventValue);
        break;
      case 3:
        await contract.methods.endVotingSession().send({ from: accounts[0] });
        setCurrentPhase(4);
        console.log("Current phase after 4: " + EventValue);
        break;
      case 4:
        await contract.methods.tallyVotes().send({ from: accounts[0] });
        setCurrentPhase(5);
        console.log("Current phase after 5 :" + EventValue);
        break;
      default:
        break;
    }
  };

  return (
    isOwner && (
      <Segment raised size="huge" color="blue">
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
