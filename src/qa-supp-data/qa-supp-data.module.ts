import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { QASuppDataRepository } from './qa-supp-data.repository';

@Module({
  imports: [TypeOrmModule.forFeature([QASuppDataRepository])],
  controllers: [],
  providers: [QASuppDataRepository],
  exports: [
    TypeOrmModule,
    QASuppDataRepository,
  ],
})
export class QASuppDataModule {}
