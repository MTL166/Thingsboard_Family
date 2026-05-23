Status: needs-triage

## What to build

后端遥测查询 API：GET /api/devices/{id}/telemetry?key=temperature&from=...&to=...&page=0&size=20 支持分页和时间范围过滤。前端在设备详情页下方展示 ECharts 历史曲线图（X 轴时间、Y 轴数值），默认显示最近 1 小时数据。曲线下方 el-table 分页表格展示相同数据。温度传感器显示温度曲线、灯具显示亮度曲线、窗帘显示动作历史。

## Acceptance criteria

- [ ] API 支持按 key、时间范围查询遥测数据并分页
- [ ] ECharts 曲线图正确展示数据趋势
- [ ] 表格分页正常
- [ ] 时间范围切换可用（最近 1h / 6h / 24h / 自定义）

## Blocked by

- 11-telemetry-ingestion
