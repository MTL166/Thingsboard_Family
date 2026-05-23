Status: needs-triage

## What to build

初始化 Vue 3 + TypeScript 项目骨架，包含 Element Plus UI 库、Pinia 状态管理（authStore + deviceStore）、Vue Router 路由（所有页面占位）、axios 封装（统一拦截 code 和 JWT Header）。

## Acceptance criteria

- [ ] `npm run dev` 正常启动
- [ ] Element Plus 组件可在页面中使用
- [ ] Pinia 两个 Store（authStore、deviceStore）已定义
- [ ] 路由表包含所有页面路径（/login, /register, /dashboard, /rooms, /devices, /automation, /settings），均指向占位组件
- [ ] axios 拦截器：请求自动带 JWT Header，响应自动解包 code 并处理 401

## Blocked by

None - can start immediately
