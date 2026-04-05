export type EscrowEventType = 'EscrowCreated' | 'EscrowSettled';

export interface EscrowEventParams {
  txHash: string;
  escrowId: string;
  eventType: EscrowEventType;
  blockNumber: string;
  createdAt: string;
  ttl: number;
  messageHash?: string;
  amount?: string;
}

export class EscrowEvent {
  readonly txHash: string;
  readonly escrowId: string;
  readonly eventType: EscrowEventType;
  readonly blockNumber: string;
  readonly createdAt: string;
  readonly ttl: number;
  readonly messageHash?: string;
  readonly amount?: string;

  constructor(params: EscrowEventParams) {
    this.txHash = params.txHash;
    this.escrowId = params.escrowId;
    this.eventType = params.eventType;
    this.blockNumber = params.blockNumber;
    this.createdAt = params.createdAt;
    this.ttl = params.ttl;
    this.messageHash = params.messageHash;
    this.amount = params.amount;
  }
}
