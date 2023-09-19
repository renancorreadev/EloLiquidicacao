
import {
    deployManagementContract,
    deployAuthorizationTokenFactory,
    deploySettlementTokenFactory
} from "./controller";

async function startDeploy() {

    const hostNodeElo = "127.0.0.1";
    const portNodeElo = "5000";

    const authorizationTokenFactoryAddress = await deployAuthorizationTokenFactory(hostNodeElo, portNodeElo);
    const settlementTokenFactoryAddress = await deploySettlementTokenFactory(hostNodeElo, portNodeElo);

    if (authorizationTokenFactoryAddress === undefined || settlementTokenFactoryAddress === undefined) {
        return "Houve um erro, nao recebi o endereco do contrato de autorizacao...";
    }

    const managementInterfaceName = "ManagementContract";

    console.log("authorizationTokenFactoryAddress", authorizationTokenFactoryAddress);
    console.log("settlementTokenFactoryAddress", settlementTokenFactoryAddress);


    const managementAddress = await deployManagementContract(
        hostNodeElo,
        portNodeElo,
        managementInterfaceName,
        authorizationTokenFactoryAddress!,
        settlementTokenFactoryAddress!
    );

    console.log("managementAddress", managementAddress);
}

startDeploy();