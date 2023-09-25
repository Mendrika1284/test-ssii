###
# Build stage
###
FROM node:16.17-alpine3.16 as build-stage

# Context
WORKDIR /build

# Copy source app
COPY . .

# Install node dependencies
RUN npm install -g npm
RUN yarn install --frozen-lockfile --ignore-scripts

# Build app
RUN yarn build

###
# Run stage
###
FROM node:16.17-alpine3.16 as run-stage

# Context
WORKDIR /app
ARG COMMIT_SHA
ENV COMMIT_SHA=${COMMIT_SHA:-null}
ENV NODE_CONFIG_DIR=./packages/back/dist/config

# Install system dependencies
RUN \
  apk update && \
  apk add curl unzip

## Context
WORKDIR /app/bin

## Install supervisor (http://supervisord.org)
RUN \
  ### Install
  apk add supervisor && \
  ### Log
  mkdir -p /var/log/supervisord /var/run/supervisord && \
  ### Security
  chown root:node /usr/bin/supervisord && \
  chmod ug+x,o-rwx /usr/bin/supervisord && \
  chown root:node /var/log/supervisord /var/run/supervisord && \
  chmod ug+wx,o-rwx /var/log/supervisord /var/run/supervisord

## Install secure running app (https://github.com/krallin/tini)
RUN \
  ### Install
  apk add tini && \
  ### Security
  chown root:node /sbin/tini && \
  chmod ug+x,o-rwx /sbin/tini 

## Clean install system dependencies
RUN apk del curl unzip

# Install app
## Context
WORKDIR /app

## Copy build app
COPY --from=build-stage  /build/package.json ./
COPY --from=build-stage  /build/yarn.lock ./
COPY --from=build-stage  /build/docker/entrypoint.sh ./entrypoint.sh
COPY --from=build-stage  /build/docker/supervisord.prod.conf /build/docker/supervisord.conf ./config/
COPY --from=build-stage  /build/packages/api/dist ./packages/api/dist
COPY --from=build-stage  /build/packages/api/package.json ./packages/api/
COPY --from=build-stage  /build/packages/back/dist ./packages/back/dist
COPY --from=build-stage  /build/packages/back/package.json ./packages/back/
COPY --from=build-stage  /build/packages/back/migrations ./migrations
COPY --from=build-stage  /build/packages/front/dist ./packages/front/dist
COPY --from=build-stage  /build/packages/front/package.json ./packages/front/
COPY --from=build-stage  /build/packages/maxi/dist ./packages/maxi/dist
COPY --from=build-stage  /build/packages/mini/dist ./packages/mini/dist

## Install node dependencies
RUN yarn install --production --frozen-lockfile --prefer-offline --ignore-optional --ignore-scripts

## Security
RUN \
  chown -R root:node ./ && \
  chmod -R g+r-w,o-rwx ./ && \
  chmod ug+x ./entrypoint.sh && \
  chmod ug+wx ./config

# Run context
USER node
EXPOSE 8080
ENTRYPOINT ["/bin/sh", "./entrypoint.sh"]
