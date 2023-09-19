
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

interface ISettlementToken {
    /// @dev event to register and communicate that a settlement token was minted
    event SettlementTokenMinted(
        uint256 indexed nrid,
        uint256 indexed date,
        string participantType
    );

    /// @dev event to register when authorization status is updated
    event AuthorizationStatusUpdated(
        uint256 indexed nrid,
        uint256 indexed date,
        string indexed status,
        bool burned
    );

    /// @dev event to communicate that a settlement token was burned
    event SettlementTokenBurned(
        uint256 indexed nrid,
        uint256 indexed date
    );

    /// @dev Function to mint a settlement token
    function mintSettlementToken(uint256 nrid) external;
}
