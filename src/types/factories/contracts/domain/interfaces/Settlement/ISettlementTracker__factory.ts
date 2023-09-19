/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Interface, type ContractRunner } from "ethers";
import type {
  ISettlementTracker,
  ISettlementTrackerInterface,
} from "../../../../../contracts/domain/interfaces/Settlement/ISettlementTracker";

const _abi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "nrid",
        type: "uint256",
      },
    ],
    name: "getSettlementInfo",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

export class ISettlementTracker__factory {
  static readonly abi = _abi;
  static createInterface(): ISettlementTrackerInterface {
    return new Interface(_abi) as ISettlementTrackerInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): ISettlementTracker {
    return new Contract(address, _abi, runner) as unknown as ISettlementTracker;
  }
}
