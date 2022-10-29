import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MonitorLocationRepository } from './monitor-location.repository';

@Module({
  imports: [TypeOrmModule.forFeature([MonitorLocationRepository])],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule],
})
export class MonitorLocationModule {}
