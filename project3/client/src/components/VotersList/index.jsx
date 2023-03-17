// == Import npm
import { Segment, Header, Table } from "semantic-ui-react";
import { useState, useEffect } from "react";
import { useEth } from "../../contexts/EthContext";

// == Composant
function VotersList() {
  const { state: { accounts, contract, artifact }, } = useEth();
  const [voters, setVoters] = useState([]);
  const [isVoter, setIsVoter] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {

    async function getVoterData() {
      if (artifact) {
        console.log("VoterList : user connected");

        try {
          // On recup les voters déjà dans la whitelist
          let allVoterRegistered = await contract.getPastEvents('VoterRegistered', { fromBlock: 0, toBlock: "latest" });
          // On fait un tableau avec leur adresses
          let allVoterAddress = allVoterRegistered.map((voter) => voter.returnValues.voterAddress);

          // On mémorise dans le state
          setVoters(allVoterAddress);

          let isAVoter = allVoterAddress.includes(accounts[0]);
          console.log("VoterList : isVoter ? " + isAVoter);
          if (isAVoter) {
            console.log("VoterList : it is a Voter");
            setIsVoter(true);
          } else {
            console.log("VoterList : it is not a Voter");
            setIsVoter(false);
            getOwner();
          }
        } catch (e) {
          console.log("VoterList : " + e)
        }
      } else {
        console.log("VoterList : user not connected");
      }
    };

    async function getOwner() {
      if (artifact) {
        const owner = await contract.methods.owner().call({ from: accounts[0] });
        accounts[0] === owner ? setIsOwner(true) : setIsOwner(false);
      } else {
        console.log("VoterList : user not connected");
      }
    }

    getVoterData();
  }, [accounts, contract, artifact]);

  return (
    (isVoter || isOwner) && (
      <Segment size="huge" textAlign="center">
        <Header as="h2">List of voters</Header>

        <Table celled size="small">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Address</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {voters.map((voterAddr) => {
              return (
                <Table.Row key={voterAddr}>
                  <Table.Cell>{voterAddr}</Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
      </Segment>
    ));
}

// == Export
export default VotersList;
