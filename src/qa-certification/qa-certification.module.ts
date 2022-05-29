import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { QACertificationController } from './qa-certification.controller';
import { QACertificationService } from './qa-certification.service';

@Module({
  imports: [TypeOrmModule.forFeature([])],
  controllers: [QACertificationController],
  providers: [QACertificationService],
})
export class QACertificationModule {}
