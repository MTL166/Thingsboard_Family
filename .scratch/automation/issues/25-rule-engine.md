Status: needs-triage

## What to build

后端规则引擎：在遥测数据入库后（同方法内），根据 device_key 查找所有 enabled 且 condition.deviceKey 匹配的自动化规则。判断 condition 是否满足（根据 operator 比较遥测值和阈值）。满足时按顺序执行所有 action：为每个 action 创建一个 Command 并通过 MQTT 下发（复用命令模块）。目标设备离线时跳过该 action，记录 rule_log（result=skipped，message=target device offline）。执行成功记录 rule_log（result=triggered）。规则日志存入 rule_logs 表。

## Acceptance criteria

- [ ] 遥测数据入库后自动检查匹配规则
- [ ] 条件满足时按顺序执行所有动作
- [ ] 目标设备离线时跳过并记录 skipped 日志
- [ ] rule_logs 表正确记录每次规则执行结果
- [ ] 条件不满足时不触发任何动作

## Blocked by

- 24-automation-crud
- 11-telemetry-ingestion
