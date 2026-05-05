var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as instructions from "./includes";
import { ethers } from 'ethers';
import { DARC } from "../DARC/DARC";
import { DARC_VERSION } from "../darcBinary/darcBinary";
export function run(code, wallet, provider, targetDARCAddress) {
    return __awaiter(this, void 0, void 0, function* () {
    instructions.operationList.length = 0;
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
    const attachedDARC = new DARC({
        address: targetDARCAddress,
        version: DARC_VERSION.Test,
        wallet: wallet,
    });
    yield attachedDARC.entrance(program);
    });
}
//# sourceMappingURL=runtime.js.map