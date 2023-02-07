import { Module } from '@nestjs/common';
import { ReferenceMethodCodeService } from './reference-method-code.service';
import { ReferenceMethodCodeController } from './reference-method-code.controller';

@Module({
  controllers: [ReferenceMethodCodeController],
  providers: [ReferenceMethodCodeService]
})
export class ReferenceMethodCodeModule {}
