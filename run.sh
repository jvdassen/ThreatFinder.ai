docker rm -f frontend-threatfinder
docker run -d --restart unless-stopped  --name frontend-threatfinder -p 3000:3000 -v "$PWD":/app node /bin/bash -c '/app/entry.sh'
#docker run -it --name frontend-threatfinder -p 3000:3000 -v "$PWD":/app node /bin/bash
