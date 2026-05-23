Status: needs-triage

## What to build

后端收到 MQTT telemetry/status 消息后解析 JSON，写入 `device_telemetry`（追加历史记录，key 为字段名，value_num/value_bool/value_text 按数据类型存）和 `device_latest_state`（覆盖最新状态 JSONB）。收到 heartbeat 消息后更新 `devices.last_seen_at`。收到 lifecycle online 消息后更新 `devices.status = 'online'`。收到未知 device_key 的消息记录 WARNING 日志并忽略。

## Acceptance criteria

- [ ] 遥测数据正确写入 device_telemetry 和 device_latest_state
- [ ] 设备心跳更新 last_seen_at
- [ ] lifecycle online 更新设备 status 为 online
- [ ] 未知 device_key 消息记录 WARNING 日志，不写入数据库

## Blocked by

- 10-mqtt-backend
