// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.6;

import {AuthorizationToken} from "../AuthorizationToken.sol";
import {SettlementToken} from "../SettlementToken.sol";

contract SettlementTokenFactory {

    event SettlementTokenCreated(
        address indexed participantWallet,
        address settlementTokenAddress
    );

    constructor() {}


    function createSettlementToken(
        address participantWallet,
        address trackerAddress,
        address authorizationTokenAddress
    ) external returns (address) {
        SettlementToken newSettlementToken = new SettlementToken(
            trackerAddress,
            authorizationTokenAddress,
            participantWallet
        );
        emit SettlementTokenCreated(
            participantWallet,
            address(newSettlementToken)
        );
        return address(newSettlementToken);
    }
}
