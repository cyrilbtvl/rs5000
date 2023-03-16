// == Import npm
import { Segment, Header, Table } from "semantic-ui-react";
import { useState, useEffect } from "react";
import { useEth } from "../../contexts/EthContext";

// == Composant
function ProposalsList({ proposals, currentPhase }) {
  const { state: { accounts, contract, artifact }, } = useEth();
  const [isVoter, setIsVoter] = useState(false);
  const [proposalsData, setProposalsData] = useState([]);

  useEffect(() => {
    async function getVoterData() {
      if (artifact) {
        console.log("ProposalsList : User trouvé");

        try {
          let allVoterRegistered = await contract.getPastEvents('VoterRegistered', { fromBlock: 0, toBlock: "latest" });
          let allVoterAddress = allVoterRegistered.map(_ev => _ev.returnValues.voterAddress);
          let isAVoter = allVoterAddress.includes(accounts[0]);
          console.log("ProposalsList : isVoter ? " + isAVoter);
          if (isAVoter) {
            setIsVoter(true);
          } else {
            console.log("ProposalsList : it is not a Voter");
            setIsVoter(false);
          }

        } catch (e) {
          console.log("ProposalsList : " + e)
        }
      } else {
        console.log("ProposalsList : user not connected");
      }
    };

    async function getProposals() {
      if (contract && isVoter) {
        console.log("ProposalsList : user connected");
        // On recup les proposals
        const allProposals = await contract.getPastEvents("ProposalRegistered", { fromBlock: 0, toBlock: "latest" });
        // On fait un tableau avec leur ids
        const proposalsId = allProposals.map((proposal) => proposal.returnValues.proposalId);
        console.log("ProposalsList : allProposals length : " + allProposals.length);
        // Pour chaque ID on va recup les infos avec la fonction getOneProposal du contrat
        // On se prépare un tableau vide qu'on va remplir avec chaque proposals
        let proposalsDatas = [];

        // Utilisation de la boucle for
        // Foreach ne permet pas de déclencher plusieurs call asynchrone correctement
        //https://stackoverflow.com/questions/37576685/using-async-await-with-a-foreach-loop
        for (const id of proposalsId) {
          // On recup les données de la proposal
          const proposal = await contract.methods.getOneProposal(parseInt(id)).call({ from: accounts[0] });
          // On rempli le tableau
          console.log("ProposalsList : Array");
          proposalsDatas.push(
            {
              id: id,
              desc: proposal.description,
              voteCount: proposal.voteCount
            }
          );
        }

        // On mémorise dans le state
        setProposalsData(proposalsDatas);
      } else {
        console.log("ProposalsList : user is not connected");
      }
    };

    getVoterData();
    getProposals();
  }, [accounts, contract, artifact, isVoter]);

  return (
    isVoter && (
      currentPhase === 5 ? (
        <Segment size="huge" textAlign="center">
          <Header as="h2">List of proposals</Header>

          <Table celled size="small">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Description</Table.HeaderCell>
                <Table.HeaderCell>Vote count</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {proposalsData.map((proposal) => {
                return (
                  <Table.Row key={proposal.id}>
                    <Table.Cell>{proposal.desc}</Table.Cell>

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
                <Table.HeaderCell>Description of proposal</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {proposalsData.map((proposal) => {
                return (
                  <Table.Row key={proposal.id}>
                    <Table.Cell>{proposal.desc}</Table.Cell>
                  </Table.Row>
                )
              })}
            </Table.Body>
          </Table>
        </Segment >
      )
    ));
}

// == Export
export default ProposalsList;
