
import {
    initializeAuthorizationContract,
    initializeSettlementContract
} from "./controller";
import { getParticipantInfo } from "./controller/participant";

async function startInitializeParticipantOnFirefly() {

    const hostNodeElo = "127.0.0.1";
    const portNodeElo = "5000";
    const managementInterfaceName = "ManagementContract";
    const authorizationContractInterfaceName = "authorizationCredenciadorOne";
    const settlementContractInterfaceName = "settlementCredenciadorOne";

    // Endereco do participante do no do firefly
    const participantWalletInput = "0x9ded1d810867f7af33a3d7b62487fc206915efb0";

    const participantContractInfo = await getParticipantInfo(hostNodeElo, portNodeElo, managementInterfaceName, participantWalletInput);

    const participantAuthorizationContractAddress = participantContractInfo?.authorizationAddress;
    const participantSettlementContractAddress = participantContractInfo?.settlementAddress;

    const initializeAuthorizationFirefly = await initializeAuthorizationContract(hostNodeElo, portNodeElo, authorizationContractInterfaceName, participantAuthorizationContractAddress!);
    const initializeSettlementFirefly = await initializeSettlementContract(hostNodeElo, portNodeElo, settlementContractInterfaceName, participantSettlementContractAddress!);

    console.log(initializeAuthorizationFirefly);
    console.log(initializeSettlementFirefly);
}

startInitializeParticipantOnFirefly();