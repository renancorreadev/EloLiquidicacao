import axios from "axios";


export async function makeCreateParticipant(
    host: string,
    host_port: string,
    managementInterfaceName: string,
    participantTypeInput: string,
    participantWalletInput: string
): Promise<string | null> {

    const payload = {
        input: {
            participantType: participantTypeInput,
            participantWallet: participantWalletInput
        }
    }

    try {
        const url = `http://${host}:${host_port}/api/v1/namespaces/default/apis/${managementInterfaceName}/invoke/addParticipant`;

        const response = await axios.post<any>(url, payload);


        const responseData = response.data;


        const contractTxSet = responseData.tx;

        if (contractTxSet) {
            return "Participante criado com sucesso!"
        }

        return null;
    } catch (error: any) {
        const errorMessage = error.response ? error.response.data : error.message;
        throw new Error(`Erro ao fazer a solicitação post para executar invoke addParticipant: ${JSON.stringify(errorMessage)}`);
    }

}

interface ParticipantInfo {
    participant: string;
    participantType: string;
    authorizationAddress: string;
    settlementAddress: string;
}

export async function getParticipantInfo(
    host: string,
    host_port: string,
    managementInterfaceName: string,
    participantAddressInput: string
): Promise<ParticipantInfo | null> {
    const payload = {
        input: {
            participantAddress: participantAddressInput
        }
    }

    try {
        const url = `http://${host}:${host_port}/api/v1/namespaces/default/apis/${managementInterfaceName}/query/getParticipantInfo`;

        const response = await axios.post<any>(url, payload);
        const responseData = response.data;

        if (responseData && responseData.output) {
            // Parse the output string to a JSON object
            const formattedOutput: ParticipantInfo = JSON.parse(responseData.output);
            return formattedOutput;
        }

        return null;
    } catch (error: any) {
        const errorMessage = error.response ? error.response.data : error.message;
        throw new Error(`Erro ao fazer a solicitação post para executar getParticipantInfo: ${JSON.stringify(errorMessage)}`);
    }
}
