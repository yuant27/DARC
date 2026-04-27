import * as instructions from '../../src/SDK/includes';
import { expect } from 'chai';

describe('SDK operation list', () => {
  afterEach(() => {
    instructions.resetOperationList();
  });

  it('clears generated operations without replacing the shared list', () => {
    const operationList = instructions.operationList;

    instructions.batch_create_token_class(['token_0'], [0n], [10n], [20n]);
    expect(operationList.length).to.equal(1);

    instructions.resetOperationList();

    expect(instructions.operationList).to.equal(operationList);
    expect(operationList.length).to.equal(0);

    instructions.batch_mint_tokens(
      ['0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266'],
      [100n],
      [0n]
    );

    expect(operationList.length).to.equal(1);
    expect(operationList[0].opcode).to.equal(1);
  });
});
