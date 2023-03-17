import { Segment, Header, Table } from "semantic-ui-react";
function ProposalsList({ isVoter, proposals, currentPhase }) {
  return (
    isVoter && proposals.length > 0 && (
      currentPhase === 5 ? (
        <Segment size="huge" textAlign="center">
          <Header as="h2">List of proposals</Header>


          <Table celled size="small">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Description context</Table.HeaderCell>
                <Table.HeaderCell>Vote count</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {proposals.map((proposal) => {
                return (
                  <Table.Row key={proposal.key}>
                    <Table.Cell>{proposal.text}</Table.Cell>

                    <Table.Cell>{proposal.voteCount}</Table.Cell>
                  </Table.Row>
                )
              })}
            </Table.Body>
          </Table>
        </Segment >
      ) : (
        <Segment size="huge" textAlign="center">
          <Header as="h2">List of proposals</Header>
          <Table celled size="small">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Description context</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {proposals.map((proposal) => {
                return (
                  <Table.Row key={proposal.key}>
                    <Table.Cell>{proposal.text}</Table.Cell>
                  </Table.Row>
                )
              })}
            </Table.Body>
          </Table>
        </Segment >
      )
    ));
}

export default ProposalsList;
