#!/bin/bash

cf set-env $APP_NAME EASEY_QA_CERTIFICATION_API_KEY $QA_CERTIFICATION_API_KEY
cf set-env $APP_NAME EASEY_QA_CERTIFICATION_API_SECRET_TOKEN $QA_CERTIFICATION_API_SECRET_TOKEN
cf set-env $APP_NAME EASEY_QA_CERTIFICATION_API_MATS_BULK_FILES_IMPORT_AWS_ACCESS_KEY_ID $MATS_BULK_FILES_IMPORT_AWS_ACCESS_KEY_ID
cf set-env $APP_NAME EASEY_QA_CERTIFICATION_API_MATS_BULK_FILES_IMPORT_AWS_SECRET_ACCESS_KEY $MATS_BULK_FILES_IMPORT_AWS_SECRET_ACCESS_KEY
