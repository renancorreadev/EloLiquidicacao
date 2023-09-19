import axios, { AxiosResponse } from "axios";
import {
    SettlementToken__factory
} from "../../../../src/types";

import {
    ContractDeployOperationResponseType,
    GenerateContractInterfaceBodyType,
    GenerateContractInterfaceResponseType,
    BuildContractInterfaceBodyType,
    BuildContractInterfaceResponseType,
    GenerateContractAPIBodyType,
    GenerateContractAPIResponseType,
    GenerateContractEventListenerBodyType,
    GenerateContractEventListenerResponseType,
    EventSubscriptionParams,
    GenerateContractEventSubscriptionResponseType,
    GenerateContractEventSubscriptionBodyType
} from "../../types/firefly";


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


const SettlementTokenABI = SettlementToken__factory.abi;

export class ConfigureSettlementToken {
    host: string;
    host_port: string;


    private participantSettlementAddress: string = "";

    contract_address: string = "";
    contract_interface_id: string = "";
    contract_api: GenerateContractAPIResponseType | null = null;

    contract_interfaceGeneraded: GenerateContractInterfaceResponseType | null = null;
    contract_interface_build: BuildContractInterfaceResponseType | null = null;

    constructor(host: string, port: string, participantSettlementAddress: string) {
        this.host = host;
        this.host_port = port;
        this.participantSettlementAddress = participantSettlementAddress
    }

    async makeGenerateContractInterfaceRequest(): Promise<GenerateContractInterfaceResponseType> {
        const payload: GenerateContractInterfaceBodyType = {
            input: {
                abi: SettlementTokenABI,
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
        if (!this.contract_interface_id) {
            throw new Error("contract_interface_id are not available. Please generate them first.");
        }
        const payload: GenerateContractAPIBodyType = {
            name: name,
            interface: {
                id: this.contract_interface_id
            },
            location: {
                address: this.participantSettlementAddress
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

        if (!this.contract_interface_id) {
            throw new Error("contract_interface_id are not available. Please generate them first.");
        }

        const payload: GenerateContractEventListenerBodyType = {
            interface: {
                id: this.contract_interface_id
            },
            location: {
                address: this.participantSettlementAddress
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


    async makeGenerateEventSubscription(params: EventSubscriptionParams): Promise<GenerateContractEventSubscriptionResponseType> {

        const { topic, listenerID } = params;


        if (!this.contract_interface_id) {
            throw new Error("contract_interface_id are not available. Please generate them first.");
        }


        const payload: GenerateContractEventSubscriptionBodyType = {
            namespace: "default",
            name: topic,
            transport: "websockets",
            filter: {
                events: "blockchain_event_received",
                blockchainevent: {
                    listener: listenerID
                },
            },
            options: {
                firstEvent: "oldest"
            }
        }

        try {
            const url = `http://${this.host}:${this.host_port}/api/v1/namespaces/default/subscriptions`;
            const response = await axios.post<GenerateContractEventSubscriptionResponseType>(url, payload);
            const responseData = response.data;

            if (responseData) {
                console.log(`Event Subscribe ${topic} subscripted com sucesso! `);
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