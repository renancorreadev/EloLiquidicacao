// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.6;

import {AuthorizationToken} from "../AuthorizationToken.sol";
import {SettlementToken} from "../SettlementToken.sol";

import {IAuthorizationTokenFactory} from "./interfaces/IAuthorizationTokenFactory.sol";

contract AuthorizationTokenFactory is IAuthorizationTokenFactory {
    event AuthorizationTokenCreated(
        address indexed participantWallet,
        address indexed authorizationTokenAddress
    );

    constructor() {}


    function createAuthorizationToken(
        address participantWallet,
        address trackerAddress
    ) external override returns (address) {
        AuthorizationToken newAuthorizationToken = new AuthorizationToken(
            trackerAddress,
            participantWallet
        );

        emit AuthorizationTokenCreated(
            participantWallet,
            address(newAuthorizationToken)
        );
        return address(newAuthorizationToken);
    }
}
