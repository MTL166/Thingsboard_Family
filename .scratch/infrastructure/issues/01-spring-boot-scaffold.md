Status: ready-for-agent

## What to build

初始化 Spring Boot 3 项目骨架，包含包结构（auth/room/device/telemetry/command/mqtt/rule/websocket/common）、基础配置文件、Flyway 数据库迁移（8 张表建表 SQL）、统一 API 响应格式（`{code, message, data}`）、全局异常处理。

## Acceptance criteria

- [ ] Spring Boot 项目可正常启动
- [ ] application.yml 配置 Supabase PostgreSQL 数据源
- [ ] Flyway 在启动时自动执行建表 migration，8 张表全部创建成功
- [ ] 统一响应类 `ApiResponse<T>` 可用
- [ ] 全局异常处理器返回统一错误格式

## Blocked by

None - can start immediately
