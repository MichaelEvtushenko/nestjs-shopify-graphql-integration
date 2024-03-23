export interface Order {
  id: string;
  name: string;
  priceDetails: PriceDetails;
  items: Item[];
}

export interface PriceDetails {
  shopPrice: Money;
  presentmentPrice: Money;
}

export interface Item {
  id: string;
  name: string;
  weight: string;
  weightUnit: string;
  priceDetails: PriceDetails;
  productId: string;
  quantity: number;
  sku: string;
  variantId: string;
  tax: PriceDetails;
}

export interface Money {
  amount: number;
  currency: string;
}

export interface CreatedProduct {
  id: string;
  type: string;
  status: string;
  tags: string[];
  title: string;
  createdAt: string;
  updatedAt: string;
  vendor: string;
}