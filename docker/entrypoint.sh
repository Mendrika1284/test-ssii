#!/usr/bin/env bash
# set -eox # Debug

exec /usr/bin/supervisord -c ./config/supervisord.conf    
