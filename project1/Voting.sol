// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.18;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract Voting is Ownable {

    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint votedProposalId;
    }
   
    struct Proposal {
        string description;
        uint voteCount;
    }

    enum WorkflowStatus {
        RegisteringVoters,
        ProposalsRegistrationStarted,
        ProposalsRegistrationEnded,
        VotingSessionStarted,
        VotingSessionEnded,
        VotesTallied
    }

    mapping(address => Voter) mVotersWhitelist;
    mapping(WorkflowStatus => string) mStatus;

    Proposal[] proposalArray;
    string[] viewListProposal;

    WorkflowStatus currentStatus = WorkflowStatus.RegisteringVoters;

    uint winningProposalId;
    bool atLeastOneVote = false;//will verify that there was at least one vote

    event VoterRegistered(address voterAddress);
    event ProposalRegistered(uint proposalId);
    event Voted (address voter, uint proposalId);
    event WorkflowStatusChange(WorkflowStatus previousStatus, WorkflowStatus newStatus);

    constructor() {
        mStatus[WorkflowStatus.RegisteringVoters] = "RegisteringVoters";
        mStatus[WorkflowStatus.ProposalsRegistrationStarted] = "ProposalsRegistrationStarted";
        mStatus[WorkflowStatus.ProposalsRegistrationEnded] = "ProposalsRegistrationEnded";
        mStatus[WorkflowStatus.VotingSessionStarted] = "VotingSessionStarted";
        mStatus[WorkflowStatus.VotingSessionEnded] = "VotingSessionEnded";
        mStatus[WorkflowStatus.VotesTallied] = "VotesTallied";
    }

    modifier onlyBeforeVotingSession() {
        require(currentStatus != WorkflowStatus.VotingSessionStarted 
            && currentStatus != WorkflowStatus.VotingSessionEnded 
            && currentStatus != WorkflowStatus.VotesTallied, unicode"A voting session is not finished.");
       _;
    }

    modifier isStatus(WorkflowStatus status) {
        require(currentStatus == status, "The current status of the voting process does not allow this action.");
        _;
    }
    
    modifier onlyRegisteredVoter() {
        require(mVotersWhitelist[msg.sender].isRegistered,unicode"You don't have enough rights. Please contact the administrator to register.");
        _;
    }

    //L'administrateur du vote enregistre une liste blanche d'�lecteurs identifi�s par leur adresse Ethereum
    function addVoterWhitelist(address _voterAddress) external onlyOwner onlyBeforeVotingSession {
        require(!mVotersWhitelist[_voterAddress].isRegistered, unicode"This voter is already registered");
        
        mVotersWhitelist[_voterAddress] = Voter(true, false, 0);

        emit VoterRegistered(_voterAddress); 
    }

    //L'administrateur du vote commence la session d'enregistrement de la proposition.
    function startTheProposalRegistrationSession() external onlyOwner isStatus(WorkflowStatus.RegisteringVoters) {
        currentStatus = WorkflowStatus.ProposalsRegistrationStarted;
        emit WorkflowStatusChange(WorkflowStatus.RegisteringVoters, WorkflowStatus.ProposalsRegistrationStarted);
    }

    //Les �lecteurs inscrits sont autoris�s � enregistrer leurs propositions pendant que la session d'enregistrement est active.
    function addAProposal(string memory _description) external isStatus(WorkflowStatus.ProposalsRegistrationStarted) onlyRegisteredVoter {
        uint proposalId  = proposalArray.length;
        proposalArray.push(Proposal(_description, 0));

        viewListProposal.push(string.concat(" ProposalId : ", Strings.toString(proposalId), " : ", _description));

        emit ProposalRegistered(proposalId);
    }

    // L'administrateur de vote met fin � la session d'enregistrement des propositions.
    function stopTheProposalRegistrationSession() external onlyOwner isStatus(WorkflowStatus.ProposalsRegistrationStarted) {
        require(proposalArray.length > 0,unicode"No proposals are available to be voted on");
        currentStatus = WorkflowStatus.ProposalsRegistrationEnded;
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationStarted, WorkflowStatus.ProposalsRegistrationEnded);
    }

    // L'administrateur du vote commence la session de vote.
    function startVotingSession() external onlyOwner isStatus(WorkflowStatus.ProposalsRegistrationEnded) {
        currentStatus = WorkflowStatus.VotingSessionStarted;
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationEnded, WorkflowStatus.VotingSessionStarted);
    }

    // Les �lecteurs inscrits peuvent voir toutes les propositions qui sont soumises aux votes
    function showAllProposal() external view onlyRegisteredVoter onlyBeforeVotingSession returns (string[] memory) {
        return viewListProposal;
    }

    // Les �lecteurs inscrits votent pour leur proposition pr�f�r�e.
    function addAVote(uint _proposalId) external isStatus(WorkflowStatus.VotingSessionStarted) onlyRegisteredVoter {
        require(!mVotersWhitelist[msg.sender].hasVoted,unicode"You have already voted");

        mVotersWhitelist[msg.sender].hasVoted = true;
        mVotersWhitelist[msg.sender].votedProposalId = _proposalId;

        proposalArray[_proposalId].voteCount += 1;

        atLeastOneVote = true;
        emit Voted(msg.sender, _proposalId);
    }

    // L'administrateur du vote met fin � la session de vote.
    function stopVotingSession() external isStatus(WorkflowStatus.VotingSessionStarted) onlyOwner {
        require(atLeastOneVote,unicode"No vote has been taken yet.");
        currentStatus = WorkflowStatus.VotingSessionEnded;
        emit WorkflowStatusChange(WorkflowStatus.VotingSessionStarted, WorkflowStatus.VotingSessionEnded);
    }
    
    // L'administrateur du vote comptabilise les votes.
    function calculateTheVotesResult() external isStatus(WorkflowStatus.VotingSessionEnded) onlyOwner {
        uint winningVoteCount = 0; 
        for (uint p = 0; p < proposalArray.length; p++) {
            if (proposalArray[p].voteCount > winningVoteCount) {
                winningVoteCount = proposalArray[p].voteCount; 
                winningProposalId = p;
            }
        }

        currentStatus = WorkflowStatus.VotesTallied;
        emit WorkflowStatusChange(WorkflowStatus.VotingSessionEnded, WorkflowStatus.VotesTallied);
    }

    // Tout le monde peut voir le num�ro de gagnant
    function getWinner() external view isStatus(WorkflowStatus.VotesTallied)  returns (uint){
        return winningProposalId;
    }

    // Tout le monde peut v�rifier la description de la proposition gagnante.
    function showDescriptionWinningProposal() external view isStatus(WorkflowStatus.VotesTallied) returns (string memory) {
        return proposalArray[winningProposalId].description;
    }
    
    // Tout le monde peut v�rifier les derniers d�tails de la proposition gagnante.
    function showWinningProposal() external view isStatus(WorkflowStatus.VotesTallied) returns(string memory description, uint nbVotes){
        return (proposalArray[winningProposalId].description, proposalArray[winningProposalId].voteCount);
    }

    // Les �lecteurs inscrits peuvent voir toutes les votes
    function showListVote() external view onlyRegisteredVoter isStatus(WorkflowStatus.VotesTallied) returns(Proposal[] memory){
        return proposalArray;
    }

    // Chaque �lecteur peut voir les votes d'un autre
    function showVoteOf(address _voterAddress) external view onlyRegisteredVoter isStatus(WorkflowStatus.VotesTallied) returns (uint, string memory){
        uint idProp = mVotersWhitelist[_voterAddress].votedProposalId;
        return (idProp, proposalArray[idProp].description);
    }

    // L'administrateur du vote peut r�cup�rer le status courant de la session de vote
    function getCurrentStatus() external view onlyOwner returns (string memory){
        return mStatus[currentStatus];
    }
}