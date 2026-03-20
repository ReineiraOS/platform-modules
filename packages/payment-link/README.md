# @reineira-os/modules-payment-link

Shareable payment link for ReineiraOS ventures. External parties pay invoices via any wallet with
cross-chain USDC settlement.

## Payment Flow

```
1. Merchant creates invoice → gets shareable link
2. Recipient clicks link → /pay/:invoiceId
3. Sees invoice details (amount, from, due date)
4. Connects wallet via RainbowKit (MetaMask, WalletConnect, etc.)
5. Selects payment chain
6. USDC approved → depositForBurnWithHook() → CCTP cross-chain settlement
7. Invoice marked as PAID
```

## Stack

- **Vue 3** + TypeScript + Vite + TailwindCSS
- **Wagmi** + **RainbowKit** — wallet connection
- **ethers.js** + **viem** — blockchain interaction
- **CCTP v2** — cross-chain USDC via Circle

## Key Stores

| Store | Purpose |
| ----- | ------- |
| invoiceStore | Invoice details, polling for status |
| paymentStore | Payment execution (approve → burn → relayer → attestation) |
| walletStore | Connected wallet address, chain |
| chainStore | Source/destination chain selection |
| balanceStore | USDC balance tracking |

## Status

Scaffold — production code will be populated from Privara.
