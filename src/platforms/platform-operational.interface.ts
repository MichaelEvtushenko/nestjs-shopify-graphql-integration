import { CreateProductDto } from './dto';
import { CreatedProduct, Order } from './platforms.types';

/**
 * The core platform operations any platform integration must implement.
 */
export interface PlatformOperational {
  getOrderById(id: number): Promise<Order>;

  getOrderList(): Promise<Order[]>;

  createProduct(productDto: CreateProductDto): Promise<CreatedProduct>;

  platformId: string;
}
