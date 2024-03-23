import { Injectable } from '@nestjs/common';
import { CreatedProduct, Order } from '../../platforms.types';
import { ShopifyApi } from './api';
import { ShopifyService } from './service';
import { PlatformOperationsError, PlatformOperationsErrorCode } from '../../platform-operations.error';
import { PinoLogger } from 'nestjs-pino';
import { RawApiResponse, ShopifyApiResponse } from './types';
import { CreateProductDto } from '../../dto';
import { PlatformOperational } from '../../platform-operational.interface';


@Injectable()
export class ShopifyPlatform implements PlatformOperational {

  public readonly platformId = 'shopify';

  constructor(
    private readonly logger: PinoLogger,
    private readonly shopifyApi: ShopifyApi,
    private readonly shopifyService: ShopifyService,
  ) {
    this.logger.setContext(ShopifyPlatform.name);
  }

  async getOrderById(id: number): Promise<Order> {
    const shopifyApiResponse = await this.handleRawApiResponse(this.shopifyApi.getOrderDetails(id));

    const shopifyOrder = shopifyApiResponse.data.order;
    if (!shopifyOrder) {
      throw new PlatformOperationsError(`Shopify order with ID: "${id}" not found`, PlatformOperationsErrorCode.ORDER_NOT_FOUND);
    }

    /**
     * note: we can also transform the result object to Order class
     * and validate using `class-transform` to ensure all the order fields are in place
     */
    const order = this.shopifyService.mapToOrder(shopifyOrder);

    return order;
  }

  async getOrderList(): Promise<Order[]> {
    const shopifyApiResponse = await this.handleRawApiResponse(this.shopifyApi.getOrdersList());

    const shopifyOrders = shopifyApiResponse.data.orders;
    if (!shopifyOrders) {
      throw new PlatformOperationsError('Shopify orders not found', PlatformOperationsErrorCode.ORDERS_LIST_NOT_FOUND);
    }

    const orders = this.shopifyService.mapToOrders(shopifyOrders);

    return orders;
  }

  /**
   * TODO: the api request fails with the following error:
   * "Access denied for productCreate field. Required access: `write_products` access scope. Also: The user must have a permission to create products."
   * @param productDto
   */
  async createProduct(productDto: CreateProductDto): Promise<CreatedProduct> {
    const response = await this.shopifyApi.createProduct(productDto);
    throw new Error();
  }

  /**
   * Ensures that response from Shopify API is successful with no errors.
   */
  private async handleRawApiResponse<T>(rawApiResponse: RawApiResponse<T>): Promise<ShopifyApiResponse<T>> {
    const shopifyRawApiResponse = await rawApiResponse;
    const shopifyApiResponse = shopifyRawApiResponse.data;

    if (!this.shopifyApi.isSuccessApiResponse((shopifyApiResponse))) {
      const errors = shopifyApiResponse.errors.reduce((message, error) => message + '; ' + error.message, '');
      const message = `Shopify API returned errors: ${errors}`;
      throw new PlatformOperationsError(message, PlatformOperationsErrorCode.PLATFORM_BAD_REQUEST);
    }

    return shopifyApiResponse;
  }
}