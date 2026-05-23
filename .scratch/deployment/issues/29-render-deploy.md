Status: needs-triage

## What to build

在 Render 上创建 Web Service 部署 Spring Boot 后端。关联 GitHub 仓库，指定 Dockerfile 路径为 backend/Dockerfile。在 Render Dashboard 配置所有环境变量（SPRING_DATASOURCE_URL/USERNAME/PASSWORD、MQTT_BROKER_URL/USERNAME/PASSWORD、JWT_SECRET、SERVER_PORT=8080）。后端 CORS 配置允许 Render 前端域名和本地 localhost:5173。获取 Render 提供的 HTTPS 地址后更新前端 VITE_API_BASE_URL 为 Render 地址。

## Acceptance criteria

- [ ] Render Web Service 成功启动后端容器
- [ ] Render HTTPS 地址可正常访问 API（如 GET /api/devices 返回 JSON）
- [ ] 前端配置 Render 地址后可正常完成登录、查看设备、控制设备
- [ ] Render 环境变量配置正确，数据库和 MQTT 连接正常

## Blocked by

- 28-docker-compose
