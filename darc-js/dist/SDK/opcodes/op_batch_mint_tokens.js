import { ethers } from "ethers";
export function op_batch_mint_tokens(addressArray, tokenClass, amountArray) {
    if (addressArray.length != amountArray.length) {
        throw new Error("The length of addressArray and amountArray are different");
    }
    if (addressArray.length == 0) {
        throw new Error("The length of addressArray and amountArray are zero");
    }
    for (let i = 0; i < addressArray.length; i++) {
        if (typeof addressArray[i] != "string") {
            throw new Error("The addressArray is not a valid array of address strings");
        }
        if (ethers.utils.isAddress(addressArray[i]) == false) {
            throw new Error("The addressArray is not a valid array of address strings");
        }
    }
    for (let i = 0; i < amountArray.length; i++) {
        if (typeof amountArray[i] === "number") {
            amountArray[i] = BigInt(amountArray[i]);
        }
        if (typeof amountArray[i] !== "bigint") {
            throw new Error("The amountArray is not a valid array of bigints");
        }
    }
    for (let i = 0; i < tokenClass.length; i++) {
        if (typeof tokenClass[i] === "number") {
            tokenClass[i] = BigInt(tokenClass[i]);
        }
        if (typeof tokenClass[i] !== "bigint") {
            throw new Error("The tokenClass is not a valid array of bigints");
        }
    }
    return {
        operatorAddress: "",
        opcode: 1,
        param: {
            UINT256_ARRAY: [],
            ADDRESS_ARRAY: [],
            STRING_ARRAY: [],
            BOOL_ARRAY: [],
            VOTING_RULE_ARRAY: [],
            PLUGIN_ARRAY: [],
            PARAMETER_ARRAY: [],
            UINT256_2DARRAY: [
                tokenClass,
                amountArray
            ],
            ADDRESS_2DARRAY: [
                addressArray
            ]
        }
    };
}
