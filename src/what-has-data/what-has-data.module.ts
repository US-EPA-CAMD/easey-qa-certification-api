import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MonitorLocationRepository } from '../monitor-location/monitor-location.repository';
import { WhatHasDataController } from './what-has-data.controller';
import { WhatHasDataService } from './what-has-data.service';

@Module({
  imports: [TypeOrmModule.forFeature([MonitorLocationRepository])],
  controllers: [WhatHasDataController],
  providers: [MonitorLocationRepository, WhatHasDataService],
})
export class WhatHasDataModule {}
