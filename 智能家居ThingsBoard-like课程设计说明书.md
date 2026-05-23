# 智能家居 ThingsBoard-like 平台课程设计说明书

## 1. 项目概述

本项目设计并实现一个面向课程设计场景的智能家居 IoT 平台。系统参考 ThingsBoard 的设备管理、遥测数据、命令下发和规则联动思想，但不直接二次开发 ThingsBoard 源码，而是基于 Java 后端、Vue 前端、EMQX Cloud、Supabase PostgreSQL 和 ESP32 自研一个轻量级智能家居平台。

系统支持灯具、窗帘电机和 DS18B20 温度传感器接入。设备通过 ESP32 使用 WiFi 连接云端 MQTT Broker，后端通过 MQTT 接收设备上报数据并下发控制命令，前端提供设备监控、远程控制、历史数据展示和自动化规则管理能力。

为提高系统部署的一致性和演示便利性，本项目加入 Docker 容器化技术。Spring Boot 后端和 Vue 前端可以分别构建为容器镜像，并通过 Docker Compose 在本地统一启动。云端演示时，Render 可作为后端服务部署平台和 API 代理入口，对外提供 HTTPS 访问地址，前端通过 Render 暴露的后端接口访问系统服务。

## 2. 建设目标

### 2.1 总体目标

构建一个完整的智能家居原型系统，实现从硬件设备接入、数据采集、云端处理、数据库存储到前端可视化控制的完整闭环。

### 2.2 具体目标

- 实现 ESP32 设备通过 MQTT 接入平台。
- 实现灯具开关和亮度控制。
- 实现窗帘电机开、关、停控制。
- 实现 DS18B20 温度数据采集与上报。
- 实现设备在线/离线状态展示。
- 实现设备遥测数据存储和历史曲线展示。
- 实现平台命令下发和设备 ACK 回执。
- 实现简单自动化规则，例如温度超过阈值后触发提示或执行设备命令。

## 3. 技术选型

| 模块 | 技术 |
|---|---|
| 前端 | Vue 3、TypeScript、Element Plus 或 Naive UI |
| 后端 | Java、Spring Boot |
| MQTT Broker | EMQX Cloud |
| 数据库 | Supabase PostgreSQL |
| 设备端 | ESP32 |
| 温度传感器 | DS18B20 |
| 通信协议 | MQTT、JSON |
| 前后端通信 | REST API、WebSocket 可选 |
| 图表展示 | ECharts |
| 容器化 | Docker、Docker Compose |
| 云端后端部署/代理 | Render |

## 4. 系统总体架构

```text
Vue 前端
  |
  | REST API / WebSocket
  v
Render 代理 / 后端服务入口
  |
  | HTTPS
  v
Spring Boot 后端容器
  |
  | SQL
  v
Supabase PostgreSQL

Spring Boot 后端容器
  |
  | MQTT Subscribe / Publish
  v
EMQX Cloud
  |
  | MQTT over WiFi
  v
ESP32 设备
  |
  +-- 灯具
  +-- 窗帘电机
  +-- DS18B20 温度传感器
```

### 4.1 部署架构

课程设计版本支持本地 Docker 部署和云端 Render 部署两种方式。

本地开发部署：

```text
Docker Compose
  |
  +-- Spring Boot 后端容器
  +-- Vue 前端容器

外部云服务：
  +-- EMQX Cloud
  +-- Supabase PostgreSQL
```

云端演示部署：

```text
Vue 前端
  |
  | HTTPS API 请求
  v
Render Web Service
  |
  | 运行 Spring Boot 后端容器
  v
Spring Boot 后端
  |
  +-- 连接 Supabase PostgreSQL
  +-- 连接 EMQX Cloud
```

Render 在本项目中的作用：

- 作为 Spring Boot 后端的云端运行环境。
- 为后端接口提供公网 HTTPS 地址。
- 作为前端访问后端 API 的代理入口。
- 管理后端环境变量，例如数据库连接、EMQX 连接参数、JWT 密钥等。

说明：Supabase PostgreSQL 和 EMQX Cloud 仍作为独立云服务使用，不部署在 Render 内部。

### 4.2 数据上报流程

```text
ESP32 采集设备状态或温度
  -> 发布 MQTT 消息到 EMQX Cloud
  -> Spring Boot 后端订阅 Topic
  -> 解析 JSON 数据
  -> 写入 Supabase PostgreSQL
  -> 前端查询或实时展示
```

### 4.3 命令控制流程

```text
用户在 Vue 前端点击控制按钮
  -> 通过 Render HTTPS 地址调用 Spring Boot 控制接口
  -> 后端生成命令记录
  -> 后端发布 MQTT command 消息
  -> ESP32 接收并执行命令
  -> ESP32 发布 command/ack 回执
  -> 后端更新命令状态
  -> 前端展示执行结果
```

## 5. 功能需求

### 5.1 用户登录

课程设计版本可实现简单管理员登录，不使用 Supabase Auth，由 Spring Boot 后端自行完成用户校验。

功能包括：

- 用户名密码登录。
- 登录后访问系统主界面。
- 未登录用户不能访问设备管理和控制页面。

### 5.2 房间管理

用于对家庭空间进行简单分类。

功能包括：

- 新增房间。
- 编辑房间名称。
- 删除房间。
- 查看房间下的设备。

示例房间：

- 客厅
- 卧室
- 书房
- 阳台

### 5.3 设备管理

支持三类设备：

- 灯具：`light`
- 窗帘：`curtain`
- 温度传感器：`temperature_sensor`

功能包括：

- 新增设备。
- 编辑设备信息。
- 删除设备。
- 绑定设备到房间。
- 查看设备在线状态。
- 查看设备最新状态。

### 5.4 灯具控制

灯具设备支持：

- 开灯。
- 关灯。
- 设置亮度。
- 查看当前开关状态。
- 查看当前亮度。

### 5.5 窗帘控制

窗帘电机支持：

- 打开。
- 关闭。
- 停止。
- 查看最近执行动作。

课程设计版本不做百分比位置控制，降低硬件和软件复杂度。

### 5.6 温度采集

温度传感器使用 DS18B20。

功能包括：

- ESP32 定时读取 DS18B20 温度。
- 通过 MQTT 上报温度数据。
- 后端保存温度历史数据。
- 前端展示当前温度。
- 前端展示温度历史曲线。

### 5.7 命令记录

平台需要记录每次命令下发和执行结果。

命令状态包括：

- `pending`：待执行。
- `sent`：已发送。
- `success`：执行成功。
- `failed`：执行失败。
- `timeout`：超时未响应。

### 5.8 自动化规则

课程设计版本实现简单规则即可。

示例：

```text
当温度大于 30 摄氏度时，自动关闭窗帘。
```

规则由条件和动作组成：

- 条件：设备、数据字段、比较符、阈值。
- 动作：目标设备、命令类型、命令参数。

## 6. MQTT 协议设计

### 6.1 Topic 规范

统一使用 `smarthome/{deviceKey}/...` 作为 Topic 前缀。

| 用途 | Topic |
|---|---|
| 设备遥测上报 | `smarthome/{deviceKey}/telemetry` |
| 设备状态上报 | `smarthome/{deviceKey}/status` |
| 设备心跳 | `smarthome/{deviceKey}/heartbeat` |
| 平台命令下发 | `smarthome/{deviceKey}/command` |
| 设备命令回执 | `smarthome/{deviceKey}/command/ack` |
| 设备生命周期 | `smarthome/{deviceKey}/lifecycle` |

### 6.2 DS18B20 温度上报

```json
{
  "deviceKey": "temp_001",
  "type": "temperature_sensor",
  "ts": 1710000000000,
  "values": {
    "temperature": 26.5
  }
}
```

### 6.3 灯具状态上报

```json
{
  "deviceKey": "light_001",
  "type": "light",
  "ts": 1710000000000,
  "state": {
    "power": true,
    "brightness": 80
  }
}
```

### 6.4 窗帘状态上报

```json
{
  "deviceKey": "curtain_001",
  "type": "curtain",
  "ts": 1710000000000,
  "state": {
    "lastAction": "open"
  }
}
```

### 6.5 灯具控制命令

```json
{
  "commandId": "cmd_001",
  "type": "set_light",
  "params": {
    "power": true,
    "brightness": 80
  },
  "ts": 1710000000000
}
```

### 6.6 窗帘控制命令

```json
{
  "commandId": "cmd_002",
  "type": "control_curtain",
  "params": {
    "action": "open"
  },
  "ts": 1710000000000
}
```

`action` 可选值：

```text
open
close
stop
```

### 6.7 命令 ACK

```json
{
  "commandId": "cmd_002",
  "deviceKey": "curtain_001",
  "success": true,
  "message": "curtain opened",
  "ts": 1710000005000
}
```

### 6.8 设备心跳

```json
{
  "deviceKey": "light_001",
  "ts": 1710000000000
}
```

## 7. 数据库设计

### 7.1 用户表

```sql
create table users (
  id uuid primary key default gen_random_uuid(),
  username text unique not null,
  password_hash text not null,
  display_name text,
  created_at timestamptz default now()
);
```

### 7.2 房间表

```sql
create table rooms (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  created_at timestamptz default now()
);
```

### 7.3 设备表

```sql
create table devices (
  id uuid primary key default gen_random_uuid(),
  room_id uuid references rooms(id) on delete set null,
  name text not null,
  device_key text unique not null,
  type text not null check (type in ('light', 'curtain', 'temperature_sensor')),
  status text not null default 'offline',
  last_seen_at timestamptz,
  created_at timestamptz default now()
);
```

### 7.4 设备最新状态表

```sql
create table device_latest_state (
  device_id uuid primary key references devices(id) on delete cascade,
  state jsonb not null default '{}',
  updated_at timestamptz default now()
);
```

### 7.5 遥测数据表

```sql
create table device_telemetry (
  id bigserial primary key,
  device_id uuid references devices(id) on delete cascade,
  key text not null,
  value_num double precision,
  value_text text,
  value_bool boolean,
  ts timestamptz not null default now()
);
```

### 7.6 命令记录表

```sql
create table device_commands (
  id uuid primary key default gen_random_uuid(),
  device_id uuid references devices(id) on delete cascade,
  command_type text not null,
  params jsonb not null default '{}',
  status text not null default 'pending',
  ack_message text,
  created_at timestamptz default now(),
  sent_at timestamptz,
  acknowledged_at timestamptz
);
```

### 7.7 自动化规则表

```sql
create table automation_rules (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  enabled boolean default true,
  condition jsonb not null,
  action jsonb not null,
  created_at timestamptz default now()
);
```

### 7.8 规则执行日志表

```sql
create table rule_logs (
  id bigserial primary key,
  rule_id uuid references automation_rules(id) on delete cascade,
  device_id uuid references devices(id) on delete set null,
  result text not null,
  message text,
  created_at timestamptz default now()
);
```

## 8. 后端设计

### 8.1 后端包结构

```text
com.example.smarthome
  auth
  room
  device
  telemetry
  command
  mqtt
  rule
  websocket
  common
```

### 8.2 Docker 容器化设计

后端使用 Dockerfile 构建 Spring Boot 镜像。构建流程为先通过 Maven 打包生成 `jar` 文件，再使用 JRE 基础镜像运行应用。

后端容器需要配置的环境变量：

```text
SERVER_PORT
SPRING_DATASOURCE_URL
SPRING_DATASOURCE_USERNAME
SPRING_DATASOURCE_PASSWORD
MQTT_BROKER_URL
MQTT_USERNAME
MQTT_PASSWORD
JWT_SECRET
```

前端使用 Dockerfile 构建 Vue 镜像。构建流程为先通过 Node.js 安装依赖并执行构建，再使用 Nginx 镜像托管静态文件。

前端容器需要配置的环境变量：

```text
VITE_API_BASE_URL
```

本地开发可以使用 Docker Compose 统一启动前端和后端。数据库和 MQTT Broker 使用云端服务，因此 Compose 文件中不需要启动 PostgreSQL 和 EMQX。

### 8.3 核心模块说明

| 模块 | 说明 |
|---|---|
| `auth` | 登录认证、Token 校验 |
| `room` | 房间增删改查 |
| `device` | 设备管理、在线状态维护 |
| `telemetry` | 遥测数据解析、入库、查询 |
| `command` | 命令创建、下发、ACK 更新 |
| `mqtt` | EMQX 连接、Topic 订阅和消息发布 |
| `rule` | 自动化规则判断和执行 |
| `websocket` | 前端实时状态推送，可选 |
| `common` | 通用响应、异常处理、工具类 |

### 8.4 REST API 设计

#### 登录

```text
POST /api/auth/login
```

#### 房间管理

```text
GET    /api/rooms
POST   /api/rooms
PUT    /api/rooms/{id}
DELETE /api/rooms/{id}
```

#### 设备管理

```text
GET    /api/devices
POST   /api/devices
GET    /api/devices/{id}
PUT    /api/devices/{id}
DELETE /api/devices/{id}
```

#### 设备遥测

```text
GET /api/devices/{id}/telemetry
GET /api/devices/{id}/latest-state
```

#### 设备控制

```text
POST /api/devices/{id}/commands
GET  /api/devices/{id}/commands
```

#### 自动化规则

```text
GET    /api/automation-rules
POST   /api/automation-rules
PUT    /api/automation-rules/{id}
DELETE /api/automation-rules/{id}
PATCH  /api/automation-rules/{id}/enabled
```

## 9. 前端设计

### 9.1 页面结构

```text
/login                 登录页
/dashboard             首页仪表盘
/rooms                 房间管理
/rooms/:id             房间设备视图
/devices               设备列表
/devices/:id           设备详情
/automation            自动化规则
/settings              系统设置
```

### 9.2 首页仪表盘

展示内容：

- 设备总数。
- 在线设备数。
- 离线设备数。
- 当前温度。
- 灯具状态。
- 窗帘状态。
- 最近命令记录。
- 温度趋势图。

### 9.3 设备详情页

展示内容：

- 设备名称。
- 设备类型。
- 所属房间。
- 在线状态。
- 最新状态。
- 控制面板。
- 历史数据曲线。
- 命令执行记录。

### 9.4 控制面板

灯具控制：

- 开关按钮。
- 亮度滑块。

窗帘控制：

- 打开按钮。
- 关闭按钮。
- 停止按钮。

温度传感器：

- 当前温度。
- 历史温度曲线。

## 10. ESP32 设备端设计

### 10.1 通用启动流程

```text
1. 初始化串口和硬件引脚。
2. 连接 WiFi。
3. 连接 EMQX Cloud。
4. 发布 lifecycle online。
5. 订阅 smarthome/{deviceKey}/command。
6. 定时发布 heartbeat。
7. 根据设备类型上报 telemetry 或 status。
8. 接收到 command 后执行硬件动作。
9. 发布 command/ack。
```

### 10.2 灯具设备

硬件能力：

- GPIO 控制开关。
- PWM 控制亮度。

支持命令：

```text
set_light
```

参数：

```json
{
  "power": true,
  "brightness": 80
}
```

### 10.3 窗帘设备

硬件能力：

- 电机正转打开。
- 电机反转关闭。
- 停止电机。

支持命令：

```text
control_curtain
```

参数：

```json
{
  "action": "open"
}
```

### 10.4 温度传感器设备

硬件能力：

- ESP32 读取 DS18B20。
- 定时上报温度。

上报周期建议：

```text
5 秒到 30 秒一次，课程设计演示可使用 5 秒。
```

## 11. 自动化规则设计

### 11.1 规则数据结构

```json
{
  "condition": {
    "deviceKey": "temp_001",
    "key": "temperature",
    "operator": ">",
    "value": 30
  },
  "action": {
    "deviceKey": "curtain_001",
    "command": "control_curtain",
    "params": {
      "action": "close"
    }
  }
}
```

### 11.2 支持的条件运算符

```text
>
<
=
>=
<=
```

### 11.3 支持的动作

```text
开灯
关灯
设置亮度
打开窗帘
关闭窗帘
停止窗帘
```

## 12. 开发计划

### Phase 0：环境准备

任务：

- 创建 Supabase 项目。
- 创建 EMQX Cloud 实例。
- 初始化 Spring Boot 项目。
- 初始化 Vue 3 项目。
- 准备 ESP32 开发环境。
- 准备 DS18B20、灯具控制模块、窗帘电机驱动模块。
- 安装 Docker Desktop。
- 准备后端 Dockerfile、前端 Dockerfile 和 docker-compose.yml。
- 创建 Render 账号并准备后端 Web Service。

验收标准：

```text
后端、前端、数据库、MQTT Broker、Docker 和 ESP32 开发环境均可正常运行。
```

### Phase 1：打通温度上报链路

任务：

- ESP32 连接 WiFi。
- ESP32 连接 EMQX Cloud。
- ESP32 读取 DS18B20 温度。
- 后端订阅 telemetry Topic。
- 后端解析温度数据并写入数据库。
- 前端展示当前温度。

验收标准：

```text
ESP32 上报温度后，数据库能看到记录，前端能看到最新温度。
```

### Phase 2：打通设备控制链路

任务：

- 前端实现灯具控制按钮和亮度滑块。
- 前端实现窗帘打开、关闭、停止按钮。
- 后端实现命令创建和 MQTT 发布。
- ESP32 接收命令并执行硬件动作。
- ESP32 返回 ACK。
- 后端更新命令状态。

验收标准：

```text
用户在前端点击控制按钮后，真实设备动作发生，命令记录显示执行成功。
```

### Phase 3：完善后台管理

任务：

- 实现登录。
- 实现房间管理。
- 实现设备管理。
- 实现设备详情页。
- 实现历史温度曲线。
- 实现设备在线/离线状态。

验收标准：

```text
用户可以完整管理房间和设备，并查看设备状态与历史数据。
```

### Phase 4：实现自动化规则

任务：

- 实现规则新增、编辑、删除。
- 实现规则启用和停用。
- 后端在收到遥测数据后判断规则条件。
- 条件满足时自动执行动作。
- 记录规则执行日志。

验收标准：

```text
当温度满足设定条件时，系统可以自动触发对应设备命令。
```

### Phase 5：演示优化

任务：

- 优化 Dashboard。
- 增加异常提示。
- 美化前端界面。
- 准备演示数据。
- 编写部署说明。
- 编写课程设计报告。

验收标准：

```text
系统可以稳定完成课堂演示，功能链路完整，界面清晰。
```

### Phase 6：Docker 与 Render 部署

任务：

- 编写 Spring Boot 后端 Dockerfile。
- 编写 Vue 前端 Dockerfile。
- 编写 docker-compose.yml。
- 使用 Docker Compose 本地启动前后端。
- 将后端部署到 Render Web Service。
- 在 Render 中配置 Supabase 和 EMQX Cloud 连接环境变量。
- 配置前端 API 地址，使其请求 Render 后端接口。

验收标准：

```text
系统可以通过 Docker 在本地一键启动，后端可以部署到 Render，并通过 Render 提供的 HTTPS 地址访问 API。
```

## 13. Docker 与 Render 部署设计

### 13.1 Docker 容器化目标

Docker 的主要目标是统一运行环境，避免不同电脑上 Java、Node.js、依赖版本不一致导致系统无法运行。通过 Dockerfile 和 Docker Compose，可以让课程设计演示环境更加稳定。

容器化对象：

- Spring Boot 后端。
- Vue 前端。

不容器化对象：

- Supabase PostgreSQL，使用云服务。
- EMQX Cloud，使用云服务。
- ESP32 设备端，运行在硬件上。

### 13.2 本地 Docker Compose 结构

```text
docker-compose.yml
  |
  +-- backend
  |     +-- Spring Boot
  |     +-- 连接 Supabase PostgreSQL
  |     +-- 连接 EMQX Cloud
  |
  +-- frontend
        +-- Vue 静态页面
        +-- 调用 backend API
```

### 13.3 后端 Dockerfile 思路

```dockerfile
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY target/smarthome.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### 13.4 前端 Dockerfile 思路

```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
```

### 13.5 Docker Compose 思路

```yaml
services:
  backend:
    build: ./backend
    ports:
      - "8080:8080"
    environment:
      SPRING_DATASOURCE_URL: ${SPRING_DATASOURCE_URL}
      SPRING_DATASOURCE_USERNAME: ${SPRING_DATASOURCE_USERNAME}
      SPRING_DATASOURCE_PASSWORD: ${SPRING_DATASOURCE_PASSWORD}
      MQTT_BROKER_URL: ${MQTT_BROKER_URL}
      MQTT_USERNAME: ${MQTT_USERNAME}
      MQTT_PASSWORD: ${MQTT_PASSWORD}

  frontend:
    build: ./frontend
    ports:
      - "5173:80"
    depends_on:
      - backend
```

### 13.6 Render 代理设计

Render 用于部署 Spring Boot 后端，并为后端服务提供公网 HTTPS 地址。前端无需直接暴露数据库或 MQTT 连接信息，所有业务请求都先访问 Render 后端，再由后端访问 Supabase PostgreSQL 和 EMQX Cloud。

访问路径：

```text
Vue 前端
  -> https://your-service.onrender.com/api/...
  -> Spring Boot 后端
  -> Supabase PostgreSQL / EMQX Cloud
```

Render 需要配置的环境变量：

```text
SPRING_DATASOURCE_URL
SPRING_DATASOURCE_USERNAME
SPRING_DATASOURCE_PASSWORD
MQTT_BROKER_URL
MQTT_USERNAME
MQTT_PASSWORD
JWT_SECRET
```

### 13.7 Render 部署注意事项

- 后端服务端口应使用 Render 提供的 `PORT` 环境变量，或在 Spring Boot 中映射到对应端口。
- Supabase 数据库连接建议启用 SSL。
- EMQX Cloud 建议使用 TLS 连接地址。
- 前端只保存 Render 后端 API 地址，不保存数据库和 MQTT 密钥。
- 免费实例可能存在冷启动，课程演示前应提前访问一次后端接口。

## 14. 测试方案

### 14.1 功能测试

- 登录是否成功。
- 房间是否能正常增删改查。
- 设备是否能正常增删改查。
- 温度数据是否能正常上报。
- 灯具命令是否能正常执行。
- 窗帘命令是否能正常执行。
- 命令 ACK 是否能正常更新。
- 自动化规则是否能正常触发。

### 14.2 MQTT 测试

可使用 MQTTX 工具模拟设备。

测试内容：

- 发布温度遥测消息。
- 发布设备心跳消息。
- 订阅命令 Topic。
- 模拟设备 ACK。

### 14.3 数据库测试

- 检查设备数据是否正确入库。
- 检查温度历史是否完整。
- 检查命令状态是否正确更新。
- 检查规则日志是否正确生成。

### 14.4 硬件测试

- ESP32 是否能稳定连接 WiFi。
- ESP32 是否能稳定连接 EMQX Cloud。
- DS18B20 温度读取是否正确。
- 灯具开关和亮度控制是否正常。
- 窗帘电机打开、关闭、停止是否正常。

### 14.5 部署测试

- Docker Compose 是否能正常启动前端和后端。
- 后端容器是否能连接 Supabase PostgreSQL。
- 后端容器是否能连接 EMQX Cloud。
- Render 后端服务是否能正常启动。
- 前端是否能通过 Render 地址调用后端 API。
- Render 环境变量是否配置正确。

## 15. 项目亮点

- 参考 ThingsBoard 的 IoT 平台设计思想，但实现更轻量，适合课程设计。
- 使用 MQTT 实现设备和平台之间的低耦合通信。
- 使用 EMQX Cloud 提供稳定的云端消息代理能力。
- 使用 Supabase PostgreSQL 存储设备、遥测和命令数据。
- 使用 Docker 容器化前后端，提升部署一致性和演示稳定性。
- 使用 Render 作为后端云端部署和代理入口，提供公网 HTTPS API。
- 使用 ESP32 实现真实硬件接入。
- 覆盖智能家居中的监控、控制、数据存储、规则联动等核心场景。

## 16. 后续扩展方向

课程设计完成后，可以继续扩展：

- 多家庭、多用户权限。
- 手机 App。
- 设备配网功能。
- OTA 固件升级。
- 语音助手控制。
- 更复杂的规则引擎。
- 告警通知。
- 能耗统计。
- 接入更多传感器和执行器。

## 17. 总结

本系统以智能家居为应用场景，综合使用 Java 后端、Vue 前端、MQTT、EMQX Cloud、Supabase PostgreSQL、Docker、Render 和 ESP32 等技术，实现了一个完整的物联网平台原型。系统能够完成设备接入、数据采集、远程控制、历史数据展示、自动化规则联动和容器化部署，具有较强的工程实践价值和课程设计展示价值。
