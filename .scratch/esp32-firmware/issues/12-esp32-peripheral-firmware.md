Status: needs-triage

## What to build

ESP32 三合一外设固件（Arduino + NimBLE，BLE Peripheral 模式）。同时接灯（GPIO 开关 + PWM 亮度）、窗帘电机（GPIO 正转/反转/停止）、DS18B20（OneWire 读温度）。暴露一个 GATT Service，包含五组 Characteristic：Light Status（Notify）、Light Command（Write）、Curtain Status（Notify）、Curtain Command（Write）、Temperature（Notify）。每 5 秒读取 DS18B20 并通过 Temperature Notify 推送温度值。灯和窗帘收到 Command Write 后执行硬件动作，通过对应的 Status Notify 回传 ACK（含 commandId 和 success 状态）。

## Acceptance criteria

- [ ] BLE Peripheral 可被 Central 设备发现和连接
- [ ] DS18B20 每 5 秒读一次温度，值合理（±0.5°C 精度）
- [ ] GATT Notify 温度值可被 Central 端收到
- [ ] 收到 Light Command 后可控制灯开关和 PWM 亮度
- [ ] 收到 Curtain Command 后可控制电机正转/反转/停止
- [ ] 执行后回传 ACK 至对应的 Status Notify

## Blocked by

- 05-esp32-dev-env
