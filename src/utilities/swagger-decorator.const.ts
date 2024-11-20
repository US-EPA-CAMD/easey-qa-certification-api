import { ApiExcludeEndpoint, ApiExcludeController } from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { getConfigValue } from '@us-epa-camd/easey-common/utilities';

const env = getConfigValue('EASEY_QA_CERTIFICATION_API_ENV', 'local-dev');
const disable = ['local-dev','development','testing'].includes(env) ? false : true;

export function ApiExcludeControllerByEnv() {
    return applyDecorators(ApiExcludeController(disable));
}

export function ApiExcludeEndpointByEnv() {
    return applyDecorators(ApiExcludeEndpoint(disable));
}