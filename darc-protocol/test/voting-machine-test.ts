import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber } from "ethers";

describe("VotingMachine", function () {
  it("keeps no votes out of yes power and exposes an active voting deadline", async function () {
    const [voter] = await ethers.getSigners();
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

    const deadline = await voting.votingDeadline();
    expect(deadline).to.be.gt(BigNumber.from(0));

    await voting.vote(voter.address, [false]);

    const [powerYes, powerNo] = await voting.votingPowerForTest(1, 0);
    expect(powerYes).to.equal(0);
    expect(powerNo).to.equal(60);
    expect(await voting.checkVotingResult(0)).to.equal(1);
  });
});
