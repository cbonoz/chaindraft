// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DraftContract {
    // Define a lineup structure with player IDs as strings
    struct Lineup {
        string[5] playerIds;  // A lineup consists of 5 player IDs
        bool isSubmitted;     // Track if the lineup is submitted
        uint submissionTime;  // Timestamp when the lineup was submitted
        address owner;        // Owner of the lineup
    }

    // Define a contest structure
    struct Contest {
        string name;
        uint entryFee;
        uint prizePool;
        Lineup[] lineups;
        bool isActive;
        address winner;
        string allowedTeams;   // List of allowed teams for the contest
        uint creationTime;     // Timestamp when the contest was created
        uint closeTime;        // Timestamp when the contest closes for new submissions
        bytes32 passcodeHash;  // Hash of the optional passcode for the contest
        address owner;         // Owner of the contest
    }

    // Mapping to store contests
    mapping(uint => Contest) public contests;
    uint public contestCount;

    // Create a new contest with an optional passcode, entry fee, and close time
    function createContest(
        string memory _name,
        uint _entryFee,
        string memory _passcode,
        uint _closeTime,
        string memory _allowedTeams
    ) public returns (uint) {
        require(_closeTime > block.timestamp, "Close time must be in the future");
        contestCount++;
        Contest storage newContest = contests[contestCount];
        newContest.name = _name;
        newContest.entryFee = _entryFee;
        newContest.prizePool = 0;
        newContest.isActive = true;
        newContest.creationTime = block.timestamp; // Record contest creation time
        newContest.allowedTeams = _allowedTeams; // Set the allowed teams
        newContest.closeTime = _closeTime; // Set the contest close time
        newContest.owner = msg.sender; // Set the owner of the contest

        // Set passcode hash if passcode is provided, otherwise set to 0
        if (bytes(_passcode).length > 0) {
            newContest.passcodeHash = keccak256(abi.encodePacked(_passcode));
        } else {
            newContest.passcodeHash = bytes32(0);
        }
        return contestCount;
    }

    // Submit a lineup for a contest
    function submitLineup(
        uint _contestId,
        string[5] memory _playerIds,
        string memory _passcode
    ) public payable {
        Contest storage contest = contests[_contestId];
        require(contest.isActive, "Contest is not active");
        require(block.timestamp <= contest.closeTime, "Submission period has ended");

        // Check passcode if it is set
        if (contest.passcodeHash != bytes32(0)) {
            require(
                keccak256(abi.encodePacked(_passcode)) == contest.passcodeHash,
                "Incorrect passcode"
            );
        }

        // check if already participant
        for (uint i = 0; i < contest.lineups.length; i++) {
            require(contest.lineups[i].owner != msg.sender, "Already participant");
        }

        if (contest.entryFee > 0) {
            require(msg.value == contest.entryFee, "Incorrect entry fee");
        } else {
            require(msg.value == 0, "No entry fee required for this contest");
        }

// push the lineup to the contest
        contest.lineups.push(Lineup({
            playerIds: _playerIds,
            isSubmitted: true,
            submissionTime: block.timestamp,
            owner: msg.sender
        }));

        // Increase the prize pool if there's an entry fee
        if (contest.entryFee > 0) {
            contest.prizePool += msg.value;
        }
    }

    // End the contest and set the winner
    function setWinner(uint _contestId, address _winner) public {
        Contest storage contest = contests[_contestId];
        require(contest.isActive, "Contest is not active");
        require(msg.sender == contest.owner, "Only the contest owner can set the winner");
        require(isParticipant(_contestId, _winner), "The provided address is not a participant");

        // Assign the winner and deactivate the contest
        contest.winner = _winner;
        contest.isActive = false;

        // Transfer the prize pool to the winner if there is any prize
        if (contest.prizePool > 0) {
            payable(_winner).transfer(contest.prizePool);
        }
    }

    // Check if an address is a participant in a contest
    function isParticipant(uint _contestId, address _address) internal view returns (bool) {
        Contest storage contest = contests[_contestId];
        for (uint i = 0; i < contest.lineups.length; i++) {
            if (contest.lineups[i].owner == _address) {
                return true;
            }
        }
        return false;
    }

    // Get contest information
    function getContestInfo(uint _contestId) public view returns (
        string memory name,
        uint entryFee,
        uint prizePool,
        bool isActive,
        address winner,
        uint creationTime,
        uint closeTime,
        string memory allowedTeams,
        address owner,
        Lineup[] memory lineups
    ) {
        Contest storage contest = contests[_contestId];
        name = contest.name;
        entryFee = contest.entryFee;
        prizePool = contest.prizePool;
        isActive = contest.isActive;
        winner = contest.winner;
        creationTime = contest.creationTime;
        closeTime = contest.closeTime;
        allowedTeams = contest.allowedTeams;
        owner = contest.owner;
        // Return all lineups if owner else return only the player's lineup
        if (msg.sender == contest.owner) {
            lineups = contest.lineups;
        } else {
            for (uint i = 0; i < contest.lineups.length; i++) {
                if (contest.lineups[i].owner == msg.sender) {
                    lineups = new Lineup[](1);
                    lineups[0] = contest.lineups[i];
                    break;
                }
            }
        }
    }

    // Get a list of participants for a contest
    function getParticipants(uint _contestId) public view returns (Lineup[] memory) {
        Contest storage contest = contests[_contestId];
        return contest.lineups;
    }

    // Get a player's lineup
    function getLineup(uint _contestId, address _player) public view returns (string[5] memory playerIds, bool isSubmitted, uint submissionTime) {
        Contest storage contest = contests[_contestId];
        for (uint i = 0; i < contest.lineups.length; i++) {
            if (contest.lineups[i].owner == _player) {
                Lineup storage lineup = contest.lineups[i];
                playerIds = lineup.playerIds;
                isSubmitted = lineup.isSubmitted;
                submissionTime = lineup.submissionTime;
                break;
            }
        }
    }
}
