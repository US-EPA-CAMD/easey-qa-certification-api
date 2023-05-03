import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MonitorMethodRepository } from './monitor-method.repository';

@Module({
  imports: [TypeOrmModule.forFeature([MonitorMethodRepository])],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule],
})
export class MonitorMethodModule {}
