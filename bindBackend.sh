#!/bin/bash

docker network connect mylibrary-proxy back-mylibrary
#setup bind using reverse proxy
docker network connect mylibrary-proxy reverse-proxy