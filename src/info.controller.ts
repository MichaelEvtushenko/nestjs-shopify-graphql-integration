import { Controller, Get } from '@nestjs/common';
import { ApiProperty, ApiTags } from '@nestjs/swagger';

import * as os from 'os';

const { version, name } = require('../package.json');

class ServiceInfo {
  @ApiProperty()
  readonly name: string;

  @ApiProperty()
  readonly version: number;

  @ApiProperty()
  readonly hostname: string;

  @ApiProperty()
  readonly localDate: string;

  @ApiProperty()
  readonly docs: string;
}

@Controller()
@ApiTags('ServiceInfo')
export class ServiceInfoController {
  @Get()
  getServiceInfo(): ServiceInfo {
    return {
      name,
      version,
      docs: `/api/docs`,
      hostname: os.hostname(),
      localDate: new Date().toString(),
    };
  }
}
