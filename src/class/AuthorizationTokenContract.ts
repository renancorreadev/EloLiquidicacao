import { Wallet, JsonRpcProvider, BigNumberish } from 'ethers';
import {
    AuthorizationToken__factory,
    AuthorizationToken, 
} from "../@types";

import { AuthorityTokenBurnedEvent, AuthorityTokenMintedEvent } from "../@types/contracts/AuthorizationToken";


interface MintParams {
    nrid: BigNumberish,
    pan: BigNumberish,
    mcc: BigNumberish,
    productBin: BigNumberish,
    saleValue: BigNumberish
}


export class AuthorizationTokenSmartContractHelper {
    private provider: JsonRpcProvider;
    private wallet: Wallet;
    public contractAddress: string;
    private contract: AuthorizationToken;


    constructor(provider: JsonRpcProvider, wallet: Wallet) {
        this.provider = provider;
        this.wallet = wallet;
        this.contractAddress = "";
        this.contract = AuthorizationToken__factory.connect(this.contractAddress, this.provider);
    }


    async mintAuthorizationToken(mintParams: MintParams) {
        this.contract.connect(this.wallet);

        const { nrid, pan, mcc, productBin, saleValue } = mintParams;


        const tx = await this.contract.mintAuthorizationToken(nrid, pan, mcc, productBin, saleValue);

        const receipt = await tx.wait();

        return receipt;
    }

    async getAuthorizationBurnedEvent(): Promise<AuthorityTokenBurnedEvent.OutputObject[]> {
        const filter = this.contract.filters.AuthorityTokenBurned();
    
        const events = await this.contract.queryFilter(filter);
    
        // Mapeie os eventos para o tipo AuthorityTokenBurnedEvent.OutputObject
        const authorizationBurnedEvents: AuthorityTokenBurnedEvent.OutputObject[] = events.map((event) => ({
            nrid: event.args.nrid,
            date: event.args.date,
            participantType: event.args.participantType,
            participant: event.args.participant,
        }));
    
        return authorizationBurnedEvents;
    }

    async getAuthorizationTokenMintedEvent(): Promise<AuthorityTokenMintedEvent.OutputObject[]> {
        const filter = this.contract.filters.AuthorityTokenMinted();
    
        const events = await this.contract.queryFilter(filter);

        const authorizationTokenMintedEvents: AuthorityTokenMintedEvent.OutputObject[] = events.map((event) => ({
            nrid: event.args.nrid,
            date: event.args.date,
            participantType: event.args.participantType,
            participant: event.args.participant,
        }));
    
        return authorizationTokenMintedEvents;
    }
}

