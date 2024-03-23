import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { PinoLogger } from 'nestjs-pino';

import {
  RawApiResponse,
  ShopifyApiErrorResponse,
  ShopifyApiResponse, ShopifyCreatedProductOrderResponse,
  ShopifyOrderResponseById,
  ShopifyOrdersListResponse,
} from '../types';

import QUERY_SHOPIFY_GET_ORDER_BY_ID from './graphql/shopify-order-by-id.query';
import QUERY_SHOPIFY_GET_ORDERS from './graphql/shopify-orders.query';
import MUTATION_CREATE_PRODUCT from './graphql/create-product.mutation';
import { CreateProductDto } from '../../../dto';

@Injectable()
export class ShopifyApi {
  private readonly rootGraphQlUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly logger: PinoLogger,
  ) {
    const shopifyConfig = this.configService.get('shopify');
    this.rootGraphQlUrl = this.constructRootGraphqlUrl(
      shopifyConfig.apiKey,
      shopifyConfig.password,
      shopifyConfig.storeUrl,
      shopifyConfig.apiVersion,
    );
  }

  private constructRootGraphqlUrl(apiKey: string, password: string, storeUrl: string, apiVersion: string): string {
    return `https://${apiKey}:${password}@${storeUrl}/admin/api/${apiVersion}/graphql.json`;
  }

  /**
   * note: the typed versions of `graphql-client` or `graphql` package can also be used
   * with the graphql schema: https://github.com/Shopify/shopify-api-js/blob/main/packages/shopify-api/docs/guides/graphql-types.md
   */
  async makeGraphqlRequest<T>(query: string, variables: Record<string, any> = {}): RawApiResponse<T> {
    try {
      return await this.httpService.axiosRef.post(
        this.rootGraphQlUrl,
        {
          query,
          variables,
        },
      );
    } catch (error) {
      this.logger.error('Shopify GraphQL API request error:', error);
      throw error;
    }
  }

  async getOrderDetails(orderId: number): RawApiResponse<ShopifyOrderResponseById> {
    const variables = {
      id: `gid://shopify/Order/${orderId}`,
    };

    return await this.makeGraphqlRequest<ShopifyOrderResponseById>(QUERY_SHOPIFY_GET_ORDER_BY_ID, variables);
  }

  async getOrdersList(): RawApiResponse<ShopifyOrdersListResponse> {
    return await this.makeGraphqlRequest<ShopifyOrdersListResponse>(QUERY_SHOPIFY_GET_ORDERS);
  }

  async createProduct(productDto: CreateProductDto): RawApiResponse<ShopifyCreatedProductOrderResponse> {
    const variables = {
      input: {
        title: productDto.title,
        descriptionHtml: productDto.description,
        vendor: productDto.vendor,
        productType: productDto.type,
        tags: productDto.tags?.join(',') || [],
      },
    };

    return await this.makeGraphqlRequest<ShopifyCreatedProductOrderResponse>(MUTATION_CREATE_PRODUCT, variables);
  }

  public isSuccessApiResponse(shopifyApiResponse: unknown): shopifyApiResponse is ShopifyApiResponse {
    const successApiResponse = shopifyApiResponse as ShopifyApiResponse;
    const errorApiResponse = shopifyApiResponse as ShopifyApiErrorResponse;
    return Boolean(
      'data' in successApiResponse
      && successApiResponse.extensions
      && !errorApiResponse.errors?.length,
    );
  }
}