const Voting = artifacts.require('Voting');

const { BN, expectRevert, expectEvent } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');

contract('Voting contract tests suite', function (accounts) {
    let votingInstance;

    const owner = accounts[0];
    const voter = accounts[1];
    const anotherVoter = accounts[2];
    const unregisteredVoter = accounts[3];

    const proposalIdZero = new BN(0);
    const proposalIdOne = new BN(1);
    const defaultValue = new BN(0);

    const WorkflowStatusRegisteringVoters = new BN(0);
    const WorkflowStatusProposalsRegistrationStarted = new BN(1);
    const WorkflowStatusProposalsRegistrationEnded = new BN(2);
    const WorkflowStatusVotingSessionStarted = new BN(3);
    const WorkflowStatusVotingSessionEnded = new BN(4);
    const WorkflowStatusVotesTallie = new BN(5);



    describe('Contract ownership', () => {
        before(async function () {
            votingInstance = await Voting.new({ from: owner });
        });

        it('Ownership has been transferred', async function () {
            expect(await votingInstance.owner()).to.equal(owner);
        });
    });

    //le propietaire peut ajouter un electeur
    describe('As the owner, I should be able to add voters', () => {
        //before(async function () {
        //    votingInstance = await Voting.new({ from: owner });
        //});

        it('A voter can be registered', async function () {
            const resultSuccessAddVoter = await votingInstance.addVoter(voter, { from: owner });

            const newVoter = await votingInstance.getVoter(voter, { from: voter });

            expect(newVoter.isRegistered).to.equal(true);
            expect(newVoter.hasVoted).to.equal(false);
            expect(newVoter.votedProposalId).to.be.bignumber.equal(defaultValue);

            expectEvent(resultSuccessAddVoter, 'VoterRegistered', {
                voterAddress: voter,
            });
        });
        /*
            it('Only the owner can add voters', async function () {
                await expectRevert(votingInstance.addVoter(unregisteredVoter, { from: voter }), 'Ownable: caller is not the owner');
            });
    
            it('An address could not be registered more than once', async function () {
                await expectRevert(votingInstance.addVoter(voter), 'Already registered');
            });
        */
    });

    // le propietaire lance la phase d'enregistrement des propositions
    describe('As the owner, I should be able to start proposals registering', () => {
        before(async function () {
            //votingInstance = await Voting.new({ from: owner });
            //await votingInstance.addVoter(voter, { from: owner });
            await votingInstance.addVoter(anotherVoter, { from: owner });
        });

        it('owner start proposals registering', async function () {
            const resultSuccessStartProposalsRegistering = await votingInstance.startProposalsRegistering({ from: owner });
            const newProposal = await votingInstance.getOneProposal(proposalIdZero, { from: voter });

            expect(newProposal.description).to.equal("GENESIS");
            expect(newProposal.voteCount).to.be.bignumber.equal(proposalIdZero);

            expectEvent(resultSuccessStartProposalsRegistering, 'WorkflowStatusChange', {
                previousStatus: WorkflowStatusRegisteringVoters,
                newStatus: WorkflowStatusProposalsRegistrationStarted,
            });
        });
    });

    // un electeur peut ajouter une proposition
    describe('As the voter, I should be able to add proposal', () => {
        it('the voter add a proposal', async function () {
            const resultSuccessAddProposal = await votingInstance.addProposal("Note 2/2 for all", { from: voter });

            const proposalOne = await votingInstance.getOneProposal(proposalIdOne, { from: voter });
            expect(proposalOne.description).to.equal("Note 2/2 for all");
            expect(proposalOne.voteCount).to.be.bignumber.equal(defaultValue);

            expectEvent(resultSuccessAddProposal, 'ProposalRegistered', {
                proposalId: proposalIdOne,
            });
        });
    });


    // le propietaire stoppe la phase d'enregistrement des propositions
    describe('As the owner, I should be able to stop proposals registering', () => {
        it('owner stop proposals registering', async function () {
            const resultSuccessStopProposalsRegistering = await votingInstance.endProposalsRegistering({ from: owner });

            expectEvent(resultSuccessStopProposalsRegistering, 'WorkflowStatusChange', {
                previousStatus: WorkflowStatusProposalsRegistrationStarted,
                newStatus: WorkflowStatusProposalsRegistrationEnded,
            });
        });
    });

    // le propietaire lance la phase de vote
    describe('As the owner, I should be able to start voting session', () => {
        it('owner start voting session', async function () {
            const resultSuccessStartVotingSession = await votingInstance.startVotingSession({ from: owner });

            expectEvent(resultSuccessStartVotingSession, 'WorkflowStatusChange', {
                previousStatus: WorkflowStatusProposalsRegistrationEnded,
                newStatus: WorkflowStatusVotingSessionStarted,
            });
        });
    });

    // un électeur peut voter
    describe('As the voter, I should be able to add a vote', () => {
        it('the voter add a vote', async function () {
            const resultSuccessAddVote = await votingInstance.setVote(proposalIdOne, { from: voter });

            const proposalOne = await votingInstance.getOneProposal(proposalIdOne, { from: voter });
            expect(proposalOne.description).to.equal("Note 2/2 for all");
            expect(proposalOne.voteCount).to.be.bignumber.equal(new BN(1));

            const voterOne = await votingInstance.getVoter(voter, { from: anotherVoter });
            expect(voterOne.votedProposalId).to.be.bignumber.equal(new BN(1));
            expect(voterOne.hasVoted).to.be.true;

            expectEvent(resultSuccessAddVote, 'Voted', {
                voter: voter,
                proposalId: proposalIdOne,
            });
        });
    });

    // le propietaire stoppe la phase de vote
    describe('As the owner, I should be able to stop voting session', () => {
        it('owner stop voting session', async function () {
            const resultSuccessStopVotingSession = await votingInstance.endVotingSession({ from: owner });

            expectEvent(resultSuccessStopVotingSession, 'WorkflowStatusChange', {
                previousStatus: WorkflowStatusVotingSessionStarted,
                newStatus: WorkflowStatusVotingSessionEnded,
            });
        });
    });

    // le propietaire comptabiliser les votes
    describe('As the owner, I should be able to tally votes', () => {
        it('owner tally votes', async function () {
            const resultSuccessTallyVotes = await votingInstance.tallyVotes({ from: owner });

            expectEvent(resultSuccessTallyVotes, 'WorkflowStatusChange', {
                previousStatus: WorkflowStatusVotingSessionEnded,
                newStatus: WorkflowStatusVotesTallie,
            });
        });
    });

    // un électeur peut voir les données d'un autre électeur
    describe('As the voter, I should be able to get another voter', () => {
        it('the voter get another voter', async function () {
            await expectRevert(votingInstance.getVoter(voter, { from: owner }), 'You\'re not a voter');
        });
    });

    // un électeur peut récupérer une proposition
    describe('As the voter, I should be able to get a proposal', () => {
        it('the voter get a proposal', async function () {
            await expectRevert(votingInstance.getOneProposal(proposalIdOne, { from: owner }), 'You\'re not a voter');
        });
    });
});