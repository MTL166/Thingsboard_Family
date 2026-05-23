Status: needs-triage

## What to build

搭建 ESP32 开发环境：安装 Arduino IDE（或 PlatformIO），配置 ESP32 开发板支持，安装 NimBLE 库和 PubSubClient 库。创建两个空白工程（Gateway + Peripheral），验证可编译和烧录。

## Acceptance criteria

- [ ] Arduino IDE 或 PlatformIO 可正常编译 ESP32 工程
- [ ] NimBLE 库已安装并可用
- [ ] PubSubClient 库已安装并可用
- [ ] 两块 ESP32 均可成功烧录并运行 Blink 示例
- [ ] Gateway 空白工程和 Peripheral 空白工程已创建

## Blocked by

None - can start immediately
