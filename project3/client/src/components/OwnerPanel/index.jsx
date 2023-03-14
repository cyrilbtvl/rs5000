import { useState, useEffect } from "react";
import { Segment, Header, Statistic, Form, Button, Input, Step, Icon, Grid, Divider } from "semantic-ui-react";
import { useEth } from "../../contexts/EthContext";

function OwnerPanel({ currentPhase, setCurrentPhase, phases }) {
  const { state: { accounts, contract, artifact }, } = useEth();
  const [isOwner, setIsOwner] = useState(false);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    async function getOwner() {
      if (artifact) {
        console.log("OwnerPanel : user connected");
        // On check si l'account courant est l'owner du contract
        const owner = await contract.methods.owner().call({ from: accounts[0] });
        accounts[0] === owner ? setIsOwner(true) : setIsOwner(false);
      } else {
        console.log("OwnerPanel : user not connected");
      }
    }

    async function getPhase() {
      if (artifact) {
        // On check si l'account courant est l'owner du contract
        const phase = await contract.methods.workflowStatus().call({ from: accounts[0] });
        setCurrentPhase(parseInt(phase));
      }
    }

    getOwner();
    getPhase();

  }, [accounts, contract, artifact, currentPhase, setCurrentPhase]);

  const handleChange = (evt) => {
    setInputValue(evt.currentTarget.value);
  };

  const handleSubmit = async () => {
    if (inputValue === "") {
      alert("Please enter an address");
      return;
    }
    await contract.methods.addVoter(inputValue).send({ from: accounts[0] });
    // const newVoter = await contract.methods.getVoter(inputValue).call({ from: accounts[0] });
    // console.log(newVoter);
    //location.reload();
  };

  return (
    isOwner && (
      <Segment raised size="huge" color="blue">
        <Header as="h2">Owner's panel</Header>
        {currentPhase === 0 && (
          <Form onSubmit={handleSubmit}>
            <Form.Field>
              <Input
                value={inputValue}
                icon="users"
                iconPosition="left"
                placeholder="Add Voter address"
                size="huge"
                fluid
                onChange={handleChange}
              />
            </Form.Field>

            <Button icon='add user' content='Add' color="blue" type="submit" fluid />
          </Form>
        )}
        <Divider />
        <Grid centered columns={2}>
          <Grid.Column textAlign='center'>
            <Statistic size='mini' >
              <Statistic.Label>Voter</Statistic.Label>
              <Statistic.Value>0</Statistic.Value>
            </Statistic>
          </Grid.Column>
        </Grid >
        <Segment>
          <Grid columns={2} relaxed='very' stackable>
            <Grid.Column width={10}>
              <Step.Group vertical>
                <Step completed>
                  <Icon name='add user' />
                  <Step.Content>
                    <Step.Title>Registering Voters</Step.Title>
                    <Step.Description>Add voters</Step.Description>
                  </Step.Content>
                </Step>

                <Step>
                  <Icon name='edit' />
                  <Step.Content>
                    <Step.Title>Proposals Registration Started</Step.Title>
                    <Step.Description>voters can input proposals</Step.Description>
                  </Step.Content>
                </Step>

                <Step>
                  <Icon name='edit outline' />
                  <Step.Content>
                    <Step.Title>Proposals Registration Ended</Step.Title>
                    <Step.Description>voters can no longer input proposals</Step.Description>
                  </Step.Content>
                </Step>

                <Step>
                  <Icon name='envelope open' />
                  <Step.Content>
                    <Step.Title>Voting Session Started</Step.Title>
                    <Step.Description>voters can vote for one proposal</Step.Description>
                  </Step.Content>
                </Step>

                <Step>
                  <Icon name='envelope outline' />
                  <Step.Content>
                    <Step.Title>Voting Session Ended</Step.Title>
                    <Step.Description>voters can no longer vote</Step.Description>
                  </Step.Content>
                </Step>

                <Step>
                  <Icon name='calculator' />
                  <Step.Content>
                    <Step.Title>Votes Tallied</Step.Title>
                    <Step.Description>Counting of votes</Step.Description>
                  </Step.Content>
                </Step>
              </Step.Group>
            </Grid.Column>
            <Grid.Column width={6} verticalAlign='middle'>
              <Button positive size='huge' content='Next step' />
            </Grid.Column>
          </Grid>
          <Divider vertical><Icon name='angle double right' /></Divider>
        </Segment>
      </Segment >
    )
  );
}

export default OwnerPanel;
