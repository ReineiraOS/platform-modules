export type BusinessType = 'RETAIL' | 'SERVICE';

export interface BusinessProfileParams {
  id: string;
  userId: string;
  businessName: string;
  businessType: BusinessType;
  businessAddress?: string;
  taxId?: string;
}

export class BusinessProfile {
  readonly id: string;
  readonly userId: string;
  readonly businessName: string;
  readonly businessType: BusinessType;
  readonly businessAddress?: string;
  readonly taxId?: string;

  constructor(params: BusinessProfileParams) {
    this.id = params.id;
    this.userId = params.userId;
    this.businessName = params.businessName;
    this.businessType = params.businessType;
    this.businessAddress = params.businessAddress;
    this.taxId = params.taxId;
  }
}
