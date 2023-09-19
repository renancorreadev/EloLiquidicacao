import { BigNumberish, ContractReceipt, ethers, Overrides } from 'ethers';
import { SettlementToken, SettlementToken__factory } from "../@types";

type MintAuthorizationTokenParams = {
    participantWallet: string;
    product: string;
    productValue: BigNumberish;
    overrides?: Overrides;
}

export class AuthorizationTokenContract {
    private contract: SettlementToken;
    private provider: ethers.providers.JsonRpcProvider;
    private wallet: ethers.Wallet;

    constructor(providerUrl: string, contractAddress: string, privateKey: string) {
        this.provider = new ethers.providers.JsonRpcProvider(providerUrl);
        this.contract = SettlementToken__factory.connect(contractAddress, this.provider);


        this.wallet = new ethers.Wallet(privateKey, this.provider);
        this.contract = this.contract.connect(this.wallet);
    }

    // public async mintAuthorizationToken(params: MintAuthorizationTokenParams): Promise<ContractReceipt> {
    //     try {
    //         const { participantWallet, product, productValue, overrides } = params;

    //         const transaction = await this.contract.mintAuthorizationToken(
    //             participantWallet, // Suponho que seja o endereço do destinatário
    //             product,
    //             productValue,
    //             {
    //                 gasLimit: 0,  // Defina o limite de gás apropriado
    //                 gasPrice: 300000,  // Defina o preço do gás apropriado
    //                 ...overrides,  // Quaisquer substituições adicionais especificadas nos parâmetros
    //             }
    //         );

    //         const receipt = await transaction.wait();

    //         return receipt;
    //     } catch (error) {
    //         throw new Error(`Error executing mintAuthorizationToken() of contract: ${error}`);
    //     }
    // }

}
