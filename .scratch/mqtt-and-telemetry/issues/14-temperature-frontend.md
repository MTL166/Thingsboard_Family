Status: needs-triage

## What to build

前端温度传感器实时展示。deviceStore 监听 WebSocket 的 telemetry 类型消息，筛选 temperature_sensor 类型设备的温度值。创建温度卡片组件显示当前温度（大号数字，从 device_latest_state 获取初始值，WebSocket 实时更新）。集成到 /devices 列表中温度传感器所在行。

## Acceptance criteria

- [ ] 温度卡片显示当前温度值
- [ ] WebSocket 收到新温度数据时卡片实时更新
- [ ] 页面初始加载时从 GET /api/devices/{id}/latest-state 获取温度兜底值

## Blocked by

- 09-websocket
- 11-telemetry-ingestion
