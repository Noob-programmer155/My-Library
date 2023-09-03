FROM maven AS BUILD_CONTAINER
ENV HOMEBUILD=/home/maven
COPY --chown=mvn:mvn . ${HOMEBUILD}
RUN cd ${HOMEBUILD} && mvn package -DskipTests

FROM openjdk:11
ENV HOME=/home/app
ENV APP_NAME=MyLibrary-0.1.jar
ENV BUILD_FOLDER=/target

COPY --from=BUILD_CONTAINER /home/maven/${BUILD_FOLDER}/${APP_NAME} ${HOME}/
WORKDIR ${HOME}

EXPOSE 8080

ENTRYPOINT exec java -jar ${APP_NAME}