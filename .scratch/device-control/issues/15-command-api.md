Status: needs-triage

## What to build

后端命令 API：POST /api/devices/{id}/commands 创建命令（status=pending，生成 UUID commandId），通过 MQTT 发布到 `smarthome/{deviceKey}/command`（QoS 1）。入参：command_type（set_light/control_curtain）、params（power/brightness 或 action）。前端调用 API 后按钮进入 loading 状态，等待 WebSocket 推送 ACK 结果。命令超时 5 秒，后端定时任务每 2 秒扫一次超过 5 秒仍为 pending 的 command 标记为 timeout，WebSocket 推送失败通知。

## Acceptance criteria

- [ ] POST /api/devices/{id}/commands 创建命令并返回 commandId
- [ ] 命令创建后 MQTT 发布到对应 device_key 的 command Topic
- [ ] 超时 5 秒自动标记 timeout
- [ ] 超时后 WebSocket 推送失败通知到前端

## Blocked by

- 10-mqtt-backend
- 08-devices
