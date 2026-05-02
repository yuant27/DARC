import { OperationStruct } from "./struct/basicTypes";
export declare let operationList: OperationStruct[];
export declare function clearOperationList(): void;
export declare function batch_mint_tokens(addressArray: string[], tokenClass: bigint[] | number[], amountArray: bigint[] | number[]): void;
export declare function batch_create_token_class(nameArray: string[], tokenIndexArray: bigint[], votingWeightArray: bigint[], dividendWeightArray: bigint[]): void;
//# sourceMappingURL=instructions.d.ts.map