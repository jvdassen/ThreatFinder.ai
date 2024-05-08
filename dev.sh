#!/bin/bash
docker run -it -p 3000:3000  \
           --user $UID:$GID  \
           -e HOME=/app      \
           -v $(pwd):/app    \
           node:22 bash      


