# Firebase 配置：账号、云同步与教练分享

这个应用默认采用本地优先的数据模型，但当前版本启用了白名单登录：只有配置 Firebase 并通过白名单校验的账号才能加载技能数据。未配置 Firebase 时只会显示配置页，不会进入应用。教练查看只读分享链接不需要登录。

## 1. 创建 Firebase 项目

1. 用 Google 账号登录 [Firebase Console](https://console.firebase.google.com/)。
2. 新建项目，例如 `badminton-skills`。Google Analytics 可以不启用。
3. 使用 **Spark（免费）套餐**。这个功能不需要 Cloud Functions、Hosting 或 Storage，不需要升级 Blaze，也不需要付款信息。
4. 在「项目设置 → 你的应用」里添加一个 **Web 应用**，复制 `firebaseConfig`。

Firebase 的 Spark 免费额度会随产品调整，以控制台实际显示为准。个人使用和少量教练查看远低于 Firestore 免费额度。

## 2. 启用登录方式

在 Firebase Console 左侧找到 **Security（安全）** → **Authentication（身份验证）**。第一次进入时先点击 **Get started（开始使用）**，然后打开顶部的 **Sign-in method（登录方法）** 标签页。

如果找不到，可以直接打开：

```text
https://console.firebase.google.com/project/你的项目ID/authentication/providers
```

在「Sign-in method」中启用：

- **Email/Password**：应用内的邮箱注册/登录。注册后会发送验证邮件；未验证邮箱不能通过白名单。
- **Google**（可选）：一键登录。需要设置公开的支持邮箱。

每项修改后都要点击 **Save（保存）**。

在「Authentication → Settings → Authorized domains」确认包含：

- `localhost`（本地开发）
- `eliaztray.github.io`（当前 GitHub Pages 域名；不要带路径）

如果使用自定义域名，也要把域名加入授权列表。Google 登录如果提示 `auth/unauthorized-domain`，通常是这里没有加入当前域名。

## 3. 创建 Firestore

1. 打开「Firestore Database」。
2. 创建数据库，选择 **Native mode**。
3. 选择离你较近的区域，例如 `asia-east1` 或 `asia-northeast1`。
4. 先选生产模式，随后用仓库里的安全规则覆盖默认规则。

## 4. 发布安全规则

仓库根目录的 `firestore.rules` 是所需规则。两种发布方式：

### 方式 A：控制台粘贴

Firestore Database → Rules，把 `firestore.rules` 全文粘贴进去并发布。

### 方式 B：Firebase CLI

```bash
npx firebase login
npx firebase use --add
npx firebase deploy --only firestore:rules
```

规则的效果：

- 只有白名单邮箱可以读写完整档案和创建/管理分享。
- 你自己的完整档案只允许当前账号读写。
- 分享文档允许通过随机 ID 公开读取，但不允许公开枚举列表。
- 只有分享所有者能更新或删除分享。
- 分享内容限制为等级、版本、显示名称等少量字段。
- 白名单只有管理员能列出和修改；普通用户只能读取自己的白名单条目。

## 5. 初始化白名单

应用采用**白名单登录**：即使 Firebase Authentication 登录成功，只有 `allowlist` 集合中存在的邮箱才能加载应用数据。没有配置白名单时，即使是管理员也进不去。

首次必须手动创建第一个管理员：

1. 打开 Firestore Database → 数据。
2. 新建集合 `allowlist`。
3. 文档 ID 填**小写邮箱**，例如 `you@example.com`。
4. 添加字段：
   - `email`: `you@example.com`
   - `role`: `admin`
5. 用这个邮箱登录，先完成邮箱验证（如果使用邮箱密码账号），然后进入「账号 → 白名单管理」。
6. 之后可以在页面里添加其他成员或管理员邮箱。

白名单读取规则只允许用户读取自己的条目；只有管理员能列出和修改整个白名单。Firestore 规则还要求 `email_verified == true`，防止有人用尚未验证的邮箱占用白名单地址。分享页面的公开读取不受白名单限制，所以教练仍然不需要账号。

如果误删了最后一个管理员，可以回到 Firebase Console 手动补回 `role: "admin"`。

## 5.1 本地第一次登录

白名单不会自动创建 Firebase 账号；它只是允许某个邮箱使用应用。第一次登录需要先创建账号：

1. 确认 `allowlist` 文档 ID 与登录邮箱完全一致（小写），例如 `you@example.com`。
2. 打开应用登录页，点 **创建邮箱账号**。
3. 用白名单里的邮箱注册，设置至少 6 位的密码。
4. 到邮箱收件箱点击 Firebase 验证链接；也可以在 Firebase Console 的 **Authentication → Users** 里确认用户已经出现。
5. 回到应用点 **我已完成验证**。
6. 如果之前已经创建过账号但忘记了密码，点登录框下方的 **忘记密码？**，用同一邮箱重置。

如果使用 Google 登录：

- 确认 Authentication → Sign-in method 已启用 Google。
- 确认 Authentication → Settings → Authorized domains 包含 `localhost` 和 `eliaztray.github.io`。
- 浏览器允许 `localhost` 弹窗；如果 Google 窗口一直不返回，打开开发者工具 Console 查看错误。
- 在中国大陆等 Google 不可达的网络环境，Google 登录可能一直无响应，这时请使用邮箱密码注册/登录。

白名单校验失败时，应用会停在「这个账号不在白名单」；邮箱账号未验证时，会停在「请先验证邮箱」。这两者都不是“页面卡死”。

## 6. 配置前端环境变量

本地开发：

```bash
cp .env.example .env.local
```

填入 Firebase Web 配置：

```bash
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=你的项目ID.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_APP_ID=...
```

> `VITE_FIREBASE_AUTH_DOMAIN` 必须使用 Firebase 控制台给出的 Auth domain，通常是 `你的项目ID.firebaseapp.com` 或 `你的项目ID.web.app`。**不要填 `localhost` 或 `eliaztray.github.io`**；这两个域名只应出现在 Authentication → Settings → Authorized domains 中。填错时 Google 登录会跳到 `https://eliaztray.github.io/__/auth/handler` 并返回 404。

`storageBucket` 和 `messagingSenderId` 可选；当前功能不需要它们。

GitHub Pages 部署：

1. 打开仓库 `Settings → Secrets and variables → Actions → Variables`。
2. 添加下列 Repository variables，值来自 `firebaseConfig`：

```text
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_APP_ID
```

这些是公开的前端配置，不是私钥。不要把 service account 私钥放进前端或提交到仓库。

## 7. 验收流程

1. 用管理员邮箱登录，确认能进入应用；进入「账号」应看到「白名单管理」。
2. 在「白名单管理」里添加一个测试成员邮箱。
3. 用测试成员登录，先完成邮箱验证，确认能进入应用并看到自己的数据。
4. 再注册一个未加入白名单的邮箱，验证后登录，应看到「这个账号不在白名单」。
5. 在未登录窗口打开分享链接，确认只读页面可见，不需要登录。
6. 用同一账号在另一个浏览器登录，确认能看到同一份进度。
7. 在两台设备上同时修改，确认出现冲突选择，而不是静默覆盖。
8. 回到账号页更新分享，刷新教练链接，确认等级变化。
9. 点击「撤销」，确认旧链接不再可用。

## 8. 数据模型

```text
allowlist/{email}
  email: string
  role: "admin" | "member"
  createdAt: server timestamp
  createdBy: uid | null

users/{uid}/state/current
  data: AppData
  revision: number
  clientId: string
  clientUpdatedAt: ISO string
  updatedAt: Firestore server timestamp

shares/{shareId}
  ownerUid: string
  schemaVersion: 1
  contentVersion: string
  displayName?: string
  levels: { [skillId]: 0–4 }
  clientUpdatedAt: ISO string
  updatedAt: Firestore server timestamp
```

完整档案保存在一个 Firestore 文档里，当前实现会检查约 900 KB 的大小上限；Firestore 单文档硬上限是 1 MiB。如果以后训练记录很多，需要再拆分集合。

## 9. 同步与冲突

- 应用启动时必须先通过登录和白名单校验；未授权账号不会加载应用数据。
- 已通过验证的账号在离线时可以使用本地缓存继续查看和编辑；云端写入会在联网后重试。
- 本地 IndexedDB 仍是离线时的读写来源。
- 登录后初始化时会比较本地和云端：
  - 云端没有数据：上传本地数据。
  - 本地没有有效数据：采用云端数据。
  - 两边都有且不同：弹出冲突窗口，由你选择保留哪一份。
- 登录期间，本地改动会延迟约 1 秒写入 Firestore。
- 云端在另一台设备更新时，会通过监听自动更新本地；如果本地正好有未同步改动，会弹冲突，不做静默合并。
- 退出登录不会删除本地数据。
- 目前一个浏览器建议只登录一个账号；切换账号前先导出或确认本地数据归属。

## 10. 常见错误

| 错误 | 原因 | 处理 |
|---|---|---|
| `auth/operation-not-allowed` | 登录方式未启用 | 在 Authentication 启用 Email/Password 或 Google |
| `auth/unauthorized-domain` | 当前域名未授权 | 把 `eliaztray.github.io` 加入 Authorized domains |
| Google 登录跳到 `https://eliaztray.github.io/__/auth/handler` 并 404 | `authDomain` 填成了 GitHub Pages 域名 | 改成 Firebase 的 `项目ID.firebaseapp.com`，重新构建 |
| `permission-denied` | 安全规则未发布或路径不匹配 | 重新发布 `firestore.rules` |
| 登录后显示「这个账号不在白名单」 | `allowlist` 没有该邮箱 | 管理员在「白名单管理」或 Firebase Console 添加 |
| 登录后卡在「请先验证邮箱」 | 邮箱账号还没点验证链接 | 点「重新发送验证邮件」，完成后点「我已完成验证」 |
| `auth/network-request-failed` | 网络无法访问 Firebase | 检查网络；中国大陆访问 Firebase 可能不稳定 |
| 弹窗被拦截 | 浏览器阻止 Google 登录弹窗 | 允许弹窗，或改用邮箱登录 |

如果你主要在中国大陆使用，建议先用目标网络实测 Firebase Authentication 和 Firestore。若不可达，需要改用其他可达的后端；白名单登录和分享都会依赖该后端。

## 11. 免费额度提醒

Spark 套餐用超免费额度时会暂停对应服务到下一个周期，不会自动扣费；前提是不要升级 Blaze。Firestore 的读写、存储和出站流量都有额度限制。个人使用足够，但如果公开传播分享链接，建议加 App Check 或其他防滥用措施。
