// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.6;

interface ISettlementTokenFactory {
    function createSettlementToken(
        address participantWallet,
        address trackerAddress,
        address authorizationTokenAddress
    ) external returns (address);
}