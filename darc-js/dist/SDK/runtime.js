import * as instructions from "./instructions";
import { ethers } from 'ethers';
import * as DARC from "../DARC/DARC";
export async function run(code, wallet, provider, targetDARCAddress) {
    instructions.clearOperationList();
    let include = '';
    for (const key in instructions) {
        include += `let ${key} = instructions.${key};\n`;
    }
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
        version: DARC.DARC_VERSION.Test,
        wallet: wallet,
    });
    await attachedDARC.entrance(program);
}
//# sourceMappingURL=runtime.js.map