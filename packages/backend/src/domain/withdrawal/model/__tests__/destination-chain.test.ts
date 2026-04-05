import { describe, it, expect } from 'vitest';
import { DestinationChain } from '../destination-chain.enum.js';

describe('DestinationChain', () => {
  it('ETH has value 0', () => {
    expect(DestinationChain.ETH).toBe(0);
  });

  it('BASE has value 6', () => {
    expect(DestinationChain.BASE).toBe(6);
  });

  it('POLYGON has value 7', () => {
    expect(DestinationChain.POLYGON).toBe(7);
  });

  it('has exactly three members', () => {
    const numericKeys = Object.keys(DestinationChain).filter((k) => !isNaN(Number(k)));
    expect(numericKeys).toHaveLength(3);
  });

  it('numeric keys map back to enum names', () => {
    expect(DestinationChain[0]).toBe('ETH');
    expect(DestinationChain[6]).toBe('BASE');
    expect(DestinationChain[7]).toBe('POLYGON');
  });
});
