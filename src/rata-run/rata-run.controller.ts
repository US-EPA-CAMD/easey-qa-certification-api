import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { RataRunDTO } from '../dto/rata-run.dto';
import { RataRunService } from './rata-run.service';

@Controller()
@ApiTags('Rata Run')
export class RataRunController {

  constructor(private readonly service: RataRunService) { }
  @Get()
  @ApiOkResponse({
    isArray: true,
    type: RataRunDTO,
    description: 'Retrieves official Rata Run records by Rata Summary Id'
  })
  async getRataRuns(@Param('locId') _locationId: string,
                    @Param('testSumId') _testSumId: string,
                    @Param('rataId') _rataId: string,
                    @Param('rataSumId') rataSumId: string
  ): Promise<RataRunDTO[]> {
    return this.service.getRataRuns(rataSumId);
  }

  @Get(':id')
  @ApiOkResponse({
    isArray: false,
    type: RataRunDTO,
    description: 'Retrieves official Rata Run record by its Id'
  })
  async getRataRun(@Param('locId') _locationId: string,
                       @Param('testSumId') _testSumId: string,
                       @Param('rataId') _rataId: string,
                       @Param('rataSumId') _rataSumId: string,
                       @Param('rataRunId') rataRunId: string
  ): Promise<RataRunDTO> {
    return this.service.getRataRun(rataRunId);
  }
}