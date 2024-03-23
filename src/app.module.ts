import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { LoggerModule } from 'nestjs-pino';

import { PlatformsService } from './platforms/platforms.service';
import { ServiceInfoController } from './info.controller';
import { PlatformsModule } from './platforms/platforms.module';
import { PlatformsController } from './platforms/platforms.controller';
import { ShopifyPlatform } from './platforms/integrations/shopify';
import { ShopifyService } from './platforms/integrations/shopify/service';
import { ShopifyApi } from './platforms/integrations/shopify/api';
import configuration from './config/configuration';


@Module({
  imports: [
    HttpModule,
    LoggerModule.forRoot({}),
    ConfigModule.forRoot({
    envFilePath: '.env',
    isGlobal: true,
    load: [configuration],
  }), PlatformsModule],
  controllers: [PlatformsController, ServiceInfoController],
  providers: [ConfigService, PlatformsService, ShopifyPlatform, ShopifyService, ShopifyApi],
})
export class AppModule {
}
