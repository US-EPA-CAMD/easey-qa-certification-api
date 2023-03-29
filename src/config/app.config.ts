import { registerAs } from '@nestjs/config';
import {
  getConfigValue,
  getConfigValueNumber,
  getConfigValueBoolean,
} from '@us-epa-camd/easey-common/utilities';

require('dotenv').config();

const host = getConfigValue('EASEY_QA_CERTIFICATION_API_HOST', 'localhost');
const port = getConfigValueNumber('EASEY_QA_CERTIFICATION_API_PORT', 8070);
const path = getConfigValue(
  'EASEY_QA_CERTIFICATION_API_PATH',
  'qa-certification-mgmt',
);

let uri = `https://${host}/${path}`;

if (host === 'localhost') {
  uri = `http://localhost:${port}/${path}`;
}

const apiHost = getConfigValue(
  'EASEY_API_GATEWAY_HOST',
  'api.epa.gov/easey/dev',
);

export default registerAs('app', () => ({
  name: 'qa-certification-api',
  host,
  port,
  path,
  uri,
  title: getConfigValue(
    'EASEY_QA_CERTIFICATION_API_TITLE',
    'QA Certification Management',
  ),
  description: getConfigValue(
    'EASEY_QA_CERTIFICATION_API_DESCRIPTION',
    'QA & Certification management API endpoints for qa test data, qa cert events, and test extension & exemption data',
  ),
  env: getConfigValue('EASEY_QA_CERTIFICATION_API_ENV', 'local-dev'),
  apiKey: getConfigValue('EASEY_QA_CERTIFICATION_API_KEY'),
  enableApiKey: getConfigValueBoolean(
    'EASEY_QA_CERTIFICATION_API_ENABLE_API_KEY',
  ),
  secretToken: getConfigValue('EASEY_QA_CERTIFICATION_API_SECRET_TOKEN'),
  enableSecretToken: getConfigValueBoolean(
    'EASEY_QA_CERTIFICATION_API_ENABLE_SECRET_TOKEN',
  ),
  enableRoleGuard: getConfigValueBoolean(
    'EASEY_QA_CERTIFICATION_API_ENABLE_ROLE_GUARD',
    true,
  ),
  enableCors: getConfigValueBoolean(
    'EASEY_QA_CERTIFICATION_API_ENABLE_CORS',
    true,
  ),
  enableAuthToken: getConfigValueBoolean(
    'EASEY_QA_CERTIFICATION_API_ENABLE_AUTH_TOKEN',
  ),
  enableGlobalValidationPipes: getConfigValueBoolean(
    'EASEY_QA_CERTIFICATION_API_ENABLE_GLOBAL_VALIDATION_PIPE',
    true,
  ),
  version: getConfigValue('EASEY_QA_CERTIFICATION_API_VERSION', 'v0.0.0'),
  published: getConfigValue('EASEY_QA_CERTIFICATION_API_PUBLISHED', 'local'),
  reqSizeLimit: getConfigValue(
    'EASEY_QA_CERTIFICATION_API_REQ_SIZE_LIMIT',
    '1mb',
  ),
  // ENABLES DEBUG CONSOLE LOGS
  enableDebug: getConfigValueBoolean('EASEY_QA_CERTIFICATION_API_ENABLE_DEBUG'),
  // NEEDS TO BE SET IN .ENV FILE FOR LOCAL DEVELOPMENT
  // FORMAT: { "userId": "", "roles": [ { "orisCode": 3, "role": "P" } ] }
  currentUser: getConfigValue('EASEY_QA_CERTIFICATION_API_CURRENT_USER'),
  apiHost: apiHost,
  authApi: {
    uri: getConfigValue('EASEY_AUTH_API', `https://${apiHost}/auth-mgmt`),
  },
}));
