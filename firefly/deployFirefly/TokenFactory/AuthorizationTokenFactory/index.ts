import axios, { AxiosResponse } from "axios";

import { AuthorizationTokenFactory__factory } from '../../../../src/types/factories/contracts/base/Factory/AuthorizationTokenFactory__factory';

import {
    ContractDeployOperationResponseType,
    ContractDeployResponseType,
} from "../../types/firefly";


const contractByteCode = AuthorizationTokenFactory__factory.bytecode;
const contractABI = AuthorizationTokenFactory__factory.abi;

export class DeployAuthorizationTokenFactory {
    host: string;
    host_port: string;

    contract_address: string = "";
    contract_interface_id: string = "";

    constructor(host: string, port: string) {
        this.host = host;
        this.host_port = port;
    }

    async makeDeployRequest(): Promise<string> {
        const payload = {
            contract: contractByteCode,
            definition: contractABI,
            inputs: [],
        };

        try {
            const url = `http://${this.host}:${this.host_port}/api/v1/namespaces/default/contracts/deploy`;
            const response = await axios.post<ContractDeployResponseType>(url, payload);
            const responseData = response.data;
            const contractTx = responseData.tx;

            if (contractTx) {
                console.log("Contrato AuthorizationTokenFactory - Deployado com sucesso!");
            }

            return contractTx;
        } catch (error: any) {
            const errorMessage = error.response ? error.response.data : error.message;
            throw new Error(`Erro ao fazer a solicitação de deploy AuthorizationTokenFactory: ${JSON.stringify(errorMessage)}`);
        }
    }


    async getContractAddress(tx: string): Promise<string> {
        const url = `http://${this.host}:${this.host_port}/api/v1/transactions/${tx}/operations`;

        try {
            const response: AxiosResponse<ContractDeployOperationResponseType[]> = await axios.get<any>(url);
            const responseData = response.data;

            if (!responseData[0]?.output?.contractLocation?.address) {
                throw new Error("Endereço do contrato não encontrado na resposta da API.");
            }

            const contractAddress = responseData[0].output.contractLocation.address;

            return this.contract_address = contractAddress;
        } catch (error: any) {
            const errorMessage = error.response ? error.response.data : error.message;
            throw new Error(`Erro ao obter o endereço do contrato: ${JSON.stringify(errorMessage)}`);
        }
    }
}