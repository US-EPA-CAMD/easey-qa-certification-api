import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';

import { RoleGuard, User } from '@us-epa-camd/easey-common/decorators';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';

import {
  TransmitterTransducerAccuracyBaseDTO,
  TransmitterTransducerAccuracyDTO,
  TransmitterTransducerAccuracyRecordDTO,
} from '../dto/transmitter-transducer-accuracy.dto';
import { TransmitterTransducerAccuracyWorkspaceService } from '../transmitter-transducer-accuracy-workspace/transmitter-transducer-accuracy.service';
import { LookupType } from '@us-epa-camd/easey-common/enums';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Transmitter Transducer Accuracy')
export class TransmitterTransducerAccuracyWorkspaceController {
  constructor(
    private readonly service: TransmitterTransducerAccuracyWorkspaceService,
  ) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: TransmitterTransducerAccuracyRecordDTO,
    description:
      'Retrieves workspace Transmitter Transducer Accuracy records by Test Summary Id',
  })
  @RoleGuard(
    {
      enforceCheckout: false,
      pathParam: 'locId',
      enforceEvalSubmitCheck: false,
    },
    LookupType.Location,
  )
  getTransmitterTransducerAccuracies(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
  ) {
    return this.service.getTransmitterTransducerAccuracies(testSumId);
  }

  @Get(':id')
  @ApiOkResponse({
    isArray: false,
    type: TransmitterTransducerAccuracyDTO,
    description:
      'Retrieves official Transmitter Transducer Accuracy record by its Id',
  })
  @RoleGuard(
    {
      enforceCheckout: false,
      pathParam: 'locId',
      enforceEvalSubmitCheck: false,
    },
    LookupType.Location,
  )
  getTransmitterTransducerAccuracy(
    @Param('locId') _locationId: string,
    @Param('testSumId') _testSumId: string,
    @Param('id') id: string,
  ) {
    return this.service.getTransmitterTransducerAccuracy(id);
  }

  @Post()
  @RoleGuard(
    {
      pathParam: 'locId',
      requiredRoles: ['Preparer', 'Submitter', 'Sponsor', 'Initial Authorizer'],
      permissionsForFacility: ['DSQA'],
    },
    LookupType.Location,
  )
  @ApiCreatedResponse({
    type: TransmitterTransducerAccuracyRecordDTO,
    description:
      'Creates a Transmitter Transducer Accuracy record in the workspace',
  })
  async createTransmitterTransducerAccuracy(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Body() payload: TransmitterTransducerAccuracyBaseDTO,
    @User() user: CurrentUser,
  ): Promise<TransmitterTransducerAccuracyRecordDTO> {
    return this.service.createTransmitterTransducerAccuracy(
      testSumId,
      payload,
      user.userId,
    );
  }

  @Put(':id')
  @RoleGuard(
    {
      pathParam: 'locId',
      requiredRoles: ['Preparer', 'Submitter', 'Sponsor', 'Initial Authorizer'],
      permissionsForFacility: ['DSQA'],
    },
    LookupType.Location,
  )
  @ApiOkResponse({
    type: TransmitterTransducerAccuracyRecordDTO,
    description: 'Updates a workspace Transmitter Transducer Accuracy record',
  })
  updateTransmitterTransducerAccuracy(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('id') id: string,
    @Body() payload: TransmitterTransducerAccuracyBaseDTO,
    @User() user: CurrentUser,
  ): Promise<TransmitterTransducerAccuracyRecordDTO> {
    return this.service.updateTransmitterTransducerAccuracy(
      testSumId,
      id,
      payload,
      user.userId,
    );
  }

  @Delete(':id')
  @RoleGuard(
    {
      pathParam: 'locId',
      requiredRoles: ['Preparer', 'Submitter', 'Sponsor', 'Initial Authorizer'],
      permissionsForFacility: ['DSQA'],
    },
    LookupType.Location,
  )
  @ApiOkResponse({
    type: TransmitterTransducerAccuracyRecordDTO,
    description: 'Deletes a workspace Transmitter Transducer Accuracy record',
  })
  deleteTransmitterTransducerAccuracy(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('id') id: string,
    @User() user: CurrentUser,
  ): Promise<void> {
    return this.service.deleteTransmitterTransducerAccuracy(
      testSumId,
      id,
      user.userId,
    );
  }
}
