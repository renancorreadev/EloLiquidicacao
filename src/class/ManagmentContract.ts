
import { ContractTransactionReceipt, ethers, JsonRpcProvider, Overrides } from 'ethers';
import { Management, Management__factory } from "../../src/types";


type AddParticipantParamsType = {
    participantWallet: string,
    participantType: string,
    overrides?: Overrides & { from?: string }
}


export class ManagementContract {
    private contract: Management;
    private provider: JsonRpcProvider;
    private wallet: ethers.Wallet;

    constructor(providerUrl: string, contractAddress: string, privateKey: string) {
        this.provider = new JsonRpcProvider(providerUrl);
        this.contract = Management__factory.connect(contractAddress, this.provider);


        this.wallet = new ethers.Wallet(privateKey, this.provider);
        this.contract = this.contract.connect(this.wallet);
    }

    // Setters 
    public async addParticipant(params: AddParticipantParamsType): Promise<ContractTransactionReceipt> {
        try {
            const {
                participantWallet,
                participantType,
            } = params;


            const transaction = await this.contract.addParticipant(
                participantWallet,
                participantType, {
                gasLimit: 0,
                gasPrice: 300000
            });

            const receipt = await transaction.wait();

            return receipt!;
        } catch (error) {
            throw new Error(`Error executing addParticipant() of contract: ${error}`);
        }
    }

    // Getters
    async getTransactionByStatus(status: string): Promise<string[]> {
        try {
            const rawTransactions = await this.contract.getTransactionByStatus(status);

            const transactions = rawTransactions.map((rawTransaction: any) => JSON.parse(rawTransaction));

            return transactions;
        } catch (error) {
            throw new Error(`Erro ao executar getDonationReceiver(): ${error}`);
        }
    }

    async getTransactionInfo(nrid: number): Promise<string> {
        try {
            const rawTransaction = await this.contract.getTransactionInfo(nrid);

            const transaction = JSON.parse(rawTransaction)

            return transaction;
        } catch (error) {
            throw new Error(`Erro ao executar getTransactionInfo(): ${error}`);
        }
    }

    async getTransactionsByParticipant(participantAddress: string): Promise<string[]> {
        try {
            const rawTransactions = await this.contract.getTransactionsByParticipant(participantAddress);

            const transactions = rawTransactions.map((rawTransaction: any) => JSON.parse(rawTransaction));

            return transactions;
        } catch (error) {
            throw new Error(`Erro ao executar getTransactionsByParticipant(): ${error}`);
        }
    }
}