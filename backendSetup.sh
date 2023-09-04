#!/bin/bash

# remember: install backend after frontend will cause error CORS...

#setup network database
#docker network create --internal mylibrary-internal
##setup database mysql
#docker pull mysql
##run postgress
#docker run -d -p 3306:3306 --net mylibrary-internal --name db-mylibrary -e "MYSQL_ROOT_PASSWORD=admin123" mysql
#docker cp ./dbdump_lms.sql db-mylibrary:/dbsql.sql
##set up name
#docker exec -i db-mylibrary bash <<'EOF'
#  dbpassmain='admin123'
#  MYSQL_PWD=${dbpassmain} mysql -u root -e "CREATE USER 'admin'@'%' IDENTIFIED BY 'admin';CREATE DATABASE mylibrary;"
#  MYSQL_PWD=${dbpassmain} mysql -u root -e "GRANT ALL PRIVILEGES ON mylibrary.* TO 'admin'@'%';FLUSH PRIVILEGES;"
#  MYSQL_PWD=${dbpassmain} mysql -u root -D mylibrary < dbsql.sql
#  exit
#EOF
#=========================================================================================================
# build image
docker build -t backend-mylibrary .
# run container
docker run -d -p 8092:8080 --net mylibrary-internal --name back-mylibrary --env-file ./env -e "ORIGIN_URLS=http://localhost::http://localhost:3000::http://example" backend-mylibrary