import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TestExtensionExemptionMap } from '../maps/test-extension-exemption.map';
import { TestExtensionExemptionsController } from './test-extension-exemptions.controller';
import { TestExtensionExemptionsRepository } from './test-extension-exemptions.repository';
import { TestExtensionExemptionsService } from './test-extension-exemptions.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TestExtensionExemptionsRepository]),
    HttpModule,
  ],
  controllers: [TestExtensionExemptionsController],
  providers: [TestExtensionExemptionMap, TestExtensionExemptionsService],
  exports: [
    TypeOrmModule,
    TestExtensionExemptionMap,
    TestExtensionExemptionsRepository,
    TestExtensionExemptionsService,
  ],
})
export class TestExtensionExemptionsModule {}
