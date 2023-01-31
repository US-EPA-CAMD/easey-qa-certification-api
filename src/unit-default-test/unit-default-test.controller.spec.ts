import { Test, TestingModule } from '@nestjs/testing';
import { UnitDefaultTestRecordDTO } from '../dto/unit-default-test.dto';
import { UnitDefaultTestController } from './unit-default-test.controller';
import { UnitDefaultTestService } from './unit-default-test.service';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';

const locId = '';
const id = '';
const testSumId = '';
const user: CurrentUser = {
  userId: 'testUser',
  sessionId: '',
  expiration: '',
  clientIp: '',
  isAdmin: false,
  permissionSet: [],
};
const dto = new UnitDefaultTestRecordDTO();

const mockService = () => ({
  getUnitDefaultTest: jest.fn().mockResolvedValue(dto),
  getUnitDefaultTests: jest.fn().mockResolvedValue([dto]),
});

describe('UnitDefaultTestController', () => {
  let controller: UnitDefaultTestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UnitDefaultTestController],
      providers: [
        {
          provide: UnitDefaultTestService,
          useFactory: mockService,
        },
      ],
    }).compile();

    controller = module.get<UnitDefaultTestController>(
      UnitDefaultTestController,
    );
  });

  describe('getUnitDefaultTest', () => {
    it('Calls the service to get a Unit Default Test record', async () => {
      const result = await controller.getUnitDefaultTest(locId, testSumId, id);
      expect(result).toEqual(dto);
    });
  });

  describe('getUnitDefaultTests', () => {
    it('Calls the service to many Unit Default Test records', async () => {
      const result = await controller.getUnitDefaultTests(locId, testSumId);
      expect(result).toEqual([dto]);
    });
  });
});
