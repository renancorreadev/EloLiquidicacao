// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.6;

import {ERC721A} from "erc721a/contracts/ERC721A.sol";
import {TransactionTracker} from "../application/TransactionTracker.sol";
import {ITokenBase} from "../domain/interfaces/TokenBase/ITokenBase.sol";

contract TokenBase is ERC721A, ITokenBase {
    address public owner;
    TransactionTracker public transactionTracker;
    uint[] internal nrids;

    constructor(
        string memory _name,
        string memory _symbol,
        address _transactionTrackerAddress,
        address _participantAddress
    ) ERC721A(_name, _symbol) {
        transactionTracker = TransactionTracker(_transactionTrackerAddress);
        owner = _participantAddress;
    }

    modifier onlyAuthorized() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    function getAllNridsGeneratedByThisContract()
        external
        view
        override
        returns (uint[] memory)
    {
        return nrids;
    }

    function tokenURI(
        uint256 nridToken
    ) public view virtual override returns (string memory) {
        require(_exists(nridToken), "Token does not exist");

        string memory authorizationInfo = transactionTracker
            .getAuthorizationInfo(nridToken);

        return authorizationInfo;
    }
}
