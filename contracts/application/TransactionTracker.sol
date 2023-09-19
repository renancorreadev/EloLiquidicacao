// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import {ManagementCore} from "../application/ManagementCore.sol";

/// @dev importacao das interfaces de implementacao de cada tipo de rastreamento
import {ITransactionTracker} from "../domain/interfaces/ITransactionTracker.sol";
import {IAuthorizationTracker} from "../domain/interfaces/Authorization/IAuthorizationTracker.sol";
import {ISettlementTracker} from "../domain/interfaces/Settlement/ISettlementTracker.sol";

/// @dev importacao de utils
import {StringUtils} from "../infrastructure/utils/StringUtils.sol";

contract TransactionTracker is
    ITransactionTracker,
    IAuthorizationTracker,
    ISettlementTracker
{
    /// @dev mapping para registrar todas transacoes criadas de Authorizacao, Liquidacao e Pagamento ERC20
    mapping(uint256 => Transaction) public transactionsMapping;

    /// @dev mapping para registrar a metadata imutavel de Autorizacao
    mapping(uint256 => AuthorizationTracker) public authorizationTrackerMapping;
    /// @dev mapping para registrar a metadata imutavel de Liquidacao
    mapping(uint256 => SettlementTracker) public settlementTrackerMapping;

    /// @dev mapping para registrar transacoes por status para facilitar a busca filtrada
    mapping(TransactionStatus => uint256[]) private transactionsByStatus;
    /// @dev mapping para registrar transacoes por participante colocando o address parqa facilitar a busca filtrada
    mapping(address => uint256[]) private transactionsByParticipant;

    /// @dev array para registrar os nrids de transacoes
    uint256[] internal nridsRegistered;

    ManagementCore internal managementCoreInstance;

    constructor(address managementAddress) {
        managementCoreInstance = ManagementCore(managementAddress);
    }

    /// --------------------------  CREATE SETTERS (REGISTERS TRANSACT)  ----------------------------
    /// -----------------------|     FUNCOES DE REGISTRO DE TRANSACOES       |-----------------------
    /// ---------------------------------------------------------------------------------------------

    /// @dev Função para registrar uma nova transação
    function registerTransaction(
        uint256 nrid,
        address participantWallet,
        uint256 pan,
        uint256 mcc,
        uint256 authorizedAt,
        uint256 productBin,
        uint256 saleValue,
        TransactionStatus status,
        ParticipantType participantType
    ) external {
        require(!_exists(nrid), "NRID already used");

        Transaction memory newTransaction = Transaction(
            nrid,
            participantWallet,
            pan,
            mcc,
            authorizedAt,
            0, // SettledAt inicialmente é 0
            0, // PaymentGeneratedAt inicialmente é 0
            productBin,
            saleValue,
            status,
            participantType
        );

        transactionsMapping[nrid] = newTransaction;

        nridsRegistered.push(nrid);

        transactionsByStatus[status].push(nrid);
        transactionsByParticipant[participantWallet].push(nrid);
    }

    /// @dev registra fluxo de rastreio da authorizacao
    function registerAuthorizationTracker(
        uint256 nrid,
        address participantWallet,
        uint pan,
        uint mcc,
        uint productBin,
        uint256 saleValue
    ) external {
        authorizationTrackerMapping[nrid] = AuthorizationTracker(
            participantWallet,
            "Credenciador",
            pan,
            mcc,
            block.timestamp,
            productBin,
            saleValue,
            AuthorizationStatus.minted
        );

        initializeSettlementStatus(nrid);
    }

    /// @dev registra fluxo de rastreio de liquidacao
    function registerSettlementToken(
        uint256 nrid,
        address participantWallet
    ) external {
        /// @dev Cria o registro Metadata para o nrid e apresentar na response final (getTransactionInfo)
        settlementTrackerMapping[nrid] = SettlementTracker(
            participantWallet,
            "Credenciador",
            "Ok",
            "200",
            block.timestamp,
            SettlementStatus.minted
        );

        /// @dev Atualiza os status da transacao pelo nrid
        updateSettlementStatus(
            nrid,
            ITransactionTracker.TransactionStatus.Settled,
            block.timestamp
        );
        updateAuthorizationStatus(nrid, AuthorizationStatus.burned);
    }

    /// --------------------------------- SETTERS (WRITES TRANSACT) ---------------------------------
    /// -----------------------|     FUNCOES DE ATUALIZACAO DE STATUS        |-----------------------
    /// ---------------------------------------------------------------------------------------------
    function initializeSettlementStatus(uint nrid) internal {
        require(_exists(nrid), "Transaction does not exist");

        SettlementTracker storage settlementTracker = settlementTrackerMapping[
            nrid
        ];

        /// @dev inicializa o status como waiting
        settlementTracker.status = ISettlementTracker.SettlementStatus.waiting;
    }

    function updateSettlementStatus(
        uint256 nrid,
        TransactionStatus newStatus,
        uint256 newSettledAt
    ) internal {
        require(_exists(nrid), "Transaction does not exist");

        Transaction storage transaction = transactionsMapping[nrid];

        require(
            transaction.settledAt == 0,
            "Transaction has already been settled"
        );

        transaction.status = newStatus;
        transaction.settledAt = newSettledAt;
    }

    function updateAuthorizationStatus(
        uint256 nrid,
        AuthorizationStatus newStatus
    ) internal {
        require(_exists(nrid), "Transaction does not exist");

        AuthorizationTracker
            storage authorization = authorizationTrackerMapping[nrid];

        // Verifique se a autorização não foi queimada antes
        require(
            authorization.status != AuthorizationStatus.burned,
            "Authorization has already been burned"
        );

        // Atualize o status de autorização
        authorization.status = newStatus;
    }

    /// --------------------------------- GETTERS (READS TRANSACT) ----------------------------------
    /// -----------------------|   IMPLEMENTACAO DAS INTERFACES ABSTRATAS    |-----------------------
    /// ---------------------------------------------------------------------------------------------

    /// @dev função para obter transações por status
    function getTransactionsByStatus(
        TransactionStatus status
    ) public view override returns (string[] memory) {
        uint256[] memory nrids = transactionsByStatus[status];

        string[] memory result = new string[](nrids.length);

        for (uint256 i = 0; i < nrids.length; i++) {
            result[i] = getTransactionInfo(nrids[i]);
        }

        return result;
    }

    /// @dev função para obter transações por participante
    function getTransactionsByParticipant(
        address participantWallet
    ) public view override returns (string[] memory) {
        uint256[] memory nrids = transactionsByParticipant[participantWallet];

        string[] memory result = new string[](nrids.length);

        for (uint256 i = 0; i < nrids.length; i++) {
            result[i] = getTransactionInfo(nrids[i]);
        }

        return result;
    }

    /// @dev essa e uma das funcoes principais que retornara a response final
    function getTransactionInfo(
        uint256 nrid
    ) public view override returns (string memory) {
        Transaction memory transaction = transactionsMapping[nrid];

        string memory authorizationInfo = getAuthorizationInfo(nrid);
        string memory settlementInfo = "";

        // Verifique se o token de settlement foi mintado (ou seja, o status é "minted")
        if (settlementTrackerMapping[nrid].status == SettlementStatus.minted) {
            settlementInfo = getSettlementInfo(nrid);
        } else {
            settlementInfo = '{"status":"waiting"}'; // Objeto JSON com status "waiting"
        }

        string memory json = string(
            abi.encodePacked(
                "{",
                '"nrid":',
                StringUtils.uintToString(transaction.nrid),
                ",",
                '"currentStatus":"',
                StringUtils.transactionStatusToString(transaction.status),
                '",',
                '"authorization":',
                authorizationInfo,
                ",",
                '"settlement":',
                settlementInfo,
                "}"
            )
        );

        return json;
    }

    /// @dev implementação da interface IAuthorizationTracker
    function getAuthorizationInfo(
        uint256 nrid
    ) public view override returns (string memory) {
        AuthorizationTracker
            memory authorizationTracker = authorizationTrackerMapping[nrid];

        string memory json = string(
            abi.encodePacked(
                "{",
                '"participantWallet":"',
                StringUtils.addressToString(
                    authorizationTracker.participantWallet
                ),
                '",',
                '"participantType":"',
                authorizationTracker.participantType,
                '",',
                '"pan":"',
                StringUtils.uintToString(authorizationTracker.pan),
                '",',
                '"mcc":"', // Coloque as aspas duplas aqui
                StringUtils.uintToString(authorizationTracker.mcc),
                '",',
                '"authorizedAt":',
                StringUtils.uintToString(authorizationTracker.authorizedAt),
                ",",
                '"productBin":',
                StringUtils.uintToString(authorizationTracker.productBin),
                ",",
                '"saleValue":',
                StringUtils.uintToString(authorizationTracker.saleValue),
                ",",
                '"status":"',
                StringUtils.authorizatioStatusToString(
                    authorizationTracker.status
                ),
                '"',
                "}"
            )
        );

        return json;
    }

    /// @dev essa função retornara a response final
    function getSettlementInfo(
        uint nrid
    ) public view override returns (string memory) {
        SettlementTracker memory settlementTracker = settlementTrackerMapping[
            nrid
        ];

        string memory json = string(
            abi.encodePacked(
                "{",
                '"participantWallet":"',
                StringUtils.addressToString(
                    settlementTracker.participantWallet
                ),
                '",',
                '"participantType":"',
                settlementTracker.participantType,
                '",',
                '"msgResponse":"',
                settlementTracker.msgResponse,
                '",',
                '"codeResponse":"',
                settlementTracker.codeResponse,
                '",',
                '"settledAt":',
                StringUtils.uintToString(settlementTracker.settledAt),
                ",",
                '"status":"',
                StringUtils.settlementStatusToString(settlementTracker.status),
                '"',
                "}"
            )
        );

        return json;
    }

    /// utils
    function _exists(uint256 nrid) private view returns (bool) {
        return transactionsMapping[nrid].nrid != 0;
    }
}
