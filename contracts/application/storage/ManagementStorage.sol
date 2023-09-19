// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

contract ManagementStorage {
    address[] internal authorizationTokenContracts;
    // Mapeamento de endereço do participante para seu tipo (por exemplo, "ELO", "Credenciador")
    mapping(address => string) internal participantWalletMapping;

    // Mapeamento para rastrear as instâncias dos contratos AuthorizationToken e SettlementToken para cada participante
    mapping(address => address) internal participantWalletToAuthorizationToken;
    mapping(address => address) internal participantWalletToSettlementToken;

    constructor() {
        participantWalletMapping[msg.sender] = "ELO";
    }

    /// ----------------------------------------------------------------------------------------------------------------
    /// -----------------------------------------------------------| SETTERS  |  ----------------------------------------
    function setParticipantWalletMapping(
        address participantWallet,
        string memory participantName
    ) external {
        participantWalletMapping[participantWallet] = participantName;
    }

    function setParticipantWalletToAuthorizationToken(
        address participantWallet,
        address authorizationTokenAddress
    ) external {
        participantWalletToAuthorizationToken[
            participantWallet
        ] = authorizationTokenAddress;
    }

    function setParticipantWalletToSettlementToken(
        address participantWallet,
        address settlementTokenAddress
    ) external {
        participantWalletToSettlementToken[
            participantWallet
        ] = settlementTokenAddress;
    }

    /// ----------------------------------------------------------------------------------------------------------------
    /// -----------------------------------------------------------| GETTERS |  ----------------------------------------
    function getAuthorizationTokenContracts()
        external
        view
        returns (address[] memory)
    {
        return authorizationTokenContracts;
    }

    function getParticipantName(
        address participantWallet
    ) external view returns (string memory) {
        return participantWalletMapping[participantWallet];
    }

    function getParticipantWalletToAuthorizationToken(
        address participantWallet
    ) external view returns (address authorizationTokenAddress) {
        return participantWalletToAuthorizationToken[participantWallet];
    }

    function getParticipantWalletToSettlementToken(
        address participantWallet
    ) external view returns (address settlementTokenAddress) {
        return participantWalletToSettlementToken[participantWallet];
    }
}
