import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WhatHasDataService } from './what-has-data.service';
import { WhatHasDataController } from './what-has-data.controller';
import { MonitorLocationRepository } from '../monitor-location/monitor-location.repository';

@Module({
  imports: [TypeOrmModule.forFeature([MonitorLocationRepository])],
  controllers: [WhatHasDataController],
  providers: [WhatHasDataService],
})
export class WhatHasDataModule {}
