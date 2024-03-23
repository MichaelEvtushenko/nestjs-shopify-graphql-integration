import { AxiosResponse } from 'axios';

/**
 * Successful Shopify API response containing the actual data.
 */
export interface ShopifyApiResponse<T = any> {
  data: T;
  extensions: {
    cost: {
      requestedQueryCost: number;
      actualQueryCost: number;
      throttleStatus: {
        maximumAvailable: number;
        currentlyAvailable: number;
        restoreRate: number;
      }
    }
  };
}

export interface ShopifyApiErrorResponse<T = any> {
  errors: {
    // note: based on type of error might contain other fields
    message: string;
  }[];
}

export type RawApiResponse<T> = Promise<AxiosResponse<ShopifyApiErrorResponse | ShopifyApiResponse<T>>>;

export interface ShopifyOrderResponseById {
  order: ShopifyOrderDetails | null;
}

export interface ShopifyCreatedProduct {
  id: string;
  title: string;
  tags: string[];
  productType: string;
  vendor: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export interface ShopifyCreatedProductOrderResponse {
  productCreate: {
    product: ShopifyCreatedProduct;
    userErrors: {
      field: string[];
      message: string;
    }[];
  };
}


export interface ShopifyOrdersEdges {
  edges: {
    cursor: string;
    node: ShopifyOrderDetails;
  }[];
}

export interface ShopifyOrdersListResponse {
  orders: ShopifyOrdersEdges | null;
}

export interface ShopifyOrderDetails {
  id: string;
  name: string;
  totalPriceSet: ShopifyTotalPriceSet;
  lineItems: ShopifyLineItems;
}

export interface ShopifyTotalPriceSet {
  shopMoney: ShopifyMoney;
  presentmentMoney: ShopifyMoney;
}

export interface ShopifyLineItems {
  edges: ShopifyLineItemEdge[];
}

export interface ShopifyLineItemEdge {
  node: ShopifyLineItemNode;
}

export interface ShopifyLineItemNode {
  id: string;
  title: string;
  quantity: number;
  variant: ShopifyVariant;
  taxLines: ShopifyTaxLine[];
}

export interface ShopifyVariant {
  id: string;
  sku: string;
  product: ShopifyProduct;
  weight: number;
  weightUnit: ShopifyWeightUnit;
  presentmentPrices: ShopifyPresentmentPrices;
}

export interface ShopifyProduct {
  id: string;
}

export interface ShopifyPresentmentPrices {
  edges: ShopifyPriceEdge[];
}

export interface ShopifyPriceEdge {
  node: ShopifyPriceNode;
}

export interface ShopifyPriceNode {
  price: ShopifyMoney;
}

export interface ShopifyTaxLine {
  priceSet: {
    shopMoney: ShopifyMoney;
    presentmentMoney: ShopifyMoney;
  };
}

export interface ShopifyMoney {
  amount: string;
  currencyCode: string;
}

export type ShopifyWeightUnit = 'KILOGRAMS' | 'POUNDS';