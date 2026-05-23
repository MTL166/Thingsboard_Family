Status: needs-triage

## What to build

前端异常提示完善。命令超时（5 秒无 ACK）：el-alert 显示"设备未响应，请检查设备在线状态"。设备离线：控制组件 disabled + 灰色"离线"标签。网络请求失败（HTTP 4xx/5xx/超时）：el-message 弹出"网络异常，请稍后重试"。组件加载状态：el-skeleton 骨架屏（列表页、仪表盘统计卡片）。

## Acceptance criteria

- [ ] 命令超时时前端显示超时提示
- [ ] 设备离线时控制组件 disabled + 离线标签
- [ ] 网络异常时 el-message 弹出错误提示
- [ ] 列表页加载中显示骨架屏

## Blocked by

- 19-control-panel
- 09-websocket
