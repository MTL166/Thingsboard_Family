Status: needs-triage

## What to build

前端控制面板。灯具：开关按钮（el-switch）+ 亮度滑块（el-slider，0-100），点击/滑动后调 POST /api/devices/{id}/commands，等待 WebSocket ACK 反馈。窗帘：三个按钮（打开/关闭/停止），点击后调命令 API。按钮执行期间 loading 状态，成功/失败/超时后 el-message 提示。设备离线时控制组件整体 disabled + 显示"离线"标签。

## Acceptance criteria

- [ ] 灯具开关按钮可控制灯开关
- [ ] 亮度滑块可调节亮度值
- [ ] 窗帘三个按钮可控制电机动作
- [ ] 执行期间按钮 loading，完成后显示结果提示
- [ ] 设备离线时控制组件 disabled + 显示"离线"

## Blocked by

- 16-command-ack
