import { Segment, Header, Table } from "semantic-ui-react";

function VotersList({ isOwner, isVoter, voters }) {
  return (
    (isVoter || isOwner) && voters != null && voters.length > 0 && (
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
export default VotersList;
