
import {
    makeCreateParticipant,
    getParticipantInfo
} from "./controller/participant";

async function createParticipant() {

    const hostNodeElo = "127.0.0.1";
    const portNodeElo = "5000";
    const managementInterfaceName = "ManagementContract";
    const participantTypeInput = "Credenciador";
    const participantWalletInput = "0x9ded1d810867f7af33a3d7b62487fc206915efb0";

    await makeCreateParticipant(hostNodeElo, portNodeElo, managementInterfaceName, participantTypeInput, participantWalletInput);

    const participantInfo = await getParticipantInfo(hostNodeElo, portNodeElo, managementInterfaceName, participantWalletInput);

    console.log(participantInfo);
}



createParticipant();