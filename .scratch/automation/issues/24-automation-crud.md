Status: needs-triage

## What to build

后端自动化规则 CRUD API：GET/POST/PUT/DELETE/PATCH(enabled) /api/automation-rules。规则包含 name、enabled、condition（{deviceKey, key, operator, value}）、actions（数组，每项 {deviceKey, command, params}）。前端 /automation 规则列表页，可新增/编辑/删除/启用停用规则。新增编辑时动态表单：选择条件设备（下拉）、字段（温度/亮度等）、运算符（>/</=/>=/<=）、阈值（数字），选择动作设备、命令类型、参数。一个规则支持添加多个动作（动态增删行）。

## Acceptance criteria

- [ ] 规则列表页可正常展示
- [ ] 可新增规则（一个条件 + 多个动作）
- [ ] 可编辑规则
- [ ] 可删除规则
- [ ] 可启用/停用规则（PATCH /api/automation-rules/{id}/enabled）
- [ ] 动态表单支持多动作增删

## Blocked by

- 08-devices
