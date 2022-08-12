import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MonitorMethodRepository } from './monitor-method.repository';
import { MonitorMethodService } from './monitor-method.service';

@Module({
  imports: [TypeOrmModule.forFeature([MonitorMethodRepository])],
  controllers: [],
  providers: [MonitorMethodService],
  exports: [TypeOrmModule, MonitorMethodService],
})
export class MonitorMethodModule {}
