import { Injectable } from '@nestjs/common';
import { ShopifyPlatform } from './integrations';
import { PlatformOperationsError, PlatformOperationsErrorCode } from './platform-operations.error';
import { PlatformOperational } from './platform-operational.interface';

@Injectable()
export class PlatformsService {

  private readonly platformIntegrations: PlatformOperational[];

  /**
   * Register injectable platform integrations passed as constructor parameters by the NestJS DI container.
   */
  constructor(
    shopifyPlatform: ShopifyPlatform,
  ) {
    this.platformIntegrations = [
      shopifyPlatform,
    ];
  }

  public getPlatformOperational(id: string): PlatformOperational {
    const platform = this.platformIntegrations.find(platform => platform.platformId === id);
    if (!platform) {
      throw new PlatformOperationsError(`Platform "${id}" not supported`, PlatformOperationsErrorCode.UNSUPPORTED_PLATFORM);
    }
    return platform;
  };

}
