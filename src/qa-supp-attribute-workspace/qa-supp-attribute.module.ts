import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestSummaryModule } from '../test-summary/test-summary.module';
import { QASuppAttributeWorkspaceRepository } from './qa-supp-attribute.repository';
import { QASuppAttributeWorkspaceService } from './qa-supp-attribute.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([QASuppAttributeWorkspaceRepository]),
    forwardRef(() => TestSummaryModule),
  ],
  controllers: [],
  providers: [
    QASuppAttributeWorkspaceRepository,
    QASuppAttributeWorkspaceService,
],
  exports: [
    TypeOrmModule, 
    QASuppAttributeWorkspaceRepository,
    QASuppAttributeWorkspaceService,
],
})
export class QASuppAttributeWorkspaceModule {}