Status: needs-triage

## What to build

创建 EMQX Cloud 实例（Serverless 免费版即可），获取 MQTT 连接地址（TLS）、端口、认证凭据。配置环境变量 `MQTT_BROKER_URL/USERNAME/PASSWORD` 供后端使用。

## Acceptance criteria

- [ ] EMQX Cloud 实例创建成功
- [ ] 使用 MQTTX 桌面工具可正常连接和收发消息
- [ ] TLS 连接地址和凭据已记录到环境变量

## Blocked by

None - can start immediately
