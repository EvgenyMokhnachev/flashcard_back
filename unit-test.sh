#!/bin/bash

if [ -z "$@" ]
then
    ./node.sh env TS_NODE_COMPILER_OPTIONS='{"module": "commonjs" }' mocha --inspect=0.0.0.0:9222 -r ts-node/register "/app/src/tests/**/*.ts"
else
    ./node.sh env TS_NODE_COMPILER_OPTIONS='{"module": "commonjs" }' mocha --inspect=0.0.0.0:9222 -r ts-node/register "/app/$@"
fi
