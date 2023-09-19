import {ITransactionTracker} from "../ITransactionTracker.sol";
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

interface IManagementCore {
    struct ParticipantDetails {
        address participant;
        string participantType;
        address settlementAddress;
        address authorizationAddress;
    }

    /// @dev event to register and communicate a participant addition
    event ParticipantAdded(
        address indexed participantWallet,
        string participantType
    );

    /// @dev Function to add a participant
    function addParticipant(
        address participantWallet,
        string memory participantType
    ) external;

    /// @dev Function to retrieve transaction information
    function getTransactionInfo(
        uint256 nrid
    ) external view returns (string memory);

    /// @dev Function to retrieve transactions by participant
    function getTransactionsByParticipant(
        address participantWallet
    ) external view returns (string[] memory);

    /// @dev Function to retrieve transactions by status
    function getTransactionsByStatus(
        ITransactionTracker.TransactionStatus status
    ) external view returns (string[] memory);

    function getParticipantInfo(
        address participantAddress
    ) external view returns (string memory);
}
