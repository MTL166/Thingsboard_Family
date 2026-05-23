Status: needs-triage

## What to build

后端命令查询 API：GET /api/devices/{id}/commands?page=0&size=20 分页返回命令列表（command_type、params、status、created_at、ack_message）。前端在设备详情页展示最近命令记录表格，分页显示，每条显示命令类型、参数、执行状态标签（pending/success/failed/timeout 不同颜色）。

## Acceptance criteria

- [ ] API 分页返回命令记录，按创建时间倒序
- [ ] 前端表格显示命令类型、参数、状态、时间
- [ ] 不同状态用不同颜色标签区分（success=绿、failed=红、timeout=橙、pending=灰）
- [ ] 分页可用

## Blocked by

- 16-command-ack
