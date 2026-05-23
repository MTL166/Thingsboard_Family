Status: needs-triage

## What to build

Spring Boot 后端使用 Eclipse Paho + spring-integration-mqtt 连接 EMQX Cloud。配置 MQTT 连接参数（TLS 地址、用户名、密码）。订阅 Topic 模式 `smarthome/+/telemetry`、`smarthome/+/status`、`smarthome/+/heartbeat`、`smarthome/+/command/ack`、`smarthome/+/lifecycle`。心跳 QoS 0、遥测 QoS 0、command/ack/lifecycle QoS 1。MQTT 消息处理用独立线程池，不阻塞主线程。

## Acceptance criteria

- [ ] 后端启动后成功连接 EMQX Cloud（TLS）
- [ ] 订阅所有 Topic 模式正常，无漏订
- [ ] MQTT 连接断开后自动重连
- [ ] 使用 MQTTX 发测试消息，后端日志可确认收到

## Blocked by

- 01-spring-boot-scaffold
- 04-emqx-setup
