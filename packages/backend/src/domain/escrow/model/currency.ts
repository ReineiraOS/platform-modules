export type CurrencyType = 'fiat' | 'crypto';

export interface CurrencyParams {
  type: CurrencyType;
  code: string;
}

export class Currency {
  readonly type: CurrencyType;
  readonly code: string;

  constructor(params: CurrencyParams) {
    this.type = params.type;
    this.code = params.code;
  }
}
