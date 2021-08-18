<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

<p align="center">
A progressive <a href="http://nodejs.org" target="_blank">Node.js</a>framework for building efficient and scalable server-side applications.
</p>

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Quick start

```bash
# copy environment
$ cp .env.docer .env

# run docker
$ docker-compose up -d --build

# run migration
$ docker exec -it node_server npm run migration:run
```

## Start development

```bash
# copy environment
$ cp .env.development .env

# run docker
$ docker-compose up -d --build mysql redis minio phpmyadmin

# run migration
$ npm run migration:run

# run server dev
$ npm run start:dev
```

## Command

```bash
# view current containers running
$ docker ps

# open container bash
$ docker exec -it <container_name> bash

# open log container
$ docker logs <container_name>

# open redis
$ docker exec -it redis redis-cli
```

## Services

- phpmyadmin: http://127.0.0.1:81
- minio: http://127.0.0.1:9000 (username: app - password: secretsecret - after run docker you need create a bucket "todo-app")
- mysql: host: 127.0.0.1 - port: 3306 - username: app - password: secret
- redis: host: 127.0.0.1 - port: 6379
