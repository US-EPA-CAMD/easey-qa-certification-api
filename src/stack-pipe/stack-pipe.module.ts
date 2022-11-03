import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StackPipeRepository } from './stack-pipe.repository';

@Module({
  imports: [TypeOrmModule.forFeature([StackPipeRepository])],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule],
})
export class StackPipeModule {}
