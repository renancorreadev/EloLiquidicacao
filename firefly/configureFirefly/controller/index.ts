import { ConfigureAuthorizationToken } from "../tokens/AuthorizationToken";
import { ConfigureSettlementToken } from "../tokens/SettlementToken";


export async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function initializeAuthorizationContract(
    hostNode: string,
    hostPort: string,
    contractInterfaceName: string,
    participantAuthorizationAddress: string

): Promise<string | undefined> {
    const deployAuthorizationContract = new ConfigureAuthorizationToken(hostNode, hostPort, participantAuthorizationAddress);

    try {
        await sleep(4000);
        await deployAuthorizationContract.makeGenerateContractInterfaceRequest();

        await sleep(4000);
        await deployAuthorizationContract.makeBuildContractInterfaceRequest({
            namespace: "default",
            name: contractInterfaceName,
            description: `Contrato de ${contractInterfaceName}`,
            version: "1.0",
        });

        await sleep(4000);
        await deployAuthorizationContract.makeGenerateContractAPIRequest(contractInterfaceName);

        /// Listeners
        await sleep(4000);
        const idListenerAuthorizationTokenBurned = await deployAuthorizationContract.makeGenerateEventListener({
            eventName: "AuthorityTokenBurned",
            topic: "authority-token-burned",
        });

        await sleep(4000);
        const idListenerAuthorizationTokenMinted = await deployAuthorizationContract.makeGenerateEventListener({
            eventName: "AuthorityTokenMinted",
            topic: "authority-token-minted",
        });

        /// Subscriptions
        await sleep(4000);
        await deployAuthorizationContract.makeGenerateEventSubscription({
            topic: idListenerAuthorizationTokenBurned.topic!,
            listenerID: idListenerAuthorizationTokenBurned.id,
        });

        await sleep(4000);
        await deployAuthorizationContract.makeGenerateEventSubscription({
            topic: idListenerAuthorizationTokenMinted.topic,
            listenerID: idListenerAuthorizationTokenMinted.id,
        });



        return "\n\nForam gerados: interface, api, eventos e subscriptions do contrato no node do contrato de autorizacao do participante";
    } catch (error: any) {
        console.error("Error:", error.message);
    }
}

export async function initializeSettlementContract(
    hostNode: string,
    hostPort: string,
    contractInterfaceName: string,
    participantSettlementContractAddress: string
): Promise<string | undefined> {
    const deploySettlement = new ConfigureSettlementToken(hostNode, hostPort, participantSettlementContractAddress);

    try {
        await sleep(4000);
        await deploySettlement.makeGenerateContractInterfaceRequest();

        await sleep(4000);
        await deploySettlement.makeBuildContractInterfaceRequest({
            namespace: "default",
            name: contractInterfaceName,
            description: `Contrato de ${contractInterfaceName}`,
            version: "1.0",
        });

        await sleep(4000);
        await deploySettlement.makeGenerateContractAPIRequest(contractInterfaceName);

        /// Listeners
        await sleep(4000);
        const idListenerAuthorizationStatusUpdated = await deploySettlement.makeGenerateEventListener({
            eventName: "AuthorizationStatusUpdated",
            topic: "settlement-authorization-status",
        });

        await sleep(4000);
        const idListenerSettlementTokenBurned = await deploySettlement.makeGenerateEventListener({
            eventName: "SettlementTokenBurned",
            topic: "settlement-token-burned",
        });

        await sleep(4000);
        const idListenerSettlementTokenMinted = await deploySettlement.makeGenerateEventListener({
            eventName: "SettlementTokenMinted",
            topic: "settlement-token-minted",
        });

        /// Subscriptions
        await sleep(4000);
        await deploySettlement.makeGenerateEventSubscription({
            topic: idListenerAuthorizationStatusUpdated.topic,
            listenerID: idListenerAuthorizationStatusUpdated.id,
        });

        await sleep(4000);
        await deploySettlement.makeGenerateEventSubscription({
            topic: idListenerSettlementTokenBurned.topic,
            listenerID: idListenerSettlementTokenBurned.id,
        });

        await sleep(4000);
        await deploySettlement.makeGenerateEventSubscription({
            topic: idListenerSettlementTokenMinted.topic,
            listenerID: idListenerSettlementTokenMinted.id,
        });


        return "\n\nForam gerados: interface, api, eventos e subscriptions do contrato no node do contrato de autorizacao do participante";
    } catch (error: any) {
        console.error("Error:", error.message);
    }
}



