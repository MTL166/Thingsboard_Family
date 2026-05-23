# 智能家居平台

一个面向课程设计的轻量级智能家居 IoT 平台，参考 ThingsBoard 的设备管理、遥测数据、命令下发和规则联动思想。

## Language

### 设备身份

**Device**:
一个智能家居物理设备（灯具、窗帘电机或温度传感器）。通过唯一的 `device_key` 标识，属于某个 Room。
_Avoid_: 传感器、执行器、终端、节点

**device_key**:
设备在系统中的唯一标识字符串，在 ESP32 固件中写死。灯具固件里写 `light_001`，窗帘固件里写 `curtain_001`，温度传感器固件里写 `temp_001`。后端不会自动生成 device_key。
_Avoid_: device_id、设备编号、设备 MAC

**Device type**:
`light`（灯具）、`curtain`（窗帘电机）、`temperature_sensor`（温度传感器）。只此三种。
_Avoid_: 设备分类、硬件类型



**Online / Offline**:
设备在线状态。ESP32 每 15 秒发送一次 heartbeat，后端超过 45 秒未收到心跳标记为 offline。
_Avoid_: 连接/断开、在线/掉线、connected/disconnected

**Room**:
家庭空间分组（客厅、卧室、书房、阳台）。一个 Room 下可以有多个 Device，一个 Device 只能属于一个 Room。
_Avoid_: 区域、空间、zone、area

### 数据

**Telemetry**:
设备上报的时序数据，存入 `device_telemetry` 表作为历史记录。每条记录带时间戳，支持按时间范围查询和图表绘制。包括温度值、亮度数值、开关状态等。
_Avoid_: 传感器数据、采集数据、上报数据

**Latest State**:
设备当前最新状态，存入 `device_latest_state` 表，每次上报覆盖写入。前端用于快速展示"现在灯亮不亮""当前温度多少"。
_Avoid_: 实时状态、快照、当前值

### 控制

**Command**:
平台向设备下发的控制指令（开灯、关灯、设置亮度、打开/关闭/停止窗帘）。命令有完整生命周期：pending → sent → success/failed/timeout。超时阈值 5 秒。
_Avoid_: 指令、操作、order、request

**ACK**:
设备收到命令并执行后返回的回执消息。包含 `commandId`、`success`、`message`。后端收到 ACK 后更新命令状态为 success 或 failed。
_Avoid_: 响应、确认、response

### API

**Unified Response**:
所有 REST API 响应使用统一格式 `{"code": 200, "message": "ok", "data": {...}}`。前端 axios 拦截器统一处理 code 判断和错误提示。
_Avoid_: 裸返回、直接返回对象

### 自动化

**Automation Rule**:
由一个 condition（条件）和一个或多个 action（动作）组成的自动化规则。条件满足时按顺序执行所有动作。后端在收到遥测数据后以事件驱动方式检查规则。
_Avoid_: 场景、联动、scene、trigger

**Condition**:
规则的触发条件。格式：`{deviceKey, key, operator, value}`。operator 支持 `>`、`<`、`=`、`>=`、`<=`。
_Avoid_: 触发器、判断条件

**Action**:
规则触发后的执行动作。格式：`{deviceKey, command, params}`。例如 `{curtain_001, control_curtain, {action: "close"}}`。目标设备离线时跳过执行，记录 rule_log。
_Avoid_: 任务、操作

**Rule Log**:
规则执行记录。每次规则判断后记录 result（`triggered` / `skipped` / `failed`）和 message。设备离线导致跳过记为 `skipped`。
_Avoid_: 规则历史、执行日志

### 认证

**JWT Token**:
用户登录后获取的认证令牌，有效期 2 小时。前端每次请求在 Header 中携带。过期后需重新登录。
_Avoid_: session、cookie

**Registration**:
用户自助注册页面。注册功能面向所有访问者开放（不做首位用户限制），注册后即可登录使用系统。
_Avoid_: 注册、sign up

**Password Storage**:
用户密码使用 bcrypt 哈希存储于 `users.password_hash` 字段。
_Avoid_: 明文密码、MD5

### 消息

**MQTT Topic**:
消息主题，统一格式 `smarthome/{deviceKey}/{purpose}`。purpose 包括：`telemetry`、`status`、`heartbeat`、`command`、`command/ack`、`lifecycle`。
_Avoid_: 通道、队列、channel

**Heartbeat**:
设备定期发送的心跳消息，间隔 15 秒。只包含 `deviceKey` 和 `ts`。
_Avoid_: ping、keepalive、保活

**MQTT QoS**:
服务质量等级。heartbeat 和 telemetry 使用 QoS 0（最多一次，丢了不重发），command、ACK 和 lifecycle 使用 QoS 1（至少一次，保证送达），不做 QoS 2。
_Avoid_: 消息质量、可靠性

**WebSocket Message**:
后端通过 WebSocket 向前端推送的实时消息。统一 JSON 格式：`{type, deviceKey, data, ts}`。type 包括 `telemetry`、`status`、`command`、`rule`、`device_online`、`device_offline`。
_Avoid_: event、signal、push

### 网关

**ESP32 Gateway**:
ESP32 网关（BLE Central），通过 BLE 连接三合一外设 ESP32，统一通过 WiFi 和 MQTT 上传数据到云端。固件中维护 BLE MAC 到 device_key 的静态映射表。
_Avoid_: 协调器、集中器、hub

**ESP32 Peripheral**:
三合一外设 ESP32（BLE Peripheral），同时接灯（PWM）、窗帘电机和 DS18B20 温度传感器。一个 GATT Service 暴露三组 Characteristic（Light、Curtain、Temperature），通过 Notify 上报状态/温度，通过 Write 接收命令。系统逻辑上仍是三个独立 Device（`light_001`、`curtain_001`、`temp_001`）。
_Avoid_: 外设、传感器节点

## Example dialogue

> **Dev**: 用户点了一下客厅灯的开关按钮，前端做了什么？
>
> **Domain Expert**: 前端 POST `/api/devices/{light_001的uuid}/commands`，body 里写 `{"type": "set_light", "params": {"power": true}}`。后端创建一条 Command（status=pending），通过 MQTT 发到 `smarthome/light_001/command`。ESP32 网关收到后走 BLE 发给灯具模组，灯具执行后通过 BLE 回传结果，网关再发 MQTT `smarthome/light_001/command/ack`。后端收到 ACK 更新 Command 状态为 success，通过 WebSocket 推送 command 类型消息到前端，灯亮了。
>
> **Dev**: 如果我点的不是灯，是窗帘的"关闭"按钮呢？
>
> **Domain Expert**: 流程完全一样，只是 command type 变成 `control_curtain`，params 变成 `{"action": "close"}`。ESP32 网关收到后驱动电机反转关闭窗帘。所有 Command 都走同一套 lifecycle。
>
> **Dev**: 温度传感器呢？它不接收命令吧？
>
> **Domain Expert**: 对，温度传感器只是单向上报 Telemetry。DS18B20 每 5 秒通过 BLE 发温度到 ESP32 网关，网关 MQTT 发布到 `smarthome/temp_001/telemetry`。后端存入 `device_telemetry`（历史）和 `device_latest_state`（最新）。Automation Rule 用的就是这份数据——"温度 > 30°C 就触发关窗帘"。
