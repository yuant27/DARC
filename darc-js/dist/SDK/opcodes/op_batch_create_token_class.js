import { ethers } from "ethers";
export function op_batch_create_token_class(nameArray, tokenIndexArray, votingWeightArray, dividendWeightArray) {
    if (nameArray.length != tokenIndexArray.length || nameArray.length != votingWeightArray.length || nameArray.length != dividendWeightArray.length) {
        throw new Error("The length of nameArray, tokenIndexArray, votingWeightArray, dividendWeightArray are different");
    }
    if (nameArray.length == 0 || tokenIndexArray.length == 0 || votingWeightArray.length == 0 || dividendWeightArray.length == 0) {
        throw new Error("The length of nameArray, tokenIndexArray, votingWeightArray, dividendWeightArray are zero");
    }
    for (let i = 0; i < nameArray.length; i++) {
        if (typeof nameArray[i] != "string") {
            throw new Error("The nameArray is not a valid array of strings");
        }
    }
    for (let i = 0; i < tokenIndexArray.length; i++) {
        if (typeof tokenIndexArray[i] === "number") {
            tokenIndexArray[i] = BigInt(tokenIndexArray[i]);
        }
        if (typeof tokenIndexArray[i] !== "bigint") {
            throw new Error("The tokenIndexArray is not a valid array of bigints");
        }
    }
    for (let i = 0; i < votingWeightArray.length; i++) {
        if (typeof votingWeightArray[i] === "number") {
            votingWeightArray[i] = BigInt(votingWeightArray[i]);
        }
        if (typeof votingWeightArray[i] !== "bigint") {
            throw new Error("The votingWeightArray is not a valid array of bigints");
        }
    }
    for (let i = 0; i < dividendWeightArray.length; i++) {
        if (typeof dividendWeightArray[i] === "number") {
            dividendWeightArray[i] = BigInt(dividendWeightArray[i]);
        }
        if (typeof dividendWeightArray[i] !== "bigint") {
            throw new Error("The dividendWeightArray is not a valid array of bigints");
        }
    }
    let operation = {
        operatorAddress: "",
        opcode: 2,
        param: {
            UINT256_ARRAY: [],
            ADDRESS_ARRAY: [],
            STRING_ARRAY: nameArray,
            BOOL_ARRAY: [],
            VOTING_RULE_ARRAY: [],
            PLUGIN_ARRAY: [],
            PARAMETER_ARRAY: [],
            UINT256_2DARRAY: [
                tokenIndexArray,
                votingWeightArray,
                dividendWeightArray
            ],
            ADDRESS_2DARRAY: []
        }
    };
    return operation;
}
//# sourceMappingURL=op_batch_create_token_class.js.map
