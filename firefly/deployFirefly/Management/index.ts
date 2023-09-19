import axios, { AxiosResponse } from "axios";
import { ManagementCore__factory } from '../../../src/types/factories/contracts/application/ManagementCore__factory';

import {
    ContractDeployOperationResponseType,
    ContractDeployResponseType,
    GenerateContractInterfaceBodyType,
    GenerateContractInterfaceResponseType,
    BuildContractInterfaceBodyType,
    BuildContractInterfaceResponseType,
    GenerateContractAPIBodyType,
    GenerateContractAPIResponseType,
    GenerateContractEventListenerBodyType,
    GenerateContractEventListenerResponseType
} from "../types/firefly";



interface RecurringContractInterfaceParamsType {
    namespace: string,
    name: string,
    description: string,
    version: string,
}

interface RecurringContractEventListener {
    eventName: string,
    topic: string
}


const manegementByteCode = ManagementCore__factory.bytecode;
const managementABI = ManagementCore__factory.abi;

export class DeployManagementContract {
    host: string;
    host_port: string;

    contract_address: string = "";
    contract_interface_id: string = "";
    contract_api: GenerateContractAPIResponseType | null = null;

    contract_interfaceGeneraded: GenerateContractInterfaceResponseType | null = null;
    contract_interface_build: BuildContractInterfaceResponseType | null = null;

    constructor(host: string, port: string) {
        this.host = host;
        this.host_port = port;
    }



    async makeDeployRequest(): Promise<string> {
        const payload = {
            contract: manegementByteCode,
            definition: managementABI,
        };

        try {
            const url = `http://${this.host}:${this.host_port}/api/v1/namespaces/default/contracts/deploy`;
            const response = await axios.post<ContractDeployResponseType>(url, payload);
            const responseData = response.data;
            const contractTx = responseData.tx;

            if (contractTx) {
                console.log("Contrato Deployado com sucesso!");
            }

            return contractTx;
        } catch (error: any) {
            const errorMessage = error.response ? error.response.data : error.message;
            throw new Error(`Erro ao fazer a solicitação de deploy: ${JSON.stringify(errorMessage)}`);
        }
    }

    async makeSetAuthorizationFactory(managementInterfaceName: string, authorizationFactoryAddress: string): Promise<string | null> {

        const payloadAthorization = {
            input: {
                _authorizationTokenFactoryAddress: authorizationFactoryAddress
            }
        };


        try {
            const urlAuthorization = `http://${this.host}:${this.host_port}/api/v1/namespaces/default/apis/${managementInterfaceName}/invoke/setAuthorizationTokenFactoryAddress`;


            const responseAuthorizationSet = await axios.post<any>(urlAuthorization, payloadAthorization);

            const responseDataAuth = responseAuthorizationSet.data;


            const contractTxAuth = responseDataAuth.tx;


            if (contractTxAuth) {
                return "Contrato de Factory do autorização setado com sucesso!"
            }

            return null;
        } catch (error: any) {
            const errorMessage = error.response ? error.response.data : error.message;
            throw new Error(`Erro ao fazer a solicitação post para setar os contratos Authorization factory: ${JSON.stringify(errorMessage)}`);
        }

    }

    async makeSetSettlementFactory(managementInterfaceName: string, settlementFactoryAddress: string): Promise<string | null> {

        const payloadSettlement = {
            input: {
                _settlementTokenFactoryAddress: settlementFactoryAddress
            }
        }

        try {
            const urlSettlement = `http://${this.host}:${this.host_port}/api/v1/namespaces/default/apis/${managementInterfaceName}/invoke/setSettlementTokenFactoryAddress`;

            const responseSettlementSet = await axios.post<any>(urlSettlement, payloadSettlement);


            const responseDataSet = responseSettlementSet.data;


            const contractTxSet = responseDataSet.tx;

            if (contractTxSet) {
                return "Contrato de factory do liquidacao setado com sucesso!"
            }

            return null;
        } catch (error: any) {
            const errorMessage = error.response ? error.response.data : error.message;
            throw new Error(`Erro ao fazer a solicitação post para setar os contratos Settlement factory: ${JSON.stringify(errorMessage)}`);
        }

    }

    async makeGenerateContractInterfaceRequest(): Promise<GenerateContractInterfaceResponseType> {
        const payload: GenerateContractInterfaceBodyType = {
            input: {
                abi: managementABI,
            }
        }

        try {
            const url = `http://${this.host}:${this.host_port}/api/v1/namespaces/default/contracts/interfaces/generate`;
            const response = await axios.post<GenerateContractInterfaceResponseType>(url, payload);
            const responseData = response.data;

            if (responseData) {
                console.log("Interface do contrato gerada com sucesso!")
            }

            return this.contract_interfaceGeneraded = responseData;
        } catch (error: any) {
            const errorMessage = error.response ? error.response.data : error.message;
            throw new Error(`Erro ao fazer a solicitação de deploy: ${JSON.stringify(errorMessage)}`);
        }
    }

    async makeBuildContractInterfaceRequest(params: RecurringContractInterfaceParamsType): Promise<BuildContractInterfaceResponseType> {
        const { namespace, name, description, version } = params;

        if (!this.contract_interfaceGeneraded) {
            throw new Error("contract_interfaceGeneraded is not available. Please generate it first.");
        }
        const {
            methods,
            events,
            ...rest
        } = this.contract_interfaceGeneraded;

        const payload: BuildContractInterfaceBodyType = {
            ...rest,
            namespace: namespace,
            name: name,
            description: description,
            version: version,
            methods,
            events,
        };

        try {
            const url = `http://${this.host}:${this.host_port}/api/v1/namespaces/default/contracts/interfaces`;
            const response = await axios.post<BuildContractInterfaceResponseType>(url, payload);
            const responseData = response.data;

            if (responseData) {
                console.log("Interface do contrato emitida no broadcast com sucesso!");
            }

            this.contract_interface_id = responseData.id;


            return this.contract_interface_build = responseData;
        } catch (error: any) {
            const errorMessage = error.response ? error.response.data : error.message;
            throw new Error(`Erro ao criar a interface do contrato : ${JSON.stringify(errorMessage)}`);
        }
    }

    async makeGenerateContractAPIRequest(name: string): Promise<GenerateContractAPIResponseType> {
        if (!this.contract_address || !this.contract_interface_id) {
            throw new Error("contract_address and contract_interface_id are not available. Please generate them first.");
        }
        const payload: GenerateContractAPIBodyType = {
            name: name,
            interface: {
                id: this.contract_interface_id
            },
            location: {
                address: this.contract_address
            }
        }

        try {
            const url = `http://${this.host}:${this.host_port}/api/v1/namespaces/default/apis`;
            const response = await axios.post<GenerateContractAPIResponseType>(url, payload);
            const responseData = response.data;

            if (responseData) {
                console.log("API do contrato gerado com sucesso! ");
            }

            return this.contract_api = responseData;
        } catch (error: any) {
            const errorMessage = error.response ? error.response.data : error.message;
            throw new Error(`Erro ao gerar um endpoint de API para o contrato: ${JSON.stringify(errorMessage)}`);
        }
    }

    /**
   * Generates an event listener for the RealDigitalContract API.
   * @param {string} params.eventName - The name of the event.
   * @param {string} params.topic - The topic of the event.
   * @return {Promise<any>} A promise that resolves to the generated event listener.
   * @throws {Error} If the contract address or contract interface ID is not available.
   * @throws {Error} If there is an error generating the API endpoint for the contract.
   */
    async makeGenerateEventListener(params: RecurringContractEventListener): Promise<GenerateContractEventListenerResponseType> {

        const { eventName, topic } = params;

        if (!this.contract_address || !this.contract_interface_id) {
            throw new Error("contract_address and contract_interface_id are not available. Please generate them first.");
        }

        const payload: GenerateContractEventListenerBodyType = {
            interface: {
                id: this.contract_interface_id
            },
            location: {
                address: this.contract_address
            },
            eventPath: eventName,
            options: {
                firstEvent: "newest"
            },
            topic: topic
        }

        try {
            const url = `http://${this.host}:${this.host_port}/api/v1/namespaces/default/contracts/listeners`;
            const response = await axios.post<GenerateContractEventListenerResponseType>(url, payload);
            const responseData = response.data;

            if (responseData) {
                console.log(`Evento ${eventName} gerado com sucesso! `);
            }

            return responseData;
        } catch (error: any) {
            const errorMessage = error.response ? error.response.data : error.message;
            throw new Error(`Erro ao gerar um endpoint de API para o contrato: ${JSON.stringify(errorMessage)}`);
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