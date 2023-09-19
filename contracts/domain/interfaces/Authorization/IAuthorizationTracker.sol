// SPDX-License-Identifier: Unlincensed
pragma solidity ^0.8.6;

interface IAuthorizationTracker {
    enum AuthorizationStatus {
        minted,
        burned
    }

    struct AuthorizationTracker {
        address participantWallet;
        string participantType;
        uint pan;
        uint mcc;
        uint authorizedAt;
        uint productBin;
        uint saleValue;
        AuthorizationStatus status;
    }

    function getAuthorizationInfo(
        uint256 nrid
    ) external view returns (string memory);
}
