import { ethers } from 'ethers';
import * as instructions from "./includes";
import * as DARC from "../DARC/DARC";
import { DARC_VERSION } from "../darcBinary/darcBinary";
export async function run(code, wallet, provider, targetDARCAddress) {
    let include = '';
    for (const key in instructions) {
        include += `let ${key} = instructions.${key};\n`;
    }
    instructions.operationList.length = 0;
    const fn = new Function('instructions', 'ethers', 'wallet', 'provider', 'address', include + code + '\n return operationList;');
    const results = fn(instructions, ethers, wallet, provider, targetDARCAddress);
    const operatorAddress = wallet.address;
    const resultList = [...results];
    for (let i = 0; i < resultList.length; i++) {
        resultList[i].operatorAddress = operatorAddress;
    }
    const program = {
        programOperatorAddress: operatorAddress,
        operations: resultList
    };
    const attachedDARC = new DARC.DARC({
        address: targetDARCAddress,
        version: DARC_VERSION.Test,
        wallet: wallet,
    });
    await attachedDARC.entrance(program);
}
//# sourceMappingURL=runtime.js.map