// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.6;

interface ITransactionTracker {
    enum TransactionStatus {
        Authorized,
        Settled,
        PaymentGenerated
    }

    enum ParticipantType {
        None,
        Credenciador,
        Emissor,
        Elo,
        CIP
    }

    struct Transaction {
        uint256 nrid;
        address participantWallet;
        uint256 pan;
        uint256 mcc;
        uint256 authorizedAt;
        uint256 settledAt;
        uint256 paymentGeneratedAt;
        uint256 productBin;
        uint256 saleValue;
        TransactionStatus status;
        ParticipantType participantType;
    }

    function getTransactionInfo(
        uint256 nrid
    ) external view returns (string memory);

    function getTransactionsByParticipant(
        address participantWallet
    ) external view returns (string[] memory);

    function getTransactionsByStatus(
        TransactionStatus status
    ) external view returns (string[] memory);
}
