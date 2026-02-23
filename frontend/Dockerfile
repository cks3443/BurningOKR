### STAGE 1: Build ###
FROM node:18 AS build

WORKDIR /usr/src/app
COPY . .
RUN npm ci --no-audit --no-fund
RUN npm run build-docker


### STAGE 2: Run ###
FROM nginx:1.27-alpine

EXPOSE 80

COPY nginx.conf /etc/nginx/nginx.conf

RUN rm -rf /usr/share/nginx/html/*
WORKDIR /usr/share/nginx/html
COPY --from=build /usr/src/app/dist/burning-okr-docker/ .
