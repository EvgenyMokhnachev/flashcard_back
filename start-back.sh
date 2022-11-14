#!/bin/bash
docker-compose rm -sf backend_builder
docker-compose up --build backend_builder
