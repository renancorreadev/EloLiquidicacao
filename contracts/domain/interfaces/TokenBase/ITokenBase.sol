// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

interface ITokenBase {
    /// @dev Function to mint a settlement token
    function getAllNridsGeneratedByThisContract()
        external
        returns (uint[] memory);
}
