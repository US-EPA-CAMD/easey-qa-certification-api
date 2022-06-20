import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { QASuppDataWorkspaceRepository } from './qa-supp-data.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      QASuppDataWorkspaceRepository
    ])
  ],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule],
})
export class QASuppDataWorkspaceModule {}
