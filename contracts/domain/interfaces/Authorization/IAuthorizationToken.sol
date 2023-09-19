// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

interface IAuthorizationToken {
    /// @dev event to register and communicate that an authorization token was minted
    event AuthorityTokenMinted(
        uint256 indexed nrid,
        uint256 indexed date,
        string participantType,
        address indexed participant
    );

    /// @dev event to communicate that an authorization token was burned
    event AuthorityTokenBurned(
        uint256 indexed nrid,
        uint256 indexed date,
        string participantType,
        address indexed participant
    );

    /// @dev This function creates a transaction in the TransactionTracker contract
    function mintAuthorizationToken(
        uint256 nrid,
        uint256 pan,
        uint256 mcc,
        uint256 productBin,
        uint256 saleValue
    ) external;
}
