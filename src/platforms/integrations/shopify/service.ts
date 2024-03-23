import { Injectable } from '@nestjs/common';
import {
  ShopifyOrdersEdges,
  ShopifyLineItemEdge,
  ShopifyOrderDetails,
  ShopifyTaxLine,
  ShopifyCreatedProductOrderResponse, ShopifyCreatedProduct,
} from './types';
import { CreatedProduct, Item, Money, Order } from '../../platforms.types';

@Injectable()
export class ShopifyService {
  extractIdFromGid(gid: string): string {
    return gid.split('/').pop()!;
  }

  mapToMoney(amount: string, currencyCode: string): Money {
    return {
      amount: parseFloat(amount),
      currency: currencyCode,
    };
  }

  mapToItem(edge: ShopifyLineItemEdge): Item {
    return {
      id: this.extractIdFromGid(edge.node.id),
      name: edge.node.title,
      weight: edge.node.variant.weight.toString(),
      weightUnit: edge.node.variant.weightUnit,
      priceDetails: {
        shopPrice: this.mapToMoney(
          edge.node.variant.presentmentPrices.edges[0].node.price.amount,
          edge.node.variant.presentmentPrices.edges[0].node.price.currencyCode,
        ),
        presentmentPrice: this.mapToMoney(
          edge.node.variant.presentmentPrices.edges[0].node.price.amount,
          edge.node.variant.presentmentPrices.edges[0].node.price.currencyCode,
        ),
      },
      productId: this.extractIdFromGid(edge.node.variant.product.id),
      quantity: edge.node.quantity,
      sku: edge.node.variant.sku,
      variantId: this.extractIdFromGid(edge.node.variant.id),
      tax: {
        shopPrice: {
          amount: edge.node.taxLines.reduce((acc: number, taxLine: ShopifyTaxLine) => acc + parseFloat(taxLine.priceSet.shopMoney.amount), 0),
          currency: edge.node.taxLines[0] ? edge.node.taxLines[0].priceSet.shopMoney.currencyCode : '',
        },
        presentmentPrice: {
          amount: edge.node.taxLines.reduce((acc: number, taxLine: ShopifyTaxLine) => acc + parseFloat(taxLine.priceSet.presentmentMoney.amount), 0),
          currency: edge.node.taxLines[0] ? edge.node.taxLines[0].priceSet.presentmentMoney.currencyCode : '',
        },
      },
    };
  }

  extractItemsField(shopifyOrder: ShopifyOrderDetails): Item[] {
    return shopifyOrder.lineItems.edges.map(item => this.mapToItem(item));
  }

  public mapToOrders(shopifyEdges: ShopifyOrdersEdges): Order[] {
    const orders = shopifyEdges.edges.map((edge: ShopifyOrdersEdges['edges'][number]) => edge.node);
    return orders.map(shopifyOrder => this.mapToOrder(shopifyOrder));
  }

  public mapToOrder(shopifyOrder: ShopifyOrderDetails): Order {
    return {
      id: this.extractIdFromGid(shopifyOrder.id),
      name: shopifyOrder.name.split('#').pop()!,
      priceDetails: {
        shopPrice: this.mapToMoney(
          shopifyOrder.totalPriceSet.shopMoney.amount,
          shopifyOrder.totalPriceSet.shopMoney.currencyCode,
        ),
        presentmentPrice: this.mapToMoney(
          shopifyOrder.totalPriceSet.presentmentMoney.amount,
          shopifyOrder.totalPriceSet.presentmentMoney.currencyCode,
        ),
      },
      items: this.extractItemsField(shopifyOrder),
    };
  }

  public mapToProduct(shopifyCreatedProduct: ShopifyCreatedProduct): CreatedProduct {
    return {
      id: this.extractIdFromGid(shopifyCreatedProduct.id),
      type: shopifyCreatedProduct.productType,
      status: shopifyCreatedProduct.status.toLowerCase(),
      tags: shopifyCreatedProduct.tags,
      title: shopifyCreatedProduct.title,
      createdAt: shopifyCreatedProduct.createdAt,
      updatedAt: shopifyCreatedProduct.updatedAt,
      vendor: shopifyCreatedProduct.vendor,
    };
  }
}