# CloudBase collections for 风里约行

Create these collections in the CloudBase console before deploying the API function:

- `users`: only through cloud function; no client direct access. 服务端写入必须显式携带 `_openid`，否则归属查询失效。
- `routes`: public read through cloud function; write only by owner via cloud function. 用户创建的路线必须带 `_openid`；系统种子路线可无 `_openid`。
- `plans`: private per user; created when a route is adopted as a personal plan. 必须带 `_openid`。
- `route_saves`: legacy private saves; do not use for new plan flows.
- `invitations`: route-based, visibility governed by cloud function. 发起人写入必须带 `_openid`。
- `invitation_members`: private membership records. 必须带 `_openid`（身份）与 `user_id`（users 文档 _id，用于共同邀约查询）。
- `invitation_questions`: 邀约发起前的提问，写自提问者，仅发起人可见，必须带 `_openid`。
- `conversations`: only participants may read via cloud function.
- `messages`: only conversation participants may read via cloud function. 每条消息必须带 `sender_id`（发送者 openid）。
- `reports`: write-only from user perspective; moderation-only read. 必须带 `reporter_openid`。
- `blocks`: private per user.

Do not give client-side “all users read/write” database permissions. The `api` cloud function must enforce ownership and participant checks for every request.

> 关键约定：云函数端（wx-server-sdk）写入**不会自动生成 `_openid`**，所有需要归属/权限校验的写入必须在 data 中显式携带 `_openid`（与 `cloud.getWXContext().OPENID` 一致）。
