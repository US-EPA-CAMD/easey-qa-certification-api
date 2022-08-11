import { Module } from '@nestjs/common';
import { MonitorMethodService } from './monitor-method.service';

@Module({
  controllers: [],
  providers: [MonitorMethodService],
})
export class MonitorMethodModule {}
