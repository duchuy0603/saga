FROM nginx:1.21.4
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY ./build /usr/share/nginx/html
