Status: needs-triage

## What to build

用户注册页面和 JWT 登录的完整前后端。后端：注册 API（POST /api/auth/register，用户名+密码，bcrypt 哈希存入 users 表），登录 API（POST /api/auth/login，校验密码返回 JWT Token，2 小时有效期），JWT 拦截器校验除 /login 和 /register 外的所有请求。前端：/register 注册页（用户名+密码+确认密码），/login 登录页，登录成功后将 Token 存入 Pinia authStore 并跳转 Dashboard。

## Acceptance criteria

- [ ] 前端 /register 页面可正常注册新用户
- [ ] 前端 /login 页面可正常登录，登录后跳转到 /dashboard
- [ ] JWT Token 有效期 2 小时
- [ ] 未登录用户访问 /dashboard 等页面被重定向到 /login
- [ ] 密码以 bcrypt 哈希存储，不可逆
- [ ] 登录失败（密码错/用户不存在）前端显示错误提示

## Blocked by

- 01-spring-boot-scaffold
- 02-vue-scaffold
