// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

interface IAuthorizationTokenFactory {
    function createAuthorizationToken(
        address participantWallet,
        address trackerAddress
    ) external returns (address);
}