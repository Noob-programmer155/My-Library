FROM node:16.20-alpine

ENV HOME=/home/app

COPY . ${HOME}
WORKDIR ${HOME}

RUN npm i
RUN npm i -g serve
RUN npm run build

EXPOSE 3000

ENTRYPOINT exec serve -s build