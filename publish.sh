#!/bin/bash

set -e

COMMAND=$1

function build_project() {
    pushd Nowsecure
    npm run pre-package
    popd
}

if [[ -z "${COMMAND}" ]]; then
    echo """
    Please provide a command argument to the script

    'package' will create a local .vsix file but not attempt publishing

    'publish' will create a local .vsix file and attempt to publish with
    the provided ENV and TOKEN variable
    """
    sleep 1
    exit 1
fi

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


if [[ "${COMMAND}" == "package" ]]; then

    OVERRIDES=""
    if [[ "${ENV}" == "PROD" ]]; then
        OVERRIDES="--overrides-file prod-overrides.json"
    fi

    build_project

    tfx extension create \
        --manifest-globs vss-extension.json \
        $OVERRIDES \

    sleep 1
    exit
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

build_project

tfx extension publish \
    --manifest-globs vss-extension.json \
    $OVERRIDES \
    $SHARE_WITH \
    --token $TOKEN
