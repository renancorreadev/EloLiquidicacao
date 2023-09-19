// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

import {TransactionTracker} from "./TransactionTracker.sol";
import {AuthorizationToken} from "../base/AuthorizationToken.sol";
import {SettlementToken} from "../base/SettlementToken.sol";
import {ManagementStorage} from "./storage/ManagementStorage.sol";

/// @dev interfaces imports from domain
import {ITransactionTracker} from "../domain/interfaces/ITransactionTracker.sol";
import {IManagementCore} from "../domain/interfaces/ManagementCore/IManagement.sol";
import {IAuthorizationTokenFactory} from "../base/Factory/interfaces/IAuthorizationTokenFactory.sol";
import {ISettlementTokenFactory} from "../base/Factory/interfaces/ISettlementTokenFactory.sol";

import {StringUtils} from "../infrastructure/utils/StringUtils.sol";

contract ManagementCore is Ownable, IManagementCore {
    /// Instances Transaction Tracker
    TransactionTracker public transactionTracker;
    /// instance de ManagementStorage
    ManagementStorage public managementStorage;

    /// @dev necessita deployar esses dois contratos manualmente e setar os endereços aqui
    address internal authorizationTokenFactoryAddress;
    address internal settlementTokenFactoryAddress;

    constructor() {
        transactionTracker = new TransactionTracker(address(this));
        managementStorage = new ManagementStorage();
    }

    function addParticipant(
        address participantWallet,
        string memory participantName
    ) external override {
        require(msg.sender == owner(), "The address is not Elo participant");

        managementStorage.setParticipantWalletMapping(
            participantWallet,
            participantName
        );

        IAuthorizationTokenFactory authContractFactory = IAuthorizationTokenFactory(
                authorizationTokenFactoryAddress
            );

        address authorizationContractAddress = authContractFactory
            .createAuthorizationToken(
                participantWallet,
                address(transactionTracker)
            );

        ISettlementTokenFactory settleContractFactory = ISettlementTokenFactory(
            settlementTokenFactoryAddress
        );

        address settlementContractAddress = settleContractFactory
            .createSettlementToken(
                participantWallet,
                address(transactionTracker),
                authorizationContractAddress
            );

        managementStorage.setParticipantWalletToAuthorizationToken(
            participantWallet,
            authorizationContractAddress
        );
        managementStorage.setParticipantWalletToSettlementToken(
            participantWallet,
            settlementContractAddress
        );
    }

    function setAuthorizationTokenFactoryAddress(
        address _authorizationTokenFactoryAddress
    ) external onlyOwner {
        authorizationTokenFactoryAddress = _authorizationTokenFactoryAddress;
    }

    function setSettlementTokenFactoryAddress(
        address _settlementTokenFactoryAddress
    ) external onlyOwner {
        settlementTokenFactoryAddress = _settlementTokenFactoryAddress;
    }

    function getTransactionInfo(
        uint256 nrid
    ) external view override returns (string memory) {
        return transactionTracker.getTransactionInfo(nrid);
    }

    function getTransactionsByParticipant(
        address participantWallet
    ) external view override returns (string[] memory) {
        return
            transactionTracker.getTransactionsByParticipant(participantWallet);
    }

    function getTransactionsByStatus(
        ITransactionTracker.TransactionStatus status
    ) external view override returns (string[] memory) {
        return transactionTracker.getTransactionsByStatus(status);
    }

    function getParticipantInfo(
        address participantAddress
    ) external view override returns (string memory) {
        return
            string(
                abi.encodePacked(
                    "{",
                    '"participant":"',
                    StringUtils.addressToString(participantAddress),
                    '",',
                    '"participantName":"',
                    managementStorage.getParticipantName(participantAddress),
                    '",',
                    '"authorizationAddress":"',
                    StringUtils.addressToString(
                        managementStorage
                            .getParticipantWalletToAuthorizationToken(
                                participantAddress
                            )
                    ),
                    '",',
                    '"settlementAddress":"',
                    StringUtils.addressToString(
                        managementStorage.getParticipantWalletToSettlementToken(
                            participantAddress
                        )
                    ),
                    '"',
                    "}"
                )
            );
    }
}
