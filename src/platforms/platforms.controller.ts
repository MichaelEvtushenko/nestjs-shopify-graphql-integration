import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { PlatformsService } from './platforms.service';
import { CreateProductDto } from './dto';

@Controller()
export class PlatformsController {
  constructor(private readonly platformsService: PlatformsService) {
  }

  @Get('/order/:platformId/:orderId')
  async getOrderById(
    @Param('orderId', ParseIntPipe) orderId: number,
    @Param('platformId') platformId: string,
  ) {
    const platform = this.platformsService.getPlatformOperational(platformId);

    const order = await platform.getOrderById(orderId);

    return order;
  }

  @Get('/orders/:platformId')
  async getOrders(
    @Param('platformId') platformId: string,
  ) {
    const platform = this.platformsService.getPlatformOperational(platformId);

    const orders = await platform.getOrderList();

    return orders;
  }

  @Post('/products/:platformId')
  async createProduct(
    @Body() createProductDto: CreateProductDto,
    @Param('platformId') platformId: string
  ) {
    const platform = this.platformsService.getPlatformOperational(platformId);

    const product = await platform.createProduct(createProductDto);

    return product;
  }
}
