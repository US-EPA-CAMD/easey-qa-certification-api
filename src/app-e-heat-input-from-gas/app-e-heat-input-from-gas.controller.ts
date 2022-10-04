import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { AppEHeatInputFromGasService } from './app-e-heat-input-from-gas.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Appendix E Heat Input From Gas')
export class AppEHeatInputFromGasController {
  constructor(private readonly service: AppEHeatInputFromGasService) {}
}
