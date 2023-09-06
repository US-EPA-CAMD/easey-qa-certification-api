import { TestSummaryDTO } from '../dto/test-summary.dto';
import { QACertificationDTO } from '../dto/qa-certification.dto';
import { CalibrationInjectionDTO } from '../dto/calibration-injection.dto';
import { LinearitySummaryDTO } from '../dto/linearity-summary.dto';
import { LinearityInjectionDTO } from '../dto/linearity-injection.dto';
import { RataDTO } from '../dto/rata.dto';
import { RataSummaryDTO } from '../dto/rata-summary.dto';
import { RataRunDTO } from '../dto/rata-run.dto';
import { FlowRataRunDTO } from '../dto/flow-rata-run.dto';
import { RataTraverseDTO } from '../dto/rata-traverse.dto';
import { FlowToLoadReferenceDTO } from '../dto/flow-to-load-reference.dto';
import { FlowToLoadCheckDTO } from '../dto/flow-to-load-check.dto';
import { CycleTimeSummaryDTO } from '../dto/cycle-time-summary.dto';
import { CycleTimeInjectionDTO } from '../dto/cycle-time-injection.dto';
import { OnlineOfflineCalibrationDTO } from '../dto/online-offline-calibration.dto';
import { FuelFlowmeterAccuracyDTO } from '../dto/fuel-flowmeter-accuracy.dto';
import { TransmitterTransducerAccuracyDTO } from '../dto/transmitter-transducer-accuracy.dto';
import { FuelFlowToLoadBaselineDTO } from '../dto/fuel-flow-to-load-baseline.dto';
import { FuelFlowToLoadTestDTO } from '../dto/fuel-flow-to-load-test.dto';
import { AppECorrelationTestSummaryDTO } from '../dto/app-e-correlation-test-summary.dto';
import { AppECorrelationTestRunDTO } from '../dto/app-e-correlation-test-run.dto';
import { AppEHeatInputFromOilDTO } from '../dto/app-e-heat-input-from-oil.dto';
import { AppEHeatInputFromGasDTO } from '../dto/app-e-heat-input-from-gas.dto';
import { UnitDefaultTestDTO } from '../dto/unit-default-test.dto';
import { UnitDefaultTestRunDTO } from '../dto/unit-default-test-run.dto';
import { HgSummaryDTO } from '../dto/hg-summary.dto';
import { HgInjectionDTO } from '../dto/hg-injection.dto';
import { TestQualificationDTO } from '../dto/test-qualification.dto';
import { ProtocolGasDTO } from '../dto/protocol-gas.dto';
import { AirEmissionTestingDTO } from '../dto/air-emission-test.dto';
import { QACertificationEventDTO } from '../dto/qa-certification-event.dto';
import { TestExtensionExemptionDTO } from '../dto/test-extension-exemption.dto';

export async function removeNonReportedValues(dto: QACertificationDTO) {
  const promises = [];
  promises.push(removeTestSummaryNonReportedValues(dto.testSummaryData));
  promises.push(
    removeCertificationEventNonReportedValues(dto.certificationEventData),
  );
  promises.push(
    removeTestExtensionExemptionNonReportedValues(
      dto.testExtensionExemptionData,
    ),
  );

  await Promise.all(promises);
}

async function removeTestSummaryNonReportedValues(
  testSummaryData: TestSummaryDTO[],
) {
  const promises = [];
  testSummaryData?.forEach(dto => {
    promises.push(
      removeCalibrationInjectionNonReportedValues(dto.calibrationInjectionData),
      removeLinearitySummaryNonReportedValues(dto.linearitySummaryData),
      removeRataNonReportedValues(dto.rataData),
      removeFlowToLoadReferenceNonReportedValues(dto.flowToLoadReferenceData),
      removeFlowToLoadCheckNonReportedValues(dto.flowToLoadCheckData),
      removeCycleTimeSummaryNonReportedValues(dto.cycleTimeSummaryData),
      removeOnlineOfflineCalibrationNonReportedValues(
        dto.onlineOfflineCalibrationData,
      ),
      removeFuelFlowmeterAccuracyNonReportedValues(
        dto.fuelFlowmeterAccuracyData,
      ),
      removeTransmitterTransducerAccuracyNonReportedValues(
        dto.transmitterTransducerData,
      ),
      removeFuelFlowToLoadBaselineNonReportedValues(
        dto.fuelFlowToLoadBaselineData,
      ),
      removeFuelFlowToLoadTestNonReportedValues(dto.fuelFlowToLoadTestData),
      removeAppECorrelationTestSummaryNonReportedValues(
        dto.appECorrelationTestSummaryData,
      ),
      removeUnitDefaultTestNonReportedValues(dto.unitDefaultTestData),
      removeHgSummaryNonReportedValues(dto.hgSummaryData),
      removeTestQualificationNonReportedValues(dto.testQualificationData),
      removeProtocolGasNonReportedValues(dto.protocolGasData),
      removeAirEmissionTestingNonReportedValues(dto.airEmissionTestingData),
    );
    delete dto.id;
    delete dto.locationId;
    delete dto.calculatedGracePeriodIndicator;
    delete dto.calculatedTestResultCode;
    delete dto.reportPeriodId;
    delete dto.calculatedSpanValue;
    delete dto.userId;
    delete dto.addDate;
    delete dto.updateDate;
    delete dto.evalStatusCode;
  });

  await Promise.all(promises);
}

async function removeCalibrationInjectionNonReportedValues(
  calibrationInjectionData: CalibrationInjectionDTO[],
) {
  calibrationInjectionData?.forEach(dto => {
    delete dto.id;
    delete dto.testSumId;
    delete dto.calculatedZeroCalibrationError;
    delete dto.calculatedZeroAPSIndicator;
    delete dto.calculatedUpscaleCalibrationError;
    delete dto.calculatedUpscaleAPSIndicator;
    delete dto.userId;
    delete dto.addDate;
    delete dto.updateDate;
  });
}

async function removeLinearitySummaryNonReportedValues(
  linearitySummaryData: LinearitySummaryDTO[],
) {
  const promises = [];
  linearitySummaryData?.forEach(dto => {
    promises.push(
      removeLinearityInjectionNonReportedValues(dto.linearityInjectionData),
    );
    delete dto.id;
    delete dto.testSumId;
    delete dto.calculatedMeanReferenceValue;
    delete dto.calculatedMeanMeasuredValue;
    delete dto.calculatedPercentError;
    delete dto.calculatedAPSIndicator;
    delete dto.userId;
    delete dto.addDate;
    delete dto.updateDate;
  });
  await Promise.all(promises);
}

async function removeLinearityInjectionNonReportedValues(
  linearityInjectionData: LinearityInjectionDTO[],
) {
  linearityInjectionData?.forEach(dto => {
    delete dto.id;
    delete dto.linSumId;
    delete dto.userId;
    delete dto.addDate;
    delete dto.updateDate;
  });
}

async function removeRataNonReportedValues(rataData: RataDTO[]) {
  const promises = [];
  rataData?.forEach(dto => {
    promises.push(removeRataSummaryNonReportedValues(dto.rataSummaryData));
    delete dto.id;
    delete dto.testSumId;
    delete dto.calculatedRataFrequencyCode;
    delete dto.calculatedRelativeAccuracy;
    delete dto.calculatedOverallBiasAdjustmentFactor;
    delete dto.calculatedNumberOfLoadLevel;
    delete dto.userId;
    delete dto.addDate;
    delete dto.updateDate;
  });
  await Promise.all(promises);
}

async function removeRataSummaryNonReportedValues(
  rataSummary: RataSummaryDTO[],
) {
  const promises = [];
  rataSummary?.forEach(dto => {
    promises.push(removeRataRunNonReportedValues(dto.rataRunData));
    delete dto.id;
    delete dto.rataId;
    delete dto.calculatedAverageGrossUnitLoad;
    delete dto.calculatedMeanCEMValue;
    delete dto.calculatedMeanRATAReferenceValue;
    delete dto.calculatedMeanDifference;
    delete dto.calculatedStandardDeviationDifference;
    delete dto.calculatedConfidenceCoefficient;
    delete dto.calculatedTValue;
    delete dto.calculatedApsIndicator;
    delete dto.calculatedRelativeAccuracy;
    delete dto.calculatedBiasAdjustmentFactor;
    delete dto.calculatedStackArea;
    delete dto.calculatedCalculatedWAF;
    delete dto.userId;
    delete dto.addDate;
    delete dto.updateDate;
  });
  await Promise.all(promises);
}

async function removeRataRunNonReportedValues(rataRun: RataRunDTO[]) {
  const promises = [];
  rataRun?.forEach(dto => {
    promises.push(removeflowRataRunNonReportedValues(dto.flowRataRunData));
    delete dto.id;
    delete dto.rataSumId;
    delete dto.calculatedRataReferenceValue;
    delete dto.userId;
    delete dto.addDate;
    delete dto.updateDate;
  });
  await Promise.all(promises);
}

async function removeflowRataRunNonReportedValues(
  flowRataRun: FlowRataRunDTO[],
) {
  const promises = [];
  flowRataRun?.forEach(dto => {
    promises.push(removeRataTraverseNonReportedValues(dto.rataTraverseData));
    delete dto.id;
    delete dto.rataRunId;
    delete dto.calculatedDryMolecularWeight;
    delete dto.calculatedWetMolecularWeight;
    delete dto.calculatedAverageVelocityWithoutWallEffects;
    delete dto.calculatedAverageVelocityWithWallEffects;
    delete dto.calculatedCalculatedWAF;
    delete dto.userId;
    delete dto.addDate;
    delete dto.updateDate;
  });
  await Promise.all(promises);
}

async function removeRataTraverseNonReportedValues(
  rataTraverse: RataTraverseDTO[],
) {
  rataTraverse?.forEach(dto => {
    delete dto.id;
    delete dto.flowRataRunId;
    delete dto.calculatedCalculatedVelocity;
    delete dto.userId;
    delete dto.addDate;
    delete dto.updateDate;
  });
}

async function removeFlowToLoadReferenceNonReportedValues(
  flowToLoadReference: FlowToLoadReferenceDTO[],
) {
  flowToLoadReference?.forEach(dto => {
    delete dto.id;
    delete dto.testSumId;
    delete dto.calculatedAverageGrossUnitLoad;
    delete dto.calculatedAverageReferenceMethodFlow;
    delete dto.calculatedReferenceFlowToLoadRatio;
    delete dto.calculatedReferenceGrossHeatRate;
    delete dto.userId;
    delete dto.addDate;
    delete dto.updateDate;
  });
}

async function removeFlowToLoadCheckNonReportedValues(
  flowToLoadCheck: FlowToLoadCheckDTO[],
) {
  flowToLoadCheck?.forEach(dto => {
    delete dto.id;
    delete dto.testSumId;
    delete dto.userId;
    delete dto.addDate;
    delete dto.updateDate;
  });
}

async function removeCycleTimeSummaryNonReportedValues(
  cycleTimeSummary: CycleTimeSummaryDTO[],
) {
  const promises = [];
  cycleTimeSummary?.forEach(dto => {
    promises.push(
      removeCycleTimeInjectionNonReportedValues(dto.cycleTimeInjectionData),
    );
    delete dto.id;
    delete dto.testSumId;
    delete dto.calculatedTotalTime;
    delete dto.userId;
    delete dto.addDate;
    delete dto.updateDate;
  });
  await Promise.all(promises);
}

async function removeCycleTimeInjectionNonReportedValues(
  cycleTimeInjection: CycleTimeInjectionDTO[],
) {
  cycleTimeInjection?.forEach(dto => {
    delete dto.id;
    delete dto.cycleTimeSumId;
    delete dto.calculatedInjectionCycleTime;
    delete dto.userId;
    delete dto.addDate;
    delete dto.updateDate;
  });
}

async function removeOnlineOfflineCalibrationNonReportedValues(
  onlineOfflineCalibrationData: OnlineOfflineCalibrationDTO[],
) {
  onlineOfflineCalibrationData?.forEach(dto => {
    delete dto.id;
    delete dto.testSumId;
    delete dto.userId;
    delete dto.addDate;
    delete dto.updateDate;
  });
}

async function removeFuelFlowmeterAccuracyNonReportedValues(
  fuelFlowmeterAccuracyData: FuelFlowmeterAccuracyDTO[],
) {
  fuelFlowmeterAccuracyData?.forEach(dto => {
    delete dto.id;
    delete dto.testSumId;
    delete dto.userId;
    delete dto.addDate;
    delete dto.updateDate;
  });
}

async function removeTransmitterTransducerAccuracyNonReportedValues(
  transmitterTransducerAccuracyData: TransmitterTransducerAccuracyDTO[],
) {
  transmitterTransducerAccuracyData?.forEach(dto => {
    delete dto.id;
    delete dto.testSumId;
    delete dto.userId;
    delete dto.addDate;
    delete dto.updateDate;
  });
}

async function removeFuelFlowToLoadBaselineNonReportedValues(
  fuelFlowToLoadBaselineData: FuelFlowToLoadBaselineDTO[],
) {
  fuelFlowToLoadBaselineData?.forEach(dto => {
    delete dto.id;
    delete dto.testSumId;
    delete dto.userId;
    delete dto.addDate;
    delete dto.updateDate;
  });
}

async function removeFuelFlowToLoadTestNonReportedValues(
  fuelFlowToLoadTestData: FuelFlowToLoadTestDTO[],
) {
  fuelFlowToLoadTestData?.forEach(dto => {
    delete dto.id;
    delete dto.testSumId;
    delete dto.userId;
    delete dto.addDate;
    delete dto.updateDate;
  });
}

async function removeAppECorrelationTestSummaryNonReportedValues(
  appECorrelationTestSummaryData: AppECorrelationTestSummaryDTO[],
) {
  const promises = [];
  appECorrelationTestSummaryData?.forEach(dto => {
    promises.push(
      removeAppECorrelationTestRunNonReportedValues(
        dto.appendixECorrelationTestRunData,
      ),
    );
    delete dto.id;
    delete dto.testSumId;
    delete dto.calculatedMeanReferenceValue;
    delete dto.calculatedAverageHourlyHeatInputRate;
    delete dto.userId;
    delete dto.addDate;
    delete dto.updateDate;
  });
  await Promise.all(promises);
}

async function removeAppECorrelationTestRunNonReportedValues(
  appECorrelationTestRunData: AppECorrelationTestRunDTO[],
) {
  const promises = [];
  appECorrelationTestRunData?.forEach(dto => {
    promises.push(
      removeAppEHeatInputFromOilNonReportedValues(dto.appEHeatInputFromOilData),
      removeAppEHeatInputFromGasNonReportedValues(dto.appEHeatInputFromGasData),
    );
    delete dto.id;
    delete dto.appECorrTestSumId;
    delete dto.calculatedHourlyHeatInputRate;
    delete dto.calculatedTotalHeatInput;
    delete dto.userId;
    delete dto.addDate;
    delete dto.updateDate;
  });
  await Promise.all(promises);
}

async function removeAppEHeatInputFromOilNonReportedValues(
  appEHeatInputFromOilData: AppEHeatInputFromOilDTO[],
) {
  appEHeatInputFromOilData?.forEach(dto => {
    delete dto.id;
    delete dto.appECorrTestRunId;
    delete dto.calculatedOilMass;
    delete dto.calculatedOilHeatInput;
    delete dto.userId;
    delete dto.addDate;
    delete dto.updateDate;
  });
}

async function removeAppEHeatInputFromGasNonReportedValues(
  appEHeatInputFromGas: AppEHeatInputFromGasDTO[],
) {
  appEHeatInputFromGas?.forEach(dto => {
    delete dto.id;
    delete dto.appECorrTestRunId;
    delete dto.calculatedGasHeatInput;
    delete dto.userId;
    delete dto.addDate;
    delete dto.updateDate;
  });
}

async function removeUnitDefaultTestNonReportedValues(
  unitDefaultTestData: UnitDefaultTestDTO[],
) {
  const promises = [];
  unitDefaultTestData?.forEach(dto => {
    promises.push(
      removeUnitDefaultTestRunNonReportedValues(dto.unitDefaultTestRunData),
    );
    delete dto.id;
    delete dto.testSumId;
    delete dto.calculatedNoxDefaultRate;
    delete dto.userId;
    delete dto.addDate;
    delete dto.updateDate;
  });
  await Promise.all(promises);
}

async function removeUnitDefaultTestRunNonReportedValues(
  unitDefaultTestRunData: UnitDefaultTestRunDTO[],
) {
  unitDefaultTestRunData?.forEach(dto => {
    delete dto.id;
    delete dto.unitDefaultTestSumId;
    delete dto.userId;
    delete dto.addDate;
    delete dto.updateDate;
  });
}

async function removeHgSummaryNonReportedValues(hgSummaryData: HgSummaryDTO[]) {
  const promises = [];
  hgSummaryData?.forEach(dto => {
    promises.push(removeHgInjectionNonReportedValues(dto.hgInjectionData));
    delete dto.id;
    delete dto.testSumId;
    delete dto.calculatedMeanMeasuredValue;
    delete dto.calculatedMeanReferenceValue;
    delete dto.calculatedPercentError;
    delete dto.calculatedAPSIndicator;
    delete dto.userId;
    delete dto.addDate;
    delete dto.updateDate;
  });
  await Promise.all(promises);
}

async function removeHgInjectionNonReportedValues(
  hgInjectionData: HgInjectionDTO[],
) {
  hgInjectionData?.forEach(dto => {
    delete dto.id;
    delete dto.hgTestSumId;
    delete dto.userId;
    delete dto.addDate;
    delete dto.updateDate;
  });
}

async function removeTestQualificationNonReportedValues(
  testQualificationData: TestQualificationDTO[],
) {
  testQualificationData?.forEach(dto => {
    delete dto.id;
    delete dto.testSumId;
    delete dto.userId;
    delete dto.addDate;
    delete dto.updateDate;
  });
}

async function removeProtocolGasNonReportedValues(
  protocolGasData: ProtocolGasDTO[],
) {
  protocolGasData?.forEach(dto => {
    delete dto.id;
    delete dto.testSumId;
    delete dto.userId;
    delete dto.addDate;
    delete dto.updateDate;
  });
}

async function removeAirEmissionTestingNonReportedValues(
  airEmissionTestingData: AirEmissionTestingDTO[],
) {
  airEmissionTestingData?.forEach(dto => {
    delete dto.id;
    delete dto.testSumId;
    delete dto.userId;
    delete dto.addDate;
    delete dto.updateDate;
  });
}

async function removeCertificationEventNonReportedValues(
  certificationEventData: QACertificationEventDTO[],
) {
  certificationEventData?.forEach(dto => {
    delete dto.id;
    delete dto.locationId;
    delete dto.lastUpdated;
    delete dto.updatedStatusFlag;
    delete dto.needsEvalFlag;
    delete dto.checkSessionId;
    delete dto.submissionId;
    delete dto.submissionAvailabilityCode;
    delete dto.pendingStatusCode;
    delete dto.evalStatusCode;
    delete dto.userId;
    delete dto.addDate;
    delete dto.updateDate;
  });
}

async function removeTestExtensionExemptionNonReportedValues(
  testExtensionExemptionData: TestExtensionExemptionDTO[],
) {
  testExtensionExemptionData?.forEach(dto => {
    delete dto.id;
    delete dto.locationId;
    delete dto.reportPeriodId;
    delete dto.checkSessionId;
    delete dto.submissionId;
    delete dto.submissionAvailabilityCode;
    delete dto.pendingStatusCode;
    delete dto.evalStatusCode;
    delete dto.userId;
    delete dto.addDate;
    delete dto.updateDate;
  });
}
