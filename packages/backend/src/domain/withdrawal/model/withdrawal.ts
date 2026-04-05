import { DestinationChain } from './destination-chain.enum.js';
import { WithdrawalStatus } from './withdrawal-status.enum.js';

export interface WithdrawalParams {
  id: string;
  publicId: string;
  userId: string;
  walletId: string;
  escrowIds: number[];
  destinationChain: DestinationChain;
  destinationDomain: number;
  recipientAddress: string;
  status: WithdrawalStatus;
  estimatedAmount: number;
  walletProvider: string;
  actualAmount?: number;
  fee?: number;
  redeemTxHash?: string;
  bridgeTxHash?: string;
  destinationTxHash?: string;
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

export class Withdrawal {
  readonly id: string;
  readonly publicId: string;
  readonly userId: string;
  readonly walletId: string;
  readonly escrowIds: number[];
  readonly destinationChain: DestinationChain;
  readonly destinationDomain: number;
  readonly recipientAddress: string;
  status: WithdrawalStatus;
  readonly estimatedAmount: number;
  readonly walletProvider: string;
  actualAmount?: number;
  fee?: number;
  redeemTxHash?: string;
  bridgeTxHash?: string;
  destinationTxHash?: string;
  errorMessage?: string;
  readonly createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;

  constructor(params: WithdrawalParams) {
    this.id = params.id;
    this.publicId = params.publicId;
    this.userId = params.userId;
    this.walletId = params.walletId;
    this.escrowIds = params.escrowIds;
    this.destinationChain = params.destinationChain;
    this.destinationDomain = params.destinationDomain;
    this.recipientAddress = params.recipientAddress;
    this.status = params.status;
    this.estimatedAmount = params.estimatedAmount;
    this.walletProvider = params.walletProvider;
    this.actualAmount = params.actualAmount;
    this.fee = params.fee;
    this.redeemTxHash = params.redeemTxHash;
    this.bridgeTxHash = params.bridgeTxHash;
    this.destinationTxHash = params.destinationTxHash;
    this.errorMessage = params.errorMessage;
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
    this.completedAt = params.completedAt;
  }

  markRedeemComplete(txHash: string): this {
    this.redeemTxHash = txHash;
    this.status = WithdrawalStatus.PENDING_BRIDGE;
    this.updatedAt = new Date();
    return this;
  }

  markBridgeInitiated(txHash: string): this {
    this.bridgeTxHash = txHash;
    this.status = WithdrawalStatus.BRIDGING;
    this.updatedAt = new Date();
    return this;
  }

  markCompleted(destinationTxHash: string): this {
    this.destinationTxHash = destinationTxHash;
    this.status = WithdrawalStatus.COMPLETED;
    this.updatedAt = new Date();
    this.completedAt = new Date();
    return this;
  }

  markFailed(errorMessage: string): this {
    this.errorMessage = errorMessage;
    this.status = WithdrawalStatus.FAILED;
    this.updatedAt = new Date();
    return this;
  }

  canCreateBridgeChallenge(): boolean {
    return this.status === WithdrawalStatus.PENDING_BRIDGE;
  }

  isTerminal(): boolean {
    return this.status === WithdrawalStatus.COMPLETED || this.status === WithdrawalStatus.FAILED;
  }
}
