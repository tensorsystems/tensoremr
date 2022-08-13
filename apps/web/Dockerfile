FROM nginx:stable-alpine
LABEL maintainer="Kidus Tiliksew <kidus@tensorsystems.net>"
COPY ./nginx.conf /etc/nginx/nginx.conf
COPY dist/apps/web/* /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]