#!/bin/bash

set -e

if [[ -z "${ENV}" ]]; then

    echo """
    Please set an envvar PROD or QA.

    PROD will publish to the open market place.

    QA will publish to the closed nowsecure space as
    a private plugin used for testing.
    """
    sleep 1
    exit 1
fi

if [[ -z "${TOKEN}" ]]; then
     echo """
    Please set an envvar TOKEN
    to access azure devops marketplace
    """
    sleep 1
    exit 1
fi

SHARE_WITH="--share-with qa-nowsecure"
OVERRIDES=""
if [[ "${ENV}" == "PROD" ]]; then
    SHARE_WITH=""
    OVERRIDES="--overrides-file prod-overrides.json"
fi

npm ci
pushd Nowsecure
npm ci
tsc --skipLibCheck
popd

tfx extension publish \
    --manifest-globs vss-extension.json \
    $OVERRIDES \
    $SHARE_WITH \
    --token $TOKEN
    
