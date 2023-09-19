// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;
import {TokenBase} from "./TokenBase.sol";

import {TransactionTracker} from "../application/TransactionTracker.sol";
import {StringUtils} from "../infrastructure/utils/StringUtils.sol";

/// @dev interfaces imports from domain
import {IAuthorizationTracker} from "../domain/interfaces/Authorization/IAuthorizationTracker.sol";
import {IAuthorizationToken} from "../domain/interfaces/Authorization/IAuthorizationToken.sol";
import {ITransactionTracker} from "../domain/interfaces/ITransactionTracker.sol";

contract AuthorizationToken is TokenBase, IAuthorizationToken {

    constructor(address _transactionTrackerAddress, address participantAddress)
        TokenBase("AuthorizationToken", "AUTH", _transactionTrackerAddress, participantAddress)
    {}

    /// @dev Essa função cria uma transação no contrato de TransactionTracker
    function mintAuthorizationToken(
        uint256 nrid,
        uint256 pan,
        uint256 mcc,
        uint256 productBin,
        uint256 saleValue
    ) external override onlyAuthorized{
        require(!_exists(nrid), "NRID already used");

        //@dev Crie a transação no contrato TransactionTracker
        transactionTracker.registerTransaction(
            nrid,
            owner,
            pan,
            mcc,
            block.timestamp,
            productBin,
            saleValue,
            ITransactionTracker.TransactionStatus.Authorized,
            ITransactionTracker.ParticipantType.Credenciador
        );
        //@dev registra a estrutura de Autorizacao IMUTAVEL
        transactionTracker.registerAuthorizationTracker(
            nrid,
            owner,
            pan,
            mcc,
            productBin,
            saleValue
        );

        _mint(owner, nrid);

        emit AuthorityTokenMinted(
            nrid,
            block.timestamp,
            StringUtils.authorizatioStatusToString(
                IAuthorizationTracker.AuthorizationStatus.minted
            ),
            owner
        );
    }

    function burn(uint256 nrid) external {
        _burn(nrid);
        emit AuthorityTokenBurned(
            nrid,
            block.timestamp,
            StringUtils.authorizatioStatusToString(
                IAuthorizationTracker.AuthorizationStatus.minted
            ),
            owner
        );
    }
}
