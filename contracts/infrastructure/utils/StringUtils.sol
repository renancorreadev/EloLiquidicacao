// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/// Interfaces imports from domain
import {ITransactionTracker} from "../../domain/interfaces/ITransactionTracker.sol";
import {IAuthorizationTracker} from "../../domain/interfaces/Authorization/IAuthorizationTracker.sol";
import {ISettlementTracker} from "../../domain/interfaces/Settlement/ISettlementTracker.sol";

library StringUtils {
    // --------------------------------- UTILS FOR STRING -----------------------------
    function participantTypeFromString(
        string memory _participantTypeName
    ) internal pure returns (ITransactionTracker.ParticipantType) {
        if (
            keccak256(bytes(_participantTypeName)) ==
            keccak256(bytes("Credenciador"))
        ) {
            return ITransactionTracker.ParticipantType.Credenciador;
        } else if (
            keccak256(bytes(_participantTypeName)) ==
            keccak256(bytes("Emissor"))
        ) {
            return ITransactionTracker.ParticipantType.Emissor;
        } else if (
            keccak256(bytes(_participantTypeName)) == keccak256(bytes("Elo"))
        ) {
            return ITransactionTracker.ParticipantType.Elo;
        } else if (
            keccak256(bytes(_participantTypeName)) == keccak256(bytes("CIP"))
        ) {
            return ITransactionTracker.ParticipantType.CIP;
        }
        return ITransactionTracker.ParticipantType.None;
    }

    function uintToString(
        uint256 _value
    ) internal pure returns (string memory) {
        if (_value == 0) {
            return "0";
        }

        uint256 temp = _value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (_value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(_value % 10)));
            _value /= 10;
        }
        return string(buffer);
    }

    function addressToString(
        address _address
    ) internal pure returns (string memory) {
        bytes32 value = bytes32(uint256(uint160(_address)));
        bytes memory alphabet = "0123456789abcdef";
        bytes memory str = new bytes(42);
        str[0] = "0";
        str[1] = "x";
        for (uint i = 0; i < 20; i++) {
            str[2 + i * 2] = alphabet[uint8(value[i + 12] >> 4)];
            str[3 + i * 2] = alphabet[uint8(value[i + 12] & 0x0f)];
        }
        return string(str);
    }

    function transactionStatusToString(
        ITransactionTracker.TransactionStatus _status
    ) internal pure returns (string memory) {
        if (_status == ITransactionTracker.TransactionStatus.Authorized) {
            return "Authorized";
        } else if (_status == ITransactionTracker.TransactionStatus.Settled) {
            return "Settled";
        } else if (
            _status == ITransactionTracker.TransactionStatus.PaymentGenerated
        ) {
            return "PaymentGenerated";
        }
        return "";
    }

    function authorizatioStatusToString(
        IAuthorizationTracker.AuthorizationStatus _status
    ) internal pure returns (string memory) {
        if (_status == IAuthorizationTracker.AuthorizationStatus.minted) {
            return "minted";
        } else if (
            _status == IAuthorizationTracker.AuthorizationStatus.burned
        ) {
            return "burned";
        }
        return "";
    }

    function settlementStatusToString(
        ISettlementTracker.SettlementStatus _status
    ) internal pure returns (string memory) {
        if (_status == ISettlementTracker.SettlementStatus.waiting) {
            return "waiting";
        } else if (_status == ISettlementTracker.SettlementStatus.minted) {
            return "minted";
        } else if (_status == ISettlementTracker.SettlementStatus.burned) {
            return "burned";
        }
        return "";
    }

    function participantTypeToString(
        ITransactionTracker.ParticipantType _participantType
    ) internal pure returns (string memory) {
        if (
            _participantType == ITransactionTracker.ParticipantType.Credenciador
        ) {
            return "Credenciador";
        } else if (
            _participantType == ITransactionTracker.ParticipantType.Emissor
        ) {
            return "Emissor";
        } else if (
            _participantType == ITransactionTracker.ParticipantType.Elo
        ) {
            return "Elo";
        } else if (
            _participantType == ITransactionTracker.ParticipantType.CIP
        ) {
            return "CIP";
        }
        return "";
    }

    function convertParticipantType(
        ITransactionTracker.ParticipantType input
    ) internal pure returns (ITransactionTracker.ParticipantType) {
        if (input == ITransactionTracker.ParticipantType.Credenciador) {
            return ITransactionTracker.ParticipantType.Credenciador;
        } else if (input == ITransactionTracker.ParticipantType.Emissor) {
            return ITransactionTracker.ParticipantType.Emissor;
        } else if (input == ITransactionTracker.ParticipantType.Elo) {
            return ITransactionTracker.ParticipantType.Elo;
        } else if (input == ITransactionTracker.ParticipantType.CIP) {
            return ITransactionTracker.ParticipantType.CIP;
        }
        return ITransactionTracker.ParticipantType.None;
    }
}
