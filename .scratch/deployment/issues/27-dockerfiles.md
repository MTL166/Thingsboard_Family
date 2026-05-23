Status: needs-triage

## What to build

Spring Boot 后端 Dockerfile：使用 eclipse-temurin:17-jre 基础镜像，COPY JAR 文件，EXPOSE 8080，通过环境变量注入 Supabase 和 EMQX 连接参数。Vue 前端 Dockerfile：多阶段构建，node:20-alpine 编译，nginx:alpine 托管 dist，EXPOSE 80。.dockerignore 排除 node_modules、target 等。

## Acceptance criteria

- [ ] 后端 Dockerfile 可成功构建镜像
- [ ] 前端 Dockerfile 可成功构建镜像
- [ ] 后端容器启动后通过 localhost:8080 可访问 API
- [ ] 前端容器启动后通过 localhost:80 可访问页面，API 请求转发到后端

## Blocked by

- 01-spring-boot-scaffold
- 02-vue-scaffold
