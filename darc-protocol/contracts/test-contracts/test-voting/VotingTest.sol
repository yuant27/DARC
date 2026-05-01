// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.9;
import '../../protocol/Runtime/VotingMachine/VotingMachine.sol';


/**
 * @title The unit test contract of the voting machine
 * @author DARC Team
 * @notice null
 */

contract VotingTestContract is VotingMachine{
  function initializeVotingTest() public {
    this.initialize();
  }

  function setTokenForVoting(
    uint256 tokenClassIndex,
    address voter,
    uint256 balance,
    uint256 votingWeight,
    uint256 totalSupply
  ) public {
    currentMachineState.tokenList[tokenClassIndex].tokenBalance[voter] = balance;
    currentMachineState.tokenList[tokenClassIndex].votingWeight = votingWeight;
    currentMachineState.tokenList[tokenClassIndex].totalSupply = totalSupply;
  }

  function addVotingRuleForTest(
    uint256[] memory votingTokenClassList,
    uint256 approvalThresholdPercentage,
    uint256 votingDurationInSeconds,
    uint256 executionPendingDurationInSeconds,
    bool bIsAbsoluteMajority
  ) public returns (uint256) {
    currentMachineState.votingRuleList.push();
    uint256 votingRuleIndex = currentMachineState.votingRuleList.length - 1;
    VotingRule storage votingRule = currentMachineState.votingRuleList[votingRuleIndex];
    for (uint256 i = 0; i < votingTokenClassList.length; i++) {
      votingRule.votingTokenClassList.push(votingTokenClassList[i]);
    }
    votingRule.approvalThresholdPercentage = approvalThresholdPercentage;
    votingRule.votingDurationInSeconds = votingDurationInSeconds;
    votingRule.executionPendingDurationInSeconds = executionPendingDurationInSeconds;
    votingRule.isEnabled = true;
    votingRule.bIsAbsoluteMajority = bIsAbsoluteMajority;
    return votingRuleIndex;
  }

  function votingPowerForTest(uint256 votingItemIndex, uint256 rulePosition)
    public
    view
    returns (uint256 powerYes, uint256 powerNo)
  {
    return (
      votingItems[votingItemIndex].powerYes[rulePosition],
      votingItems[votingItemIndex].powerNo[rulePosition]
    );
  }
} 