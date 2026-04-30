import * as instructions from "./instructions";
import { ethers } from 'ethers';
import * as DARC from "../DARC/DARC";
export function run(code, wallet, provider, targetDARCAddress) {
    let include = '';
    for (const key in instructions) {
        include += `let ${key} = instructions.${key};\n`;
    }
    const operatorAddress = wallet.address;
    const program = buildProgram(code, operatorAddress, wallet, provider, targetDARCAddress, include);
    const attachedDARC = new DARC.DARC({
        address: targetDARCAddress,
        version: DARC.DARC_VERSION.Test,
        wallet: wallet,
    });
    return attachedDARC.entrance(program);
}
export function buildProgram(code, operatorAddress, wallet, provider, targetDARCAddress = "", include) {
    if (include === undefined) {
        include = '';
        for (const key in instructions) {
            include += `let ${key} = instructions.${key};\n`;
        }
    }
    instructions.resetOperationList();
    const fn = new Function('instructions', 'ethers', 'wallet', 'provider', 'address', include + code + '\n return operationList;');
    try {
        const results = fn(instructions, ethers, wallet !== null && wallet !== void 0 ? wallet : { address: operatorAddress }, provider, targetDARCAddress);
        const resultList = [...results];
        for (let i = 0; i < resultList.length; i++) {
            resultList[i].operatorAddress = operatorAddress;
        }
        return {
            programOperatorAddress: operatorAddress,
            operations: resultList
        };
    }
    finally {
        instructions.resetOperationList();
    }
}
//# sourceMappingURL=runtime.js.map