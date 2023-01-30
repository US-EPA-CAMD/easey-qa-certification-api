import { HttpStatus, Injectable } from '@nestjs/common';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { InjectRepository } from '@nestjs/typeorm';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import {AppEHeatInputFromGasBaseDTO, AppEHeatInputFromGasImportDTO} from "../dto/app-e-heat-input-from-gas.dto";
import {AppECorrelationTestRun} from "../entities/workspace/app-e-correlation-test-run.entity";
import {
    AppECorrelationTestRunWorkspaceRepository
} from "../app-e-correlation-test-run-workspace/app-e-correlation-test-run-workspace.repository";
import {AppEHeatInputFromGasWorkspaceRepository} from "./app-e-heat-input-from-gas-workspace.repository";

@Injectable()
export class AppEHeatInputFromGasChecksService {
    constructor(
        private readonly logger: Logger,
        @InjectRepository(AppECorrelationTestRunWorkspaceRepository)
        private readonly appETestRunRepo: AppECorrelationTestRunWorkspaceRepository,
        @InjectRepository(AppEHeatInputFromGasWorkspaceRepository)
        private readonly repo: AppEHeatInputFromGasWorkspaceRepository
    ) {}

    private throwIfErrors(errorList: string[]) {
        if (errorList.length > 0) {
            throw new LoggingException(errorList, HttpStatus.BAD_REQUEST);
        }
    }

    async runChecks(
        dto: AppEHeatInputFromGasBaseDTO | AppEHeatInputFromGasImportDTO,
        appEHeatInputFromGasId: string,
        appETestRunId: string,
    ): Promise<string[]> {
        let error: string = null;
        const errorList: string[] = [];

        this.logger.info('Running Appendix E Heat Input From Gas Checks');

        const appETestRun = await this.appETestRunRepo.findOneWithAncestors(appETestRunId);

        error = await this.appE51Check(appEHeatInputFromGasId, dto, appETestRun);
        if (error) {
            errorList.push(error);
        }

        this.throwIfErrors(errorList);
        this.logger.info('Completed Appendix E Heat Input From Gas Checks');
        return errorList;
    }

    async appE51Check(
        aehiGasId: string,
        dto: AppEHeatInputFromGasBaseDTO,
        appETestRun: AppECorrelationTestRun,
    ) {
        let error: string = null;
        let appETestSummary = appETestRun.appECorrelationTestSummary;
        let testSummary = appETestSummary.testSummary;

        if(dto.monitoringSystemID && appETestRun.runNumber && appETestSummary.operatingLevelForRun) {
            const duplicate = await this.repo.findDuplicate(aehiGasId, testSummary.id,
                appETestSummary.operatingLevelForRun, appETestRun.runNumber, dto.monitoringSystemID);

            if(duplicate)
                error = this.getMessage('APPE-51-A', {
                    recordtype: 'Appendix E Heat Input From Gas',
                    fieldnames: 'OperatingLevelForRun, RunNumber, MonitoringSystemID',
                });
        }

        return error;
    }
    getMessage(messageKey: string, messageArgs: object): string {
        return CheckCatalogService.formatResultMessage(messageKey, messageArgs);
    }
}