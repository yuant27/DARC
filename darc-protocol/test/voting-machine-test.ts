import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber } from "ethers";

const OPCODE_MINT_TOKENS = 1;
const OPCODE_VOTE = 32;

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

  it("records votes through runtime entrance while voting is active", async function () {
    const [owner, voter] = await ethers.getSigners();
    const RuntimeVotingTestContract = await ethers.getContractFactory("RuntimeVotingTestContract");
    const runtime = await RuntimeVotingTestContract.deploy();
    await runtime.deployed();
    await runtime.initializeRuntimeVotingTest();

    await runtime.setTokenForVoting(0, voter.address, 60, 1, 100);
    await runtime.addVotingRuleForTest([BigNumber.from(0)], 50, 3600, 3600, false);
    await runtime.initializeVotingForRuntimeTest([BigNumber.from(0)], {
      programOperatorAddress: owner.address,
      operations: [],
    });

    expect(await runtime.finiteState()).to.equal(2);

    await expect(
      runtime.connect(voter).entranceForTest({
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
      await runtime.connect(voter).entranceForTest({
        programOperatorAddress: voter.address,
        operations: [
          operation(voter.address, OPCODE_VOTE, {
            BOOL_ARRAY: [true],
          }),
        ],
      })
    ).wait();

    expect(await runtime.checkVotingResult(0)).to.equal(0);
  });
});
