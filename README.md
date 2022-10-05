# QA Certification Data Management API

[![License](https://img.shields.io/github/license/US-EPA-CAMD/easey-qa-certification-api)](https://github.com/US-EPA-CAMD/easey-qa-certification-api/blob/develop/LICENSE)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=US-EPA-CAMD_easey-qa-certification-api&metric=alert_status)](https://sonarcloud.io/dashboard?id=US-EPA-CAMD_easey-qa-certification-api)
[![Develop CI/CD](https://github.com/US-EPA-CAMD/easey-qa-certification-api/workflows/Develop%20Branch%20Workflow/badge.svg)](https://github.com/US-EPA-CAMD/easey-qa-certification-api/actions)
[![Release CI/CD](https://github.com/US-EPA-CAMD/easey-qa-certification-api/workflows/Release%20Branch%20Workflow/badge.svg)](https://github.com/US-EPA-CAMD/easey-qa-certification-api/actions)
![Issues](https://img.shields.io/github/issues/US-EPA-CAMD/easey-qa-certification-api)
![Forks](https://img.shields.io/github/forks/US-EPA-CAMD/easey-qa-certification-api)
![Stars](https://img.shields.io/github/stars/US-EPA-CAMD/easey-qa-certification-api)
[![Open in Visual Studio Code](https://open.vscode.dev/badges/open-in-vscode.svg)](https://open.vscode.dev/US-EPA-CAMD/easey-qa-certification-api)

## Description
Manages qa certification data for the EPA CAMD Business Systems.

## Getting Started
Follow these [instructions](https://github.com/US-EPA-CAMD/devops/blob/master/GETTING-STARTED.md) to get the project up and running correctly.

## Installing
1. Open a terminal and navigate to the directory where you wish to store the repository.
2. Clone the repository using one of the following git cli commands or using your favorit Git management software<br>
    **Using SSH**
    ```
    $ git clone git@github.com:US-EPA-CAMD/qa-certification-api.git
    ```
    **Using HTTPS**
    ```
    $ git clone https://github.com/US-EPA-CAMD/qa-certification-api.git
    ```
3. Navigate to the projects root directory
    ```
    $ cd qa-certification-api
    ```
4. Install package dependencies
    ```
    $ yarn install
    ```

## Configuration
The QA Certification API uses a number of environment variables to properly configure the api. The following is the list of configureble values and their default setting.

| Typescript Var Name | Environment Var Name | Default Value | Comment |
| :------------------ | :------------------- | :------------ | :------ |
| name | N/A | qa-certification-api | Fixed value |
| host | EASEY_QA_CERTIFICATION_API_HOST | localhost | Configurable
| port | EASEY_QA_CERTIFICATION_API_PORT | 8070 | Configurable |
| path | EASEY_QA_CERTIFICATION_API_PATH | qa-certification-mgmt | Configurable |
| title | EASEY_QA_CERTIFICATION_API_TITLE | QA Certification Management | Configurable |
| description | EASEY_QA_CERTIFICATION_API_DESCRIPTION | QA & Certification management API endpoints for qa test data, qa cert events, and test extension & exemption data | Configurable |
| env | EASEY_QA_CERTIFICATION_API_ENV | local-dev | Configurable |
| apiKey | EASEY_QA_CERTIFICATION_API_KEY | *** | Dynamically set by CI/CD workflow |
| enableApiKey | EASEY_QA_CERTIFICATION_API_ENABLE_API_KEY | false | Configurable |
| secretToken | EASEY_QA_CERTIFICATION_API_SECRET_TOKEN | *** | Dynamically set by CI/CD workflow |
| enableSecretToken | EASEY_QA_CERTIFICATION_API_ENABLE_SECRET_TOKEN | false | Configurable |
| enableCors | EASEY_QA_CERTIFICATION_API_ENABLE_CORS | true | Configurable |
| enableAuthToken | EASEY_QA_CERTIFICATION_API_ENABLE_AUTH_TOKEN | false | Configurable |
| enableGlobalValidationPipes | EASEY_QA_CERTIFICATION_API_ENABLE_GLOBAL_VALIDATION_PIPE | true | Configurable |
| version | EASEY_QA_CERTIFICATION_API_VERSION | v0.0.0 | Dynamically set by CI/CD workflow |
| published | EASEY_QA_CERTIFICATION_API_PUBLISHED | local | Dynamically set by CI/CD workflow |
| reqSizeLimit | EASEY_QA_CERTIFICATION_API_REQ_SIZE_LIMIT | 1mb | Configurable |
| enableDebug | EASEY_QA_CERTIFICATION_API_ENABLE_DEBUG | false | Configurable |
| currentUser | EASEY_QA_CERTIFICATION_API_CURRENT_USER | {} | Configurable |
| apiHost | EASEY_API_GATEWAY_HOST | api.epa.gov/easey/dev | Configurable |
| authApi.uri | EASEY_AUTH_API | https://api.epa.gov/easey/dev/auth-mgmt | Configurable |

## Environment Variables File
Database credentials are injected into the cloud.gov environments as part of the CI/CD deployment process therefore they do not need to be configured. However, when running locally for local development the following environment variables are required to be configured using a local .env file in the root of the project. **PLEASE DO NOT commit the .env file to source control.**

- EASEY_QA_CERTIFICATION_API_ENABLE_DEBUG=true|false
- EASEY_QA_CERTIFICATION_API_ENABLE_API_KEY=true|false
  - IF ABOVE IS TRUE THEN SET
    - EASEY_QA_CERTIFICATION_API_KEY={ask project dev/tech lead}
- EASEY_QA_CERTIFICATION_API_ENABLE_AUTH_TOKEN=true|false
  - IF ABOVE IS TRUE THEN
    - USE AUTH API TO SIGNIN & GET AUTH TOKEN TO USE AS A BEARER TOKEN
  - IF ABOVE IS FALSE THEN SET
    - EASEY_QA_CERTIFICATION_API_CURRENT_USER={see below}
    - FORMAT: { "userId": "testuser", "roles": [ { "orisCode": 3, "role": "P" } ] }
- EASEY_QA_CERTIFICATION_API_ENABLE_SECRET_TOKEN=true|false
  - IF ABOVE IS TRUE THEN SET
    - EASEY_QA_CERTIFICATION_API_SECRET_TOKEN={ask project dev/tech lead}

**Please refer to our [Getting Started](https://github.com/US-EPA-CAMD/devops/blob/master/GETTING-STARTED.md) instructions on how to configure the following environment variables & connect to the database.**
- EASEY_DB_HOST
- EASEY_DB_PORT
- EASEY_DB_NAME
- EASEY_DB_USER
- EASEY_DB_PWD

## Building, Testing, & Running the application
From within the projects root directory run the following commands using the yarn command line interface

**Run in development mode**
```
$ yarn start:dev
```

**Install/update package dependencies & run in development mode**
```
$ yarn up
```

**Unit tests**
```
$ yarn test
```

**Build**
```
$ yarn build
```

**Run in production mode**
```
$ yarn start
```

## API Endpoints
Please refer to the QA Certification Management API Swagger Documentation for descriptions of the endpoints.<br>
[Dev Environment](https://api.epa.gov/easey/dev/qa-certification-mgmt/swagger/) | [Test Environment](https://api.epa.gov/easey/test/qa-certification-mgmt/swagger/) |  [Performance Environment](https://api.epa.gov/easey/perf/qa-certification-mgmt/swagger/) | [Beta Environment](https://api.epa.gov/easey/beta/qa-certification-mgmt/swagger/) | [Staging Environment](https://api.epa.gov/easey/staging/qa-certification-mgmt/swagger/)

## License & Contributing
This project is licensed under the MIT License. We encourage you to read this project’s [License](LICENSE), [Contributing Guidelines](CONTRIBUTING.md), and [Code of Conduct](CODE-OF-CONDUCT.md).

## Disclaimer
The United States Environmental Protection Agency (EPA) GitHub project code is provided on an "as is" basis and the user assumes responsibility for its use. EPA has relinquished control of the information and no longer has responsibility to protect the integrity , confidentiality, or availability of the information. Any reference to specific commercial products, processes, or services by service mark, trademark, manufacturer, or otherwise, does not constitute or imply their endorsement, recommendation or favoring by EPA. The EPA seal and logo shall not be used in any manner to imply endorsement of any commercial product or activity by EPA or the United States Government.
