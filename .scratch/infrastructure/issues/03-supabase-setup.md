Status: needs-triage

## What to build

创建 Supabase 项目，获取 PostgreSQL 连接字符串（含 SSL 配置），在 Supabase Dashboard 中验证数据库可连接。配置环境变量 `SPRING_DATASOURCE_URL/USERNAME/PASSWORD` 供后端使用。

## Acceptance criteria

- [ ] Supabase 项目创建成功
- [ ] PostgreSQL 连接字符串可用（含 SSL）
- [ ] 使用 Supabase SQL Editor 可正常执行查询
- [ ] 连接信息记录到环境变量

## Blocked by

None - can start immediately
