#!/bin/bash
docker-compose rm -sf frontend_builder frontend_server
docker-compose up --build frontend_builder frontend_server
