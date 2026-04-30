import { ethers } from 'ethers';
import { ProgramStruct } from "./struct/basicTypes";
export declare function run(code: string, wallet: ethers.Wallet, provider: ethers.providers.Provider, targetDARCAddress: string): Promise<void>;
export declare function buildProgram(code: string, operatorAddress: string, wallet?: ethers.Wallet, provider?: ethers.providers.Provider, targetDARCAddress?: string, include?: string): ProgramStruct;
//# sourceMappingURL=runtime.d.ts.map