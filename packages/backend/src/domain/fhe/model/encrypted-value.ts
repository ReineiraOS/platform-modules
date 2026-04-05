export type EncryptedValueType = 'euint64' | 'eaddress' | 'ebool';

export interface EncryptedValueParams {
  type: EncryptedValueType;
  data: string;
  securityZone: number;
  utype: number;
  inputProof: string;
  userAddress: string;
}

export interface EncryptedValueJSON {
  type: EncryptedValueType;
  data: string;
  securityZone: number;
  utype: number;
  inputProof: string;
  userAddress: string;
}

export class EncryptedValue {
  readonly type: EncryptedValueType;
  readonly data: string;
  readonly securityZone: number;
  readonly utype: number;
  readonly inputProof: string;
  readonly userAddress: string;

  constructor(params: EncryptedValueParams) {
    this.type = params.type;
    this.data = params.data;
    this.securityZone = params.securityZone;
    this.utype = params.utype;
    this.inputProof = params.inputProof;
    this.userAddress = params.userAddress;
  }

  isForUser(address: string): boolean {
    return this.userAddress.toLowerCase() === address.toLowerCase();
  }

  toTuple(): [string, number, number, string] {
    return [this.data, this.securityZone, this.utype, this.inputProof];
  }

  toJSON(): EncryptedValueJSON {
    return {
      type: this.type,
      data: this.data,
      securityZone: this.securityZone,
      utype: this.utype,
      inputProof: this.inputProof,
      userAddress: this.userAddress,
    };
  }

  static fromJSON(json: unknown): EncryptedValue {
    const obj = json as EncryptedValueJSON;
    return new EncryptedValue({
      type: obj.type,
      data: obj.data,
      securityZone: obj.securityZone,
      utype: obj.utype,
      inputProof: obj.inputProof,
      userAddress: obj.userAddress,
    });
  }
}
