Status: needs-triage

## What to build

前端 /devices/:id 设备详情页。展示设备名称、类型、所属房间、在线状态标签。集成控制面板（灯具开关/亮度 或 窗帘三按钮 或 温度当前值，按设备类型展示对应控件）。WebSocket 实时更新状态。

## Acceptance criteria

- [ ] 设备详情页展示完整设备信息
- [ ] 根据设备类型渲染对应控制组件
- [ ] WebSocket 实时更新在线状态和最新数据
- [ ] 面包屑导航可返回设备列表

## Blocked by

- 19-control-panel
- 08-devices
