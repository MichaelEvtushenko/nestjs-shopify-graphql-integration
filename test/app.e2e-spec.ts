import { Test, TestingModule } from '@nestjs/testing';
import { PlatformsController } from '../src/platforms/platforms.controller';
import { PlatformsService } from '../src/platforms/platforms.service';
import { ShopifyPlatform } from '../src/platforms/integrations';
import { ShopifyApi } from '../src/platforms/integrations/shopify/api';
import { PinoLogger } from 'nestjs-pino';
import { ShopifyService } from '../src/platforms/integrations/shopify/service';
import { ShopifyOrderResponseById } from '../src/platforms/integrations/shopify/types';
import { PlatformOperationsError, PlatformOperationsErrorCode } from '../src/platforms/platform-operations.error';

jest.mock('../src/platforms/integrations/shopify/api/index');
jest.mock('nestjs-pino');

describe('PlatformsController', () => {
  let controller: PlatformsController;
  let platformsService: PlatformsService;
  let shopifyApi: ShopifyApi;
  let shopifyService: ShopifyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlatformsController],
      providers: [
        PlatformsService,
        ShopifyApi,
        PinoLogger,
      ],
    }).compile();

    controller = module.get<PlatformsController>(PlatformsController);
    platformsService = module.get<PlatformsService>(PlatformsService);
    shopifyApi = module.get<ShopifyApi>(ShopifyApi);

    jest.spyOn(platformsService, 'getPlatformOperational').mockImplementation(() => new ShopifyPlatform(new PinoLogger({}), shopifyApi, shopifyService));
  });

  it('should return an order for a valid ID', async () => {
    const mockOrderResponse: ShopifyOrderResponseById = {
      order: {
        id: "4985632194693",
        name: "1011",
        totalPriceSet: {
          shopMoney: { amount: "100", currencyCode: "EUR" },
          presentmentMoney: { amount: "100", currencyCode: "EUR" }
        },
        lineItems: {
          edges: [
            {
              node: {
                id: "12300605751429",
                title: "Dumbbells",
                quantity: 1,
                variant: {
                  id: "40498848170117",
                  sku: "1231ffrfdgadsa434",
                  product: { id: "6914492137605" },
                  weight: 12,
                  weightUnit: "KILOGRAMS",
                  presentmentPrices: {
                    edges: [
                      {
                        node: {
                          price: { amount: "100", currencyCode: "EUR" },
                        },
                      },
                    ],
                  },
                },
                taxLines: [
                  {
                    priceSet: {
                      shopMoney: { amount: "10", currencyCode: "EUR" },
                      presentmentMoney: { amount: "10", currencyCode: "EUR" },
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    };

    jest.spyOn(shopifyApi, 'getOrderDetails').mockResolvedValue(Promise.resolve({ data: mockOrderResponse }) as any);

    const platformId = 'shopify';
    const orderId = 4985632194693;
    const result = await controller.getOrderById(orderId, platformId);

    expect(result).toBeDefined();
    expect(result.id).toEqual((mockOrderResponse.order as any).id);
    expect(result.items.length).toBeGreaterThan(0);
    expect(shopifyApi.getOrderDetails).toHaveBeenCalledWith(orderId);
  });

  it('should throw an error if the order is not found', async () => {
    jest.spyOn(shopifyApi, 'getOrderDetails').mockResolvedValue(Promise.resolve({ data: { order: null } } as any));

    const platformId = 'shopify';
    const orderId = 4985632194693;

    await expect(controller.getOrderById(orderId, platformId))
      .rejects
      .toThrow(new PlatformOperationsError(`Shopify order with ID: "${orderId}" not found`, PlatformOperationsErrorCode.ORDER_NOT_FOUND));
  });
});