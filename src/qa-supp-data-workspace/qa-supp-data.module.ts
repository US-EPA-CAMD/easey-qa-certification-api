import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { QASuppDataWorkspaceRepository } from './qa-supp-data.repository';
import { QASuppDataWorkspaceService } from './qa-supp-data.service';

@Module({
  imports: [TypeOrmModule.forFeature([QASuppDataWorkspaceRepository])],
  controllers: [],
  providers: [QASuppDataWorkspaceRepository, QASuppDataWorkspaceService],
  exports: [
    TypeOrmModule,
    QASuppDataWorkspaceRepository,
    QASuppDataWorkspaceService,
  ],
})
export class QASuppDataWorkspaceModule {}
