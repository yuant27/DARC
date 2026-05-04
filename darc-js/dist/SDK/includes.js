// all the included instructions are here, mostly instructions for operations
// todo: add backend support for current operations
import { op_batch_mint_tokens } from "./opcodes/op_batch_mint_tokens";
import { op_batch_create_token_class } from "./opcodes/op_batch_create_token_class";
export let operationList = [];
export function batch_mint_tokens(addressArray, tokenClass, amountArray) {
    let operation = op_batch_mint_tokens(addressArray, tokenClass, amountArray);
    operationList.push(operation);
}
export function batch_create_token_class(nameArray, tokenIndexArray, votingWeightArray, dividendWeightArray) {
    let operation = op_batch_create_token_class(nameArray, tokenIndexArray, votingWeightArray, dividendWeightArray);
    operationList.push(operation);
}
//# sourceMappingURL=includes.js.map
