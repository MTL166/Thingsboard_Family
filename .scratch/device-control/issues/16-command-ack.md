Status: needs-triage

## What to build

后端订阅 MQTT `smarthome/+/command/ack` Topic（QoS 1）。收到 ACK 消息后（含 commandId、deviceKey、success、message、ts），查找对应 command 记录更新 status（success/failed）和 ack_message。通过 WebSocket 推送 command 类型消息到前端通知用户执行结果。

## Acceptance criteria

- [ ] 收到 ACK 后正确更新 command 状态
- [ ] success=false 的 ACK 正确记录 ack_message
- [ ] ACK 处理后 WebSocket 推送结果到前端

## Blocked by

- 15-command-api
- 09-websocket
