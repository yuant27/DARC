import { expect } from 'chai';
import 'mocha';
import { batch_mint_tokens, operationList } from '../../src/SDK/includes';

describe('batch_mint_tokens', () => {
  beforeEach(() => {
    operationList.splice(0, operationList.length);
  });

  it('encodes token classes before amounts', () => {
    const recipient = '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266';

    batch_mint_tokens(
      [recipient, recipient],
      [BigInt(100), BigInt(200)],
      [BigInt(0), BigInt(1)]
    );

    expect(operationList).to.have.lengthOf(1);
    expect(operationList[0].param.UINT256_2DARRAY).to.deep.equal([
      [BigInt(0), BigInt(1)],
      [BigInt(100), BigInt(200)],
    ]);
  });
});
