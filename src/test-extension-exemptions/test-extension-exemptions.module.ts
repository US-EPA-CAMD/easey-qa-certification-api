import { Module } from '@nestjs/common';
import { TestExtensionExemptionsService } from './test-extension-exemptions.service';
import { TestExtensionExemptionsController } from './test-extension-exemptions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestExtensionExemptionsRepository } from './test-extension-exemptions.repository';
import { TestExtensionExemptionMap } from '../maps/test-extension-exemption.map';
import { HttpModule } from '@nestjs/axios';

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
    TestExtensionExemptionsService,
  ],
})
export class TestExtensionExemptionsModule {}
