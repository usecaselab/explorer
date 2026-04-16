import { createPublicClient, http, erc20Abi, formatUnits } from 'viem';
import { base } from 'viem/chains';

export const TOKEN_ADDRESS = '0x9754862df128f0b643c9947f64fa64b868e06ba3' as const;
export const TOKEN_NAME = 'Use Case Lab';
export const TOKEN_SYMBOL = 'UseCaseLab';
export const POOL_ID = '0xeb98b51426d71c9c247f418f4896139222f25a80b79b32b5113d28079563ed14';
export const FEE_RECIPIENT = '0xa8bd82fdbd27cca6d26a1ef0a5a07a4cde92a08d' as const;

// 10M tokens per vote increment
export const VOTE_INCREMENT = 10_000_000;

const WETH = '0x4200000000000000000000000000000000000006' as const;

// Chainlink ETH/USD feed on Base
const ETH_USD_FEED = '0x71041dddad3595F9CEd3DcCFBe3D1F4b0a16Bb70' as const;
const CHAINLINK_ABI = [{
  name: 'latestRoundData',
  type: 'function' as const,
  inputs: [],
  outputs: [
    { name: 'roundId', type: 'uint80' },
    { name: 'answer', type: 'int256' },
    { name: 'startedAt', type: 'uint256' },
    { name: 'updatedAt', type: 'uint256' },
    { name: 'answeredInRound', type: 'uint80' },
  ],
  stateMutability: 'view' as const,
}];

const client = createPublicClient({
  chain: base,
  transport: http('https://mainnet.base.org'),
});

export async function getTokenBalance(address: `0x${string}`): Promise<{ raw: bigint; formatted: string; number: number }> {
  try {
    const raw = await client.readContract({ address: TOKEN_ADDRESS, abi: erc20Abi, functionName: 'balanceOf', args: [address] });
    const num = parseFloat(formatUnits(raw, 18));
    return { raw, formatted: formatTokenAmount(num), number: num };
  } catch {
    return { raw: 0n, formatted: '0', number: 0 };
  }
}

// Returns { weth: ETH amount, usd: USD value } of fees accumulated in the fee recipient wallet
export async function getBountyPool(): Promise<{ weth: number; usd: number }> {
  try {
    const [wethRaw, priceData] = await Promise.all([
      client.readContract({ address: WETH, abi: erc20Abi, functionName: 'balanceOf', args: [FEE_RECIPIENT] }),
      client.readContract({ address: ETH_USD_FEED, abi: CHAINLINK_ABI, functionName: 'latestRoundData' }),
    ]);
    const weth = parseFloat(formatUnits(wethRaw, 18));
    // Also include native ETH balance
    const nativeWei = await client.getBalance({ address: FEE_RECIPIENT });
    const native = parseFloat(formatUnits(nativeWei, 18));
    const ethPrice = Number((priceData as { answer: bigint }).answer) / 1e8;
    const totalEth = weth + native;
    return { weth: totalEth, usd: totalEth * ethPrice };
  } catch {
    return { weth: 0, usd: 0 };
  }
}

export function formatTokenAmount(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return n.toFixed(0);
}
