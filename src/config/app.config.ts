require('dotenv').config();
import { registerAs } from '@nestjs/config';
import { parseBool } from '@us-epa-camd/easey-common/utilities';

const path =
  process.env.EASEY_QA_CERTIFICATION_API_PATH || 'qa-certification-mgmt';
const host = process.env.EASEY_QA_CERTIFICATION_API_HOST || 'localhost';
const port = +process.env.EASEY_QA_CERTIFICATION_API_PORT || 8070;

let uri = `https://${host}/${path}`;

if (host === 'localhost') {
  uri = `http://localhost:${port}/${path}`;
}

export default registerAs('app', () => ({
  name: 'qa-certification-api',
  title:
    process.env.EASEY_QA_CERTIFICATION_API_TITLE ||
    'QA Certification Management',
  description: process.env.EASEY_QA_CERTIFICATION_API_DESC,
  path,
  host,
  apiHost: process.env.EASEY_API_GATEWAY_HOST || 'api.epa.gov/easey/dev',
  port,
  uri,
  env: process.env.EASEY_QA_CERTIFICATION_API_ENV || 'local-dev',
  enableCors: parseBool(
    process.env.EASEY_QA_CERTIFICATION_API_ENABLE_CORS,
    true,
  ),
  enableApiKey: parseBool(
    process.env.EASEY_QA_CERTIFICATION_API_ENABLE_API_KEY,
    true,
  ),
  enableAuthToken: parseBool(
    process.env.EASEY_QA_CERTIFICATION_API_ENABLE_AUTH_TOKEN,
  ),
  enableGlobalValidationPipes: parseBool(
    process.env.EASEY_QA_CERTIFICATION_API_ENABLE_GLOBAL_VALIDATION_PIPE,
    true,
  ),
  version: process.env.EASEY_QA_CERTIFICATION_API_VERSION || 'v0.0.0',
  published: process.env.EASEY_QA_CERTIFICATION_API_PUBLISHED || 'local',
  enableSecretToken: parseBool(
    process.env.EASEY_QA_CERTIFICATION_API_ENABLE_SECRET_TOKEN,
    false,
  ),
}));
