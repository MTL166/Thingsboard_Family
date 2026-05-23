Status: needs-triage

## What to build

docker-compose.yml 编排前后端两个服务。backend 服务 build ./backend，端口映射 8080:8080，环境变量从 .env 文件注入（SPRING_DATASOURCE_URL/USERNAME/PASSWORD、MQTT_BROKER_URL/USERNAME/PASSWORD、JWT_SECRET）。frontend 服务 build ./frontend，端口映射 5173:80，depends_on backend，环境变量 VITE_API_BASE_URL 指向 backend。创建 .env.example 模板文件。

## Acceptance criteria

- [ ] docker-compose up 可一键启动前后端
- [ ] 后端容器成功连接 Supabase 和 EMQX Cloud
- [ ] 前端容器可通过 VITE_API_BASE_URL 访问后端 API
- [ ] 浏览器访问 localhost:5173 可正常使用完整系统

## Blocked by

- 27-dockerfiles
