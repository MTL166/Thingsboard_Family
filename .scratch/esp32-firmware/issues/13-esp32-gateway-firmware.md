Status: needs-triage

## What to build

ESP32 网关固件（Arduino + NimBLE Central + PubSubClient）。连接 WiFi 后自动连接 EMQX Cloud。BLE Central 扫描并连接三合一外设，通过 GATT 读取 Notify（温度、自身状态、ACK）并转发为 MQTT 消息到对应 Topic，订阅 MQTT command Topic 并将收到的命令通过 GATT Write 发给外设。固件中维护 BLE MAC → device_key 静态映射表。WiFi 断开后每 5 秒自动重连，BLE 外设数据缓存本地（最多 10 条），重连后补发。

## Acceptance criteria

- [ ] WiFi 连接成功后可正常连接 EMQX Cloud
- [ ] BLE Central 可发现并连接三合一外设
- [ ] GATT Notify 消息正确转发为 MQTT publish（对应 device_key 和 Topic）
- [ ] MQTT command 消息正确转发为 GATT Write
- [ ] WiFi 断开后 5 秒重连，重连后缓存数据补发
- [ ] 启动时发布 lifecycle online，每 15 秒发 heartbeat

## Blocked by

- 05-esp32-dev-env
