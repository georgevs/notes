# Configure 

[Docker: nginx](https://hub.docker.com/_/nginx)  

### Install live certificates
```
openssl enc -aes-128-cbc -pbkdf2 -salt -d -in ~/ws-archive/certs.tar.gz.enc | tar -xzv
```

### Run Nginx in Docker
```bash
docker container run --rm \
  --name nginx-dev \
  --network bridge-dev \
  --ip 172.20.0.100 \
  --volume ./templates:/etc/nginx/templates \
  --volume ./certs:/etc/nginx/certs \
  --env NGINX_PORT=3443 \
  --publish 3443:3443 \
  -d nginx
```
