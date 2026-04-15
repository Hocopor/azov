#!/usr/bin/env sh
set -eu
npx prisma migrate deploy
node server.js
