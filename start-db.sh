#!/bin/bash
docker-compose rm -sf backend-db
docker-compose up --build backend-db
