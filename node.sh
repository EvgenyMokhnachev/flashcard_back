#!/bin/sh

docker-compose run --rm --service-ports node "$@"
