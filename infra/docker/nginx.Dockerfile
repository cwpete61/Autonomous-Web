FROM nginx:1.25-alpine

ARG NGINX_CONF=infra/nginx/nginx.conf

# Copy custom nginx configuration
COPY ${NGINX_CONF} /etc/nginx/nginx.conf
COPY infra/nginx/conf.d/ /etc/nginx/conf.d/

EXPOSE 80 443
