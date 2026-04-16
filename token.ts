import { createPublicClient, http, erc20Abi, formatUnits } from 'viem';
import { base } from 'viem/chains';

export const TOKEN_ADDRESS = '0x9754862df128f0b643c9947f64fa64b868e06ba3' as const;

// Simulated total bounty pool from token fees (in USD)
export const BOUNTY_POOL_USD = 48_200;

const client = createPublicClient({
  chain: base,
  transport: http(),
});

export async function getTokenBalance(address: `0x${string}`): Promise<{ raw: bigint; formatted: string }> {
  try {
    const [raw, decimals] = await Promise.all([
      client.readContract({ address: TOKEN_ADDRESS, abi: erc20Abi, functionName: 'balanceOf', args: [address] }),
      client.readContract({ address: TOKEN_ADDRESS, abi: erc20Abi, functionName: 'decimals' }),
    ]);
    return { raw, formatted: parseFloat(formatUnits(raw, decimals)).toLocaleString() };
  } catch {
    return { raw: 0n, formatted: '0' };
  }
}

export async function getTokenSymbol(): Promise<string> {
  try {
    return await client.readContract({ address: TOKEN_ADDRESS, abi: erc20Abi, functionName: 'symbol' });
  } catch {
    return 'TOKEN';
  }
}

export async function getTokenDecimals(): Promise<number> {
  try {
    return await client.readContract({ address: TOKEN_ADDRESS, abi: erc20Abi, functionName: 'decimals' });
  } catch {
    return 18;
  }
}
