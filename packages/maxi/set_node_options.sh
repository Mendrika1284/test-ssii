#!/bin/bash

if [ "$(uname)" = "Jupiter" ]; then
  export NODE_OPTIONS="--openssl-legacy-provider"
fi

