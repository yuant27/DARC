// all the included instructions are here, mostly instructions for operations
// todo: add backend support for current operations

import { OperationStruct } from "./struct/basicTypes";

import { op_batch_mint_tokens } from "./opcodes/op_batch_mint_tokens";
import { op_batch_create_token_class } from "./opcodes/op_batch_create_token_class";

export let operationList: OperationStruct[] = [];

export function batch_mint_tokens(addressArray: string[], tokenClass: bigint[] | number[], amountArray: bigint[] | number[]) {
  let operation = op_batch_mint_tokens(addressArray, tokenClass, amountArray);
  operationList.push(operation);
}

export function batch_create_token_class(nameArray: string[], tokenIndexArray: bigint[], votingWeightArray: bigint[], dividendWeightArray: bigint[]) {
  let operation = op_batch_create_token_class(nameArray, tokenIndexArray, votingWeightArray, dividendWeightArray);
  operationList.push(operation);
}