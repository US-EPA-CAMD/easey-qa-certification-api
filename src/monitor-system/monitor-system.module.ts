import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MonitorSystemRepository } from './monitor-system.repository';
import { MonitorSystemService } from './monitor-system.service';

@Module({
  imports: [TypeOrmModule.forFeature([MonitorSystemRepository])],
  controllers: [],
  providers: [MonitorSystemRepository, MonitorSystemService],
  exports: [TypeOrmModule, MonitorSystemService],
})
export class MonitorSystemModule {}
