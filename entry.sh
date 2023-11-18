#!/bin/bash

cd /app
npm i
npm install -g serve
export PUBLIC_URL=https://www.csg.uzh.ch/threatfinder/; npm run build
serve -s build

