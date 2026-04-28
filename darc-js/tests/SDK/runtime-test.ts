import { expect } from 'chai';
import 'mocha';
import { ethers } from 'ethers';
import { run } from '../../src/SDK/runtime';
import { operationList } from '../../src/SDK/includes';

describe('SDK runtime', () => {
  beforeEach(() => {
    operationList.splice(0, operationList.length);
  });

  it('clears collected operations when user code throws', async () => {
    const wallet = ethers.Wallet.createRandom();
    const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545/');
    const code = `
batch_mint_tokens(
  ['0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266'],
  [100],
  [0]
);
throw new Error('abort before submit');
`;

    try {
      await run(code, wallet, provider, ethers.constants.AddressZero);
      throw new Error('expected run to throw');
    } catch (error) {
      expect((error as Error).message).to.equal('abort before submit');
    }

    expect(operationList).to.deep.equal([]);
  });
});
