// SPDX-License-Identifier: Unlincensed
pragma solidity ^0.8.6;

interface ISettlementTracker {
    enum SettlementStatus {
        waiting,
        minted,
        burned
    }

    struct SettlementTracker {
        address participantWallet;
        string participantType;
        string msgResponse;
        string codeResponse;
        uint settledAt;
        SettlementStatus status;
    }

    function getSettlementInfo(
        uint256 nrid
    ) external view returns (string memory);
}
