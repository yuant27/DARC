import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber } from "ethers";

const OPCODE_CREATE_TOKEN_CLASS = 2;
const OPCODE_MINT_TOKENS = 1;
const OPCODE_ADD_AND_ENABLE_PLUGIN = 15;
const OPCODE_ADD_VOTING_RULE = 19;
const OPCODE_VOTE = 32;

const RETURN_SANDBOX_NEEDED = 1;
const RETURN_VOTING_NEEDED = 3;

const NODE_BOOLEAN_TRUE = 3;

function emptyParam(overrides: Record<string, unknown> = {}) {
  return {
    UINT256_ARRAY: [],
    ADDRESS_ARRAY: [],
    STRING_ARRAY: [],
    BOOL_ARRAY: [],
    VOTING_RULE_ARRAY: [],
    PARAMETER_ARRAY: [],
    PLUGIN_ARRAY: [],
    UINT256_2DARRAY: [],
    ADDRESS_2DARRAY: [],
    ...overrides,
  };
}

function emptyNodeParam() {
  return {
    UINT256_ARRAY: [],
    ADDRESS_ARRAY: [],
    STRING_ARRAY: [],
    UINT256_2DARRAY: [],
    ADDRESS_2DARRAY: [],
    STRING_2DARRAY: [],
  };
}

function booleanTrueNode() {
  return {
    id: BigNumber.from(0),
    nodeType: NODE_BOOLEAN_TRUE,
    logicalOperator: 0,
    conditionExpression: 0,
    childList: [],
    param: emptyNodeParam(),
  };
}

function operation(operatorAddress: string, opcode: number, paramOverrides: Record<string, unknown> = {}) {
  return {
    operatorAddress,
    opcode,
    param: emptyParam(paramOverrides),
  };
}

describe("VotingMachine", function () {
  it("keeps no votes out of yes power and exposes active deadlines", async function () {
    const [voter] = await ethers.getSigners();
    const VotingTestContract = await ethers.getContractFactory("VotingTestContract");
    const voting = await VotingTestContract.deploy();
    await voting.deployed();
    await voting.initializeVotingTest();

    await voting.setTokenForVoting(2, voter.address, 60, 2, 100);
    await voting.addVotingRuleForTest([BigNumber.from(2)], 50, 3600, 3600, false);

    await expect(
      voting.initializeVoting([BigNumber.from(0)], {
        programOperatorAddress: voter.address,
        operations: [],
      })
    ).to.be.revertedWith("Only DARC can initialize voting");

    await voting.initializeVotingForTest([BigNumber.from(0)], {
      programOperatorAddress: voter.address,
      operations: [],
    });

    expect(await voting.votingDeadline()).to.be.gt(BigNumber.from(0));
    expect(await voting.executingPendingDeadline()).to.be.gt(await voting.votingDeadline());

    await voting.vote(voter.address, [false]);

    const [powerYes, powerNo] = await voting.votingPowerForTest(1, 0);
    expect(powerYes).to.equal(0);
    expect(powerNo).to.equal(120);
    expect(await voting.checkVotingResult(0)).to.equal(1);
  });

  it("rejects direct vote impersonation", async function () {
    const [voter, attacker] = await ethers.getSigners();
    const VotingTestContract = await ethers.getContractFactory("VotingTestContract");
    const voting = await VotingTestContract.deploy();
    await voting.deployed();
    await voting.initializeVotingTest();

    await voting.setTokenForVoting(0, voter.address, 60, 1, 100);
    await voting.addVotingRuleForTest([BigNumber.from(0)], 50, 3600, 3600, false);
    await voting.initializeVotingForTest([BigNumber.from(0)], {
      programOperatorAddress: voter.address,
      operations: [],
    });

    await expect(voting.connect(attacker).vote(voter.address, [true])).to.be.revertedWith(
      "Cannot vote for another address"
    );
  });

  it("records votes through DARC.entrance while voting is active", async function () {
    const [owner, voter] = await ethers.getSigners();
    const DARC = await ethers.getContractFactory("DARC");
    const darc = await DARC.deploy();
    await darc.deployed();
    await darc.initialize();

    await (
      await darc.entrance({
        programOperatorAddress: owner.address,
        operations: [
          operation(owner.address, OPCODE_CREATE_TOKEN_CLASS, {
            STRING_ARRAY: ["VotingToken"],
            UINT256_2DARRAY: [[BigNumber.from(0)], [BigNumber.from(1)], [BigNumber.from(1)]],
          }),
        ],
      })
    ).wait();

    await (
      await darc.entrance({
        programOperatorAddress: owner.address,
        operations: [
          operation(owner.address, OPCODE_MINT_TOKENS, {
            UINT256_2DARRAY: [[BigNumber.from(0)], [BigNumber.from(60)]],
            ADDRESS_2DARRAY: [[voter.address]],
          }),
        ],
      })
    ).wait();

    await (
      await darc.entrance({
        programOperatorAddress: owner.address,
        operations: [
          operation(owner.address, OPCODE_ADD_VOTING_RULE, {
            VOTING_RULE_ARRAY: [
              {
                votingTokenClassList: [BigNumber.from(0)],
                approvalThresholdPercentage: 50,
                votingDurationInSeconds: 3600,
                executionPendingDurationInSeconds: 3600,
                isEnabled: true,
                note: "",
                bIsAbsoluteMajority: false,
              },
            ],
          }),
        ],
      })
    ).wait();

    await (
      await darc.entrance({
        programOperatorAddress: owner.address,
        operations: [
          operation(owner.address, OPCODE_ADD_AND_ENABLE_PLUGIN, {
            PLUGIN_ARRAY: [
              {
                returnType: RETURN_VOTING_NEEDED,
                level: 100,
                conditionNodes: [booleanTrueNode()],
                votingRuleIndex: 0,
                note: "vote required",
                bIsEnabled: true,
                bIsInitialized: true,
                bIsBeforeOperation: false,
              },
            ],
          }),
        ],
      })
    ).wait();

    await (
      await darc.entrance({
        programOperatorAddress: owner.address,
        operations: [
          operation(owner.address, OPCODE_ADD_AND_ENABLE_PLUGIN, {
            PLUGIN_ARRAY: [
              {
                returnType: RETURN_SANDBOX_NEEDED,
                level: 100,
                conditionNodes: [booleanTrueNode()],
                votingRuleIndex: 0,
                note: "sandbox before voting",
                bIsEnabled: true,
                bIsInitialized: true,
                bIsBeforeOperation: true,
              },
            ],
          }),
        ],
      })
    ).wait();

    await (
      await darc.entrance({
        programOperatorAddress: owner.address,
        operations: [
          operation(owner.address, OPCODE_MINT_TOKENS, {
            UINT256_2DARRAY: [[BigNumber.from(0)], [BigNumber.from(1)]],
            ADDRESS_2DARRAY: [[owner.address]],
          }),
        ],
      })
    ).wait();

    expect(await darc.finiteState()).to.equal(2);

    await expect(
      darc.connect(voter).entrance({
        programOperatorAddress: voter.address,
        operations: [
          operation(voter.address, OPCODE_MINT_TOKENS, {
            UINT256_2DARRAY: [[BigNumber.from(0)], [BigNumber.from(1)]],
            ADDRESS_2DARRAY: [[voter.address]],
          }),
        ],
      })
    ).to.be.revertedWith("Invalid voting program.");

    await (
      await darc.connect(voter).entrance({
        programOperatorAddress: voter.address,
        operations: [
          operation(voter.address, OPCODE_VOTE, {
            BOOL_ARRAY: [true],
          }),
        ],
      })
    ).wait();

    expect(await darc.checkVotingResult(0)).to.equal(0);
  });
});
