import { Module } from '@nestjs/common';

import { MonitorLocationModule } from '../monitor-location/monitor-location.module';
import { WhatHasDataController } from './what-has-data.controller';
import { WhatHasDataService } from './what-has-data.service';

@Module({
  imports: [MonitorLocationModule],
  controllers: [WhatHasDataController],
  providers: [WhatHasDataService],
})
export class WhatHasDataModule {}
