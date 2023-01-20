# Image layer for building the application
FROM node:18-alpine

# global npm dependencies: recommended to place those dependencies in the non-root user directory
# ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
# optionally if you want to run npm global bin without specifying path
# ENV PATH=$PATH:/home/node/.npm-global/bin

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
ADD . .

# generate your wundergraph application
# RUN npm exec wunderctl generate

# RUN ls -lah /usr/src/app/node_modules/@wundergraph/wunderctl/download/

COPY ./node_modules/@wundergraph/wunderctl/download/wunderctl /usr/local/bin/wunderctl

ARG WG_NODE_PORT=9991

EXPOSE ${WG_NODE_PORT}
ENV WG_NODE_HOST="0.0.0.0"
ENV WG_NODE_PORT=${WG_NODE_PORT}

# RUN npm run wunderctl version

WORKDIR /usr/src/app/.wundergraph

# CMD ["npm", "run", "start"]
CMD ["wunderctl", "up"]

# # Image layer for building the application
# FROM node:18-alpine as build

# # global npm dependencies: recommended to place those dependencies in the non-root user directory
# ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
# # optionally if you want to run npm global bin without specifying path
# ENV PATH=$PATH:/home/node/.npm-global/bin

# WORKDIR /usr/src/app

# # rebuild image when package.json or lock has changed
# COPY package*.json ./

# # install dependencies
# RUN npm ci --only=production

# # add project artifacts to docker image
# ADD . .

# # generate your wundergraph application
# RUN npm exec wunderctl generate

# # Image layer for production
# FROM node:18-alpine as runner
# WORKDIR /usr/src/app

# # copy entire project and dependencies
# COPY --from=build --chown=node:node /usr/src/app/node_modules ./node_modules
# COPY --from=build --chown=node:node /usr/src/app/.wundergraph ./.wundergraph
# # copy wunderctl
# COPY --from=build --chown=node:node /usr/src/app/node_modules/@wundergraph/wunderctl/download/wunderctl /usr/local/bin/wunderctl

# ARG WG_NODE_PORT=4000
# EXPOSE ${WG_NODE_PORT}

# RUN wunderctl version

# # run as non-root user
# USER node

# WORKDIR .wundergraph

# CMD WG_NODE_HOST=0.0.0.0 WG_NODE_PORT=${WG_NODE_PORT} wunderctl start
