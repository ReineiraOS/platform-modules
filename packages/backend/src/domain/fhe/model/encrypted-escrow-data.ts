import { EncryptedValue } from './encrypted-value.js';

export interface EncryptedEscrowDataParams {
  encryptedAmount: EncryptedValue;
  encryptedOwner: EncryptedValue;
  userAddress: string;
  plaintextAmount?: bigint;
  plaintextOwner?: string;
}

export interface EncryptedEscrowDataJSON {
  encryptedAmount: ReturnType<EncryptedValue['toJSON']>;
  encryptedOwner: ReturnType<EncryptedValue['toJSON']>;
  userAddress: string;
  plaintextAmount?: string;
  plaintextOwner?: string;
}

export interface ContractCallParameters {
  encrypted_owner: [string, number, number, string];
  encrypted_amount: [string, number, number, string];
  resolver: string;
  resolver_data: string;
}

export class EncryptedEscrowData {
  readonly encryptedAmount: EncryptedValue;
  readonly encryptedOwner: EncryptedValue;
  readonly userAddress: string;
  readonly plaintextAmount?: bigint;
  readonly plaintextOwner?: string;

  constructor(params: EncryptedEscrowDataParams) {
    this.encryptedAmount = params.encryptedAmount;
    this.encryptedOwner = params.encryptedOwner;
    this.userAddress = params.userAddress;
    this.plaintextAmount = params.plaintextAmount;
    this.plaintextOwner = params.plaintextOwner;
  }

  isForUser(address: string): boolean {
    return this.userAddress.toLowerCase() === address.toLowerCase();
  }

  getContractCallParameters(): ContractCallParameters {
    return {
      encrypted_owner: this.encryptedOwner.toTuple(),
      encrypted_amount: this.encryptedAmount.toTuple(),
      resolver: '0x0000000000000000000000000000000000000000',
      resolver_data: '0x',
    };
  }

  toJSON(): EncryptedEscrowDataJSON {
    return {
      encryptedAmount: this.encryptedAmount.toJSON(),
      encryptedOwner: this.encryptedOwner.toJSON(),
      userAddress: this.userAddress,
      plaintextAmount: this.plaintextAmount?.toString(),
      plaintextOwner: this.plaintextOwner,
    };
  }

  static fromJSON(json: unknown): EncryptedEscrowData {
    const obj = json as EncryptedEscrowDataJSON;
    return new EncryptedEscrowData({
      encryptedAmount: EncryptedValue.fromJSON(obj.encryptedAmount),
      encryptedOwner: EncryptedValue.fromJSON(obj.encryptedOwner),
      userAddress: obj.userAddress,
      plaintextAmount: obj.plaintextAmount ? BigInt(obj.plaintextAmount) : undefined,
      plaintextOwner: obj.plaintextOwner,
    });
  }
}
