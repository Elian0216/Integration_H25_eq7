# nginx/entrypoint.sh

#!/bin/sh

# Substitute environment variables into the Nginx template and write to the final config
envsubst '$DJANGO_INTERNAL_URL_HOST,$NEXTJS_INTERNAL_URL_HOST' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

# Execute the original Nginx command
exec "$@"