Status: needs-triage

## What to build

设备管理 CRUD 完整前后端。后端：GET/POST/GET-by-id/PUT/DELETE /api/devices，设备字段包括 name、device_key、type（light/curtain/temperature_sensor）、room_id（可选）。前端：/devices 设备列表页，展示设备名称、类型、device_key、所属房间、在线状态，支持新增/编辑/删除。新增时弹窗选择设备类型和房间。设备由管理员手动录入。

## Acceptance criteria

- [ ] 设备列表页可正常展示所有设备
- [ ] 可新增设备（填 name、device_key、选 type、选 room）
- [ ] 可编辑设备信息
- [ ] 可删除设备
- [ ] 设备列表显示所属房间名称
- [ ] device_key 唯一，重复时后端返回错误、前端提示

## Blocked by

- 07-rooms
