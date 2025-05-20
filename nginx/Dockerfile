# nginx/Dockerfile

# Use a lean Nginx image
FROM nginx:alpine

# Remove default Nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy your Nginx configuration template
COPY ./nginx.conf /etc/nginx/nginx.conf.template

# Copy an entrypoint script
COPY entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Expose port 80 (Nginx listens on 80 inside the container)
EXPOSE 80

# Use the entrypoint script to substitute variables and start Nginx
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]