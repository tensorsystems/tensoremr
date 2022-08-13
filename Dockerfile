# docker-compose
# --------------
# This dockerfile is used by the `docker-compose.yml` adjacent file. When
# running `docker-compose build`, this dockerfile helps build the "webapp" image.
# All paths are relative to the `context`, which is the project root directory.
#
# docker build
# --------------
# If you would like to use this dockerfile to build and tag an image, make sure
# you set the context to the project's root directory:
# https://docs.docker.com/engine/reference/commandline/build/
#
#
# SUMMARY
# --------------
# This dockerfile has two stages:
#
# 1. Building the React application for production
# 2. Setting up our Nginx (OpenResty*) image w/ step one's output
#
# * OpenResty is functionally identical to Nginx with the addition of Lua out of
# the box.

# Stage 1: Build the application



# ADD . /usr/src/app/
# RUN yarn install
# RUN yarn run build:web


# Stage 2: Bundle the built application into a Docker container
# which runs openresty (nginx) using Alpine Linux
# LINK: https://hub.docker.com/r/openresty/openresty
FROM openresty/openresty:1.15.8.1rc1-0-alpine-fat
LABEL maintainer="Kidus Tiliksew <kidus@tensorsystems.net>"

RUN mkdir /var/log/nginx
RUN apk add --no-cache openssl
RUN apk add --no-cache openssl-dev
RUN apk add --no-cache git
RUN apk add --no-cache gcc
# !!!
RUN luarocks install lua-resty-openidc

#
RUN luarocks install lua-resty-jwt
RUN luarocks install lua-resty-session
RUN luarocks install lua-resty-http
# !!!
RUN luarocks install lua-resty-openidc
RUN luarocks install luacrypto

# Copy build output to image
COPY ohif/platform/viewer/dist /var/www/ohif
COPY dist/apps/web /var/www/web

ENTRYPOINT ["/usr/local/openresty/nginx/sbin/nginx", "-g", "daemon off;"]
