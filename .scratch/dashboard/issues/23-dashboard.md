Status: needs-triage

## What to build

前端 /dashboard 首页仪表盘。四个统计卡片（设备总数、在线设备数、离线设备数、在线率）。从 Pinia deviceStore 获取设备列表计算统计。WebSocket 监听设备上下线实时更新。下方展示最近 10 条命令记录和当前温度卡片。

## Acceptance criteria

- [ ] 统计卡片展示设备总数/在线数/离线数/在线率
- [ ] 设备上下线时统计数据实时更新
- [ ] 当前温度卡片显示
- [ ] 最近命令记录列表（最新 10 条）

## Blocked by

- 20-device-detail-page
- 21-telemetry-history
