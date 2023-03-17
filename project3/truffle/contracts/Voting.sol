// SPDX-License-Identifier: MIT

pragma solidity 0.8.14;
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";


/**
 * @title A simple Voting smart contract
 * @author Cyril Boutteville && Sacha Cohen Solal
 * @dev Simple voting system deployed with truffle and truffle box react
*/
contract Voting is Ownable {
    uint256 public winningProposalID;

/**
 * @dev Voter is a struct that stores information about each voter.
 * @param isRegistered indicates if the voter is registered to vote.
 * @param hasVoted indicates if the voter has already voted.
 * @param votedProposalId indicates the ID of the proposition for which the voter has voted.
*/
    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint256 votedProposalId;
    }

/**
 * @dev Proposal is a structure that stores information about each proposal.
 * @param description indicates the description of the proposal.
 * @param voteCount indicates the total number of votes received for this proposal.
*/
    struct Proposal {
        string description;
        uint256 voteCount;
    }

/**
 * @dev WorkflowStatus is an enum that stores the different states of the voting process.
 * @param RegisteringVoters indicates that voters are being registered.
 * @param ProposalsRegistrationStarted indicates that registration of proposals has begun.
 * @param ProposalsRegistrationEnded indicates that registration of proposals is now complete.
 * @param VotingSessionStarted indicates that the voting session has begun.
 * @param VotingSessionEnded indicates that the voting session is over.
 * @param VotesTallied indicates that the votes have been tallied.
*/
    enum WorkflowStatus {
        RegisteringVoters,
        ProposalsRegistrationStarted,
        ProposalsRegistrationEnded,
        VotingSessionStarted,
        VotingSessionEnded,
        VotesTallied
    }

    WorkflowStatus public workflowStatus;
    Proposal[] proposalsArray;
    mapping(address => Voter) voters;

/**
 * @dev Issue this event when a voter is successfully registered.
 * @param voterAddress The address of the registered voter.
*/
    event VoterRegistered(address voterAddress);

/**
 * @dev Issue this event when there is a change in the state of the voting process.
 * @param previousStatus The previous status of the voting process.
 * @param newStatus The new state of the voting process.
*/
    event WorkflowStatusChange(
        WorkflowStatus previousStatus,
        WorkflowStatus newStatus
    );

/**
 * @dev Issue this event when a new proposal is registered.
 * @param proposalId The ID of the new registered proposal.
*/
    event ProposalRegistered(uint256 proposalId);

/**
 * @dev Issue this event when a voter has voted for a proposal.
 * @param voter The address of the voter who voted.
 * @param proposalId The ID of the proposition for which the voter voted.
*/
    event Voted(address voter, uint256 proposalId);

/**
 * @dev Checks if the caller's address is registered as a voter
 * @notice Only registered voters are allowed to call the functions marked with this modifier
*/
    modifier onlyVoters() {
        require(voters[msg.sender].isRegistered, "You're not a voter");
        _;
    }

    // ::::::::::::: GETTERS ::::::::::::: //

/**
 * @dev Retrieves the information of a voter registered in the contract
 * @param _addr Address of the voter
 * @return Voter's information
*/
    function getVoter(address _addr) external view onlyVoters returns (Voter memory) {
        return voters[_addr];
    }

/**
 * @dev Retrieves information from a proposal stored in the contract
 * @param _id Proposal ID
 * @return The information in the proposal
*/
    function getOneProposal(uint256 _id) external view onlyVoters returns (Proposal memory) {
        return proposalsArray[_id];
    }

    // ::::::::::::: REGISTRATION ::::::::::::: // 

/**
 * @dev Adds a voter to the list of voters registered in the contract
 * @param _addr Address of the voter to add
*/
    function addVoter(address _addr) external onlyOwner {
        require(workflowStatus == WorkflowStatus.RegisteringVoters, "Voters registration is not open yet");
        require(voters[_addr].isRegistered != true, "Already registered");
        voters[_addr].isRegistered = true;
        emit VoterRegistered(_addr);
    }

    // ::::::::::::: PROPOSAL ::::::::::::: // 

/**
 * @dev Adds a proposal to the list of proposals registered in the contract
 * @param _desc Description of the proposal
*/
    function addProposal(string calldata _desc) external onlyVoters {
        require(workflowStatus == WorkflowStatus.ProposalsRegistrationStarted, "Proposals are not allowed yet");
        require(keccak256(abi.encode(_desc)) != keccak256(abi.encode("")), "Vous ne pouvez pas ne rien proposer"); // facultatif
        // voir que desc est different des autres

        Proposal memory proposal;
        proposal.description = _desc;
        proposalsArray.push(proposal);
        emit ProposalRegistered(proposalsArray.length - 1);
    }

    // ::::::::::::: VOTE ::::::::::::: //

/**
 * @dev Records a voter's vote for a given proposition.
 * @param _id The ID of the proposition for which the voter wishes to vote.
 * @notice This function can only be called during the voting session.
 * @notice This function can only be called once per voter.
 * @notice The proposal with the corresponding ID must exist.
 * @notice This function issues a Voted event with the voter's address and the ID of the proposition he voted for.
*/
    function setVote(uint256 _id) external onlyVoters {
        require(workflowStatus == WorkflowStatus.VotingSessionStarted, "Voting session havent started yet");
        require(voters[msg.sender].hasVoted != true, "You have already voted");
        require(_id < proposalsArray.length, "Proposal not found"); // pas obligé, et pas besoin du >0 car uint

        voters[msg.sender].votedProposalId = _id;
        voters[msg.sender].hasVoted = true;
        proposalsArray[_id].voteCount++;

        if (proposalsArray[_id].voteCount > proposalsArray[winningProposalID].voteCount) {
            winningProposalID = _id;
        }


        emit Voted(msg.sender, _id);
    }


    // ::::::::::::: STATE ::::::::::::: //

/**
 * @dev This function opens the proposal registration phase.
*/
    function startProposalsRegistering() external onlyOwner {
        require(workflowStatus == WorkflowStatus.RegisteringVoters, "Registering proposals cant be started now");
        workflowStatus = WorkflowStatus.ProposalsRegistrationStarted;

        Proposal memory proposal;
        proposal.description = "GENESIS";
        proposalsArray.push(proposal);

        emit WorkflowStatusChange(WorkflowStatus.RegisteringVoters, WorkflowStatus.ProposalsRegistrationStarted);
    }

/**
 * @dev This function closes the proposal registration phase.
*/
    function endProposalsRegistering() external onlyOwner {
        require(workflowStatus == WorkflowStatus.ProposalsRegistrationStarted, "Registering proposals havent started yet");
        workflowStatus = WorkflowStatus.ProposalsRegistrationEnded;
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationStarted, WorkflowStatus.ProposalsRegistrationEnded);
    }

/**
 * @dev This function opens the voting session.
*/
    function startVotingSession() external onlyOwner {
        require(workflowStatus == WorkflowStatus.ProposalsRegistrationEnded, "Registering proposals phase is not finished");
        workflowStatus = WorkflowStatus.VotingSessionStarted;
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationEnded, WorkflowStatus.VotingSessionStarted);
    }

/**
 * @dev This function closes the voting session.
*/
    function endVotingSession() external onlyOwner {
        require(workflowStatus == WorkflowStatus.VotingSessionStarted, "Voting session havent started yet");
        workflowStatus = WorkflowStatus.VotingSessionEnded;
        emit WorkflowStatusChange(WorkflowStatus.VotingSessionStarted, WorkflowStatus.VotingSessionEnded);
    }

/**
 * @dev This function is used to count the votes and determine the winning proposal.
*/
    function tallyVotes() external onlyOwner {
        require(workflowStatus == WorkflowStatus.VotingSessionEnded, "Current status is not voting session ended");

        workflowStatus = WorkflowStatus.VotesTallied;
        emit WorkflowStatusChange(WorkflowStatus.VotingSessionEnded, WorkflowStatus.VotesTallied);
    }

}
