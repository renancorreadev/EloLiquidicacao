// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.6;

import {TokenBase} from "./TokenBase.sol";
import {AuthorizationToken} from "../base/AuthorizationToken.sol";
/// @dev importacao de utils
import {StringUtils} from "../infrastructure/utils/StringUtils.sol";
/// @dev importacao de interfaces
import {ISettlementToken} from "../domain/interfaces/Settlement/ISettlementToken.sol";

/// @dev owner desse contrato sempre vai ser para o endereco do participante registrado
contract SettlementToken is TokenBase, ISettlementToken {
    AuthorizationToken internal authorizationToken;

    constructor(
        address _transactionTrackerAddress,
        address _authorizationTokenAddress,
        address _participantAddress
    ) 
    TokenBase("SettlementToken", "SETTLE",_transactionTrackerAddress,  _participantAddress) {
        authorizationToken = AuthorizationToken(_authorizationTokenAddress);
    }

    /// @dev Essa função cria uma transação no contrato de TransactionTracker
    function mintSettlementToken(uint256 nrid) external override  {
        require(!_exists(nrid), "NRID already used");
        /// @dev queima o token de autorizacao da wallet do participant que sera o mesmo owner
        authorizationToken.burn(nrid);
        /// @dev update status de autorizado para liquidado e cria registro na blockchain
        transactionTracker.registerSettlementToken(nrid, owner);

        _mint(owner, nrid);

        /// @dev emite um evento para comunicar que foi mintado um token de Liquidacao
        emit SettlementTokenMinted(nrid, block.timestamp, "Credenciador");

        /// @dev emite um evento para registrar a atualização do status de autorização
        emit AuthorizationStatusUpdated(nrid, block.timestamp, "minted", true);
    }

    function burn(uint256 nrid) external onlyAuthorized {
        _burn(nrid);
        emit SettlementTokenBurned(nrid, block.timestamp);
    }
}
