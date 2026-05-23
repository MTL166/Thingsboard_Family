Status: needs-triage

## What to build

后端 WebSocket 基础设施。前端建立连接时在 URL 上带 JWT Token（`ws://host/ws?token=xxx`），后端握手拦截器校验 JWT，通过后维护用户连接。后端提供 WebSocket 广播能力（向所有已认证连接推送消息）。消息格式统一为 `{type, deviceKey, data, ts}`。后端收到 MQTT heartbeat 后按 15s/45s 规则更新设备 online/offline，状态变化时通过 WebSocket 推送 `device_online`/`device_offline` 消息。前端 Pinia deviceStore 监听 WebSocket 消息实时更新在线状态，设备列表中显示绿色/灰色标签。

## Acceptance criteria

- [ ] 前端 WebSocket 连接成功（带 JWT）
- [ ] 握手阶段校验 Token，无效 Token 连接被拒
- [ ] 后端可向所有连接推送广播消息
- [ ] 超过 45 秒未收到 heartbeat 的设备自动标记 offline
- [ ] 离线设备重新 heartbeat 后自动标记 online
- [ ] 前端设备列表实时显示在线/离线标签变化
- [ ] WebSocket 消息格式符合 `{type, deviceKey, data, ts}`

## Blocked by

- 06-auth
