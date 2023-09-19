import { ManagementContract } from "../class/ManagmentContract";
import { AuthorizationTokenContract } from "../class/SettlementToken";

import { Management__factory } from "../../src/types";



const RPC = "http://127.0.0.1:5100";
const privateKey = "c1aa5c6329ada2cba5515d2f04ad2f7ff5ec08c5412ef3836de00e58702731ee";
const contractAddress = "0x10f970e22f791f8254d3d9976d3af5ed4dfbc62f";



async function getTransaction(nrid: number) {

    const contract = new ManagementContract(RPC, contractAddress, privateKey);

    const tokenURI = await contract.getTransactionInfo(nrid);

    return tokenURI

}


async function getTransactionByParticipant(addressParticipant: string) {
    const contract = new ManagementContract(RPC, contractAddress, privateKey);
    const tokenURI = await contract.getTransactionsByParticipant(addressParticipant);

    return tokenURI
}



getTransaction(100)
    .then((result) => {
        console.log(result);
    })
    .catch((error) => {
        console.error(error);
    });