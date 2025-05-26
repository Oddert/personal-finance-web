FROM nginx
WORKDIR /app
COPY ./build .
COPY ./nginx.conf /etc/nginx/nginx.conf