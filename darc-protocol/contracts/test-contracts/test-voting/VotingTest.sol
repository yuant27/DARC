// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.9;
import '../../protocol/Runtime/VotingMachine/VotingMachine.sol';
import '../../protocol/Runtime/Runtime.sol';


/**
 * @title The unit test contract of the voting machine
 * @author DARC Team
 * @notice null
 */

contract VotingTestContract is VotingMachine{
  function initializeVotingTest() public {
    this.initialize();
  }

  function initializeVotingForTest(uint256[] memory votingRuleIndices, Program memory currentProgram) public {
    this.initializeVoting(votingRuleIndices, currentProgram);
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
    currentMachineState.tokenList[tokenClassIndex].bIsInitialized = true;
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

contract RuntimeVotingTestContract is Runtime {
  function initializeRuntimeVotingTest() public {
    this.initialize();
  }

  function entranceForTest(Program memory program) public payable returns (string memory) {
    return runtimeEntrance(program);
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
    currentMachineState.tokenList[tokenClassIndex].bIsInitialized = true;
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

  function requireVotingForAllProgramsForTest(uint256 votingRuleIndex) public {
    ConditionNode[] memory conditionNodes = new ConditionNode[](1);
    conditionNodes[0] = ConditionNode(
      0,
      EnumConditionNodeType.BOOLEAN_TRUE,
      EnumLogicalOperatorType.UNDEFINED,
      EnumConditionExpression.UNDEFINED,
      new uint256[](0),
      NodeParam(
        new uint256[](0),
        new address[](0),
        new string[](0),
        new uint256[][](0),
        new address[][](0),
        new string[][](0)
      )
    );

    currentMachineState.beforeOpPlugins.push(Plugin(
      EnumReturnType.SANDBOX_NEEDED,
      100,
      conditionNodes,
      0,
      "sandbox before voting",
      true,
      true,
      true
    ));
    currentMachineState.afterOpPlugins.push(Plugin(
      EnumReturnType.VOTING_NEEDED,
      100,
      conditionNodes,
      votingRuleIndex,
      "vote required",
      true,
      true,
      false
    ));
  }
}