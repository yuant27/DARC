import { expect } from 'chai';
import 'mocha';
import { buildProgram } from '../../src/SDK/runtime';

const operatorAddress = '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266';

describe('Runtime operation list handling', () => {
  it('does not replay operations from earlier runs', () => {
    const firstProgram = buildProgram(`
batch_create_token_class(['token_0'],
[0],
[10],
[20]);
`, operatorAddress);

    const secondProgram = buildProgram(`
batch_mint_tokens([
  "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266"
],
[100],
[0]);
`, operatorAddress);

    expect(firstProgram.operations).to.have.length(1);
    expect(firstProgram.operations[0].opcode).to.equal(2);
    expect(secondProgram.operations).to.have.length(1);
    expect(secondProgram.operations[0].opcode).to.equal(1);
  });
});
