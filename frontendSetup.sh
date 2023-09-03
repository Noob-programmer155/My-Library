#!/bin/bash
# using reverse proxys
docker network create --internal mylibrary-proxy

#===============================================

docker build -t frontend-mylibrary:0.1 .

docker run -d -p 8091:3000 --net mylibrary-proxy --name front-mylibrary frontend-mylibrary:0.1