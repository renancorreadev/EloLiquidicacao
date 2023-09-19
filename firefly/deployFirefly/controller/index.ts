import { DeployManagementContract } from "../Management";
import { DeployAuthorizationTokenFactory } from "../TokenFactory/AuthorizationTokenFactory";
import { DeploySettlementTokenFactory } from "../TokenFactory/SettlementTokenFactory";

export async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function deployAuthorizationTokenFactory(
    hostNode: string,
    hostPort: string,
): Promise<string | undefined> {
    const deployAuthorizationTokenFactory = new DeployAuthorizationTokenFactory(hostNode, hostPort);

    try {
        const deployTxId = await deployAuthorizationTokenFactory.makeDeployRequest();
        console.log("deploy id: ", deployTxId);

        await sleep(4000);
        await deployAuthorizationTokenFactory.getContractAddress(deployTxId);

        await sleep(4000);
        const contractAddress = deployAuthorizationTokenFactory.contract_address;


        return contractAddress;
    } catch (error: any) {
        console.error("Error:", error.message);
    }
}

export async function deploySettlementTokenFactory(
    hostNode: string,
    hostPort: string,
): Promise<string | undefined> {
    const deploySettlementTokenFactory = new DeploySettlementTokenFactory(hostNode, hostPort);

    try {
        const deployTxId = await deploySettlementTokenFactory.makeDeployRequest();
        console.log("deploy id: ", deployTxId);

        await sleep(4000);
        await deploySettlementTokenFactory.getContractAddress(deployTxId);

        await sleep(4000);
        const contractAddress = deploySettlementTokenFactory.contract_address;

        return contractAddress;
    } catch (error: any) {
        console.error("Error:", error.message);
    }
}

export async function deployManagementContract(
    hostNode: string,
    hostPort: string,
    interfaceName: string,
    authorizationFactoryAddress: string,
    settlementFactoryAddress: string
): Promise<string | undefined> {
    const deployer = new DeployManagementContract(hostNode, hostPort);

    try {
        const deployTxId = await deployer.makeDeployRequest();
        console.log("deploy id: ", deployTxId);

        await sleep(4000);
        await deployer.getContractAddress(deployTxId);

        await sleep(4000);
        await deployer.makeGenerateContractInterfaceRequest();

        await sleep(4000);
        await deployer.makeBuildContractInterfaceRequest({
            namespace: "default",
            name: interfaceName,
            description: `Contrato de ${interfaceName}`,
            version: "1.0",
        });

        await sleep(4000);
        await deployer.makeGenerateContractAPIRequest(interfaceName);

        await sleep(4000);
        const contractAddress = deployer.contract_address;

        if (authorizationFactoryAddress && settlementFactoryAddress) {
            deployer.makeSetAuthorizationFactory(interfaceName, authorizationFactoryAddress);
            await sleep(2000);
            deployer.makeSetSettlementFactory(interfaceName, settlementFactoryAddress);
        } else {
            return "Houve um erro, nao recebi o endereco do contrato de factory de autorizacao e liquidacao...";
        }

        return contractAddress;
    } catch (error: any) {
        console.error("Error:", error.message);
    }
}


