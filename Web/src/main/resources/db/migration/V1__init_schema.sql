-- Users: 用户表（自注册、bcrypt 密码哈希）
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    display_name TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Rooms: 房间表（客厅、卧室等）
CREATE TABLE rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Devices: 设备表（light / curtain / temperature_sensor）
CREATE TABLE devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID REFERENCES rooms(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    device_key TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('light', 'curtain', 'temperature_sensor')),
    status TEXT NOT NULL DEFAULT 'offline',
    last_seen_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Device Latest State: 设备最新状态（覆盖写入）
CREATE TABLE device_latest_state (
    device_id UUID PRIMARY KEY REFERENCES devices(id) ON DELETE CASCADE,
    state JSONB NOT NULL DEFAULT '{}',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Device Telemetry: 遥测历史数据（追加写入，支持时间范围查询）
CREATE TABLE device_telemetry (
    id BIGSERIAL PRIMARY KEY,
    device_id UUID REFERENCES devices(id) ON DELETE CASCADE,
    key TEXT NOT NULL,
    value_num DOUBLE PRECISION,
    value_text TEXT,
    value_bool BOOLEAN,
    ts TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Device Commands: 命令记录表（pending → sent → success/failed/timeout）
CREATE TABLE device_commands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id UUID REFERENCES devices(id) ON DELETE CASCADE,
    command_type TEXT NOT NULL,
    params JSONB NOT NULL DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'pending',
    ack_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    sent_at TIMESTAMPTZ,
    acknowledged_at TIMESTAMPTZ
);

-- Automation Rules: 自动化规则表
CREATE TABLE automation_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    condition JSONB NOT NULL,
    action JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Rule Logs: 规则执行日志表
CREATE TABLE rule_logs (
    id BIGSERIAL PRIMARY KEY,
    rule_id UUID REFERENCES automation_rules(id) ON DELETE CASCADE,
    device_id UUID REFERENCES devices(id) ON DELETE SET NULL,
    result TEXT NOT NULL,
    message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for common queries
CREATE INDEX idx_devices_room_id ON devices(room_id);
CREATE INDEX idx_devices_device_key ON devices(device_key);
CREATE INDEX idx_device_telemetry_device_id_ts ON device_telemetry(device_id, ts DESC);
CREATE INDEX idx_device_telemetry_key ON device_telemetry(key);
CREATE INDEX idx_device_commands_device_id ON device_commands(device_id, created_at DESC);
CREATE INDEX idx_rule_logs_rule_id ON rule_logs(rule_id, created_at DESC);
