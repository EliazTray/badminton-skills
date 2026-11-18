# 羽球技能图谱

一个本地优先的羽毛球技能追踪 PWA。用领域化 DAG、0–4 级可观察标准和训练记录，回答三个问题：我会什么、我缺什么、下一步练什么。

当前包含技能图谱、0–4 级 rubric 评估、JSON 备份，以及 Firebase 账号 / 全量云同步 / 白名单登录 / 教练只读分享。应用启动前必须通过 Firebase 登录和白名单校验；首次登录还需要完成约 2 分钟的起点评估。未配置 Firebase 时会停在配置页，不加载技能数据。共有 51 个主技术节点和 49 个细分，8 个锚点的内容为完整，其余仍标注为草案。

## 快速开始

环境：Node 24 LTS（项目内提供了 `.node-version`）。本机已安装 fnm 时：

```bash
fnm use
npm install
npm run dev       # 仅本机访问
npm run dev:lan   # 同一局域网可访问（Vite 会打印 Network 地址）
```

`dev:lan` 会把开发服务器绑定到 `0.0.0.0`，同一 Wi-Fi / 局域网内的设备可以打开终端打印的 `Network` 地址。它仍然受 Firebase 白名单登录控制，但开发服务器本身没有额外的网络隔离，只适合可信局域网；如果 macOS 防火墙弹出提示，需要允许 Node 接收传入连接。正式共享应使用部署后的静态站点。

完成 Firebase 和第一个管理员白名单配置后，打开终端里显示的本地地址。未登录时只会看到登录页；通过白名单后进入概览，可从侧栏或底部导航进入「技能图谱」。

### 启用账号与云同步

账号功能需要你自己的 Firebase 项目。完整步骤见 [`docs/firebase-setup.md`](docs/firebase-setup.md)。最小流程：

1. 创建 Firebase 项目（Spark 免费套餐即可）。在 **Security → Authentication** 中先点 Get started，再在 **Sign-in method** 启用 Email/Password 和可选的 Google 登录。
2. 创建 Firestore Native 数据库，发布根目录的 `firestore.rules`。
3. 复制 `.env.example` 为 `.env.local`，填入 Firebase Web 配置。
4. 在 Firestore Console 手动创建第一个 `allowlist` 管理员条目（见配置文档）。
5. 重新运行 `npm run dev`，从「账号」页面登录。

没有 Firebase 配置时，应用会停在配置页，不加载任何技能数据。

### 常用脚本

```bash
npm run dev              # 本地开发
npm run typecheck        # TypeScript 检查
npm run test             # 内容 / 图谱 / 进度 / 训练 / 推荐 / 白名单 / 分享与同步测试
npm run lint             # ESLint
npm run build            # 生产构建
npm run preview          # 预览构建产物
npm run validate:content # 只跑技能目录完整性校验
npm run catalog:generate # 重新生成 docs/skill-catalog.md
npm run icons:generate   # 重新生成 PWA PNG 图标
```

## 已实现

- 8 个领域、51 个主技术节点 + 49 个细分，含前置关系、分层、标签和锚点。
- 领域总览 → 领域图谱 / 列表 → 技能详情的渐进披露。
- 图谱节点右下角显示 `+N 细分`，默认折叠；点 `+` 只展开当前技术的细分，再点收起，点节点主体进入详情。
- React Flow 领域 DAG：实线 / 虚线表示前置是否满足，跨领域前置以 ghost 节点显示。
- 技能详情：要点、常见错误、练习方法、1–4 级标准和等级历史。
- 所有主技术和细分都可以通过逐条勾选目标等级标准来评估升级，记录备注和历史，刷新后保留。
- Zustand + IndexedDB 持久化，带异步 hydration 门禁和内存模式提示。
- 手机和桌面响应式；手机默认列表，图谱可切换并支持拖动 / 缩放。
- JSON 导出 / 导入：设置页可下载完整备份，导入会校验格式并覆盖当前档案。
- 可选 Firebase 账号：邮箱密码注册/登录（注册后必须验证邮箱）、Google 登录、找回密码。
- 白名单登录：只有 `allowlist` 中的邮箱可以加载应用；管理员可在账号页维护成员/管理员，未授权账号会被拦截，Firestore 规则同样拒绝其数据读写。
- 白名单防抢占：邮箱账号必须 `email_verified`，避免有人注册白名单邮箱但不拥有该邮箱。
- 全量 AppData 云同步：`users/{uid}/state/current`；离线仍可记录，联网后自动写入；本地和云端不一致时弹出冲突选择，不静默覆盖。
- 教练只读分享：生成随机分享 ID，链接为 `#/share/{id}`；分享页只包含技能等级，不含备注、评估历史或训练记录；教练无需登录。
- 分享归属与撤销：分享文档记录 `ownerUid`，只有本人能更新或删除；Firestore 规则禁止公开枚举分享列表。
- 训练记录：记录日期、类型、时长、强度、训练内容、最多 5 个关联技能、每个技能的成功率、备注和视频链接；支持编辑、删除、按类型筛选和按日期分组。
- 概览派生数据：本周训练次数/分钟、最近训练、超过复习阈值的 L2+ 待复习技能、最近 12 周训练趋势。
- 概览建议：按主练 / 补短 / 复习槽位给出最多 3 个技能建议，并显示可读原因；训练记录会影响复习槽位和最近练习判断。
- 起点评估：首次通过白名单登录后，用 3 步流程选择目标、重点领域、周目标，并给 8 个领域锚点标出 0–4 起点估值。
- 推荐 snooze：每条建议可以「3 天内不再提示」；周目标完成后会调整主练建议文案。
- PWA：manifest、安装图标、离线应用壳和自动更新；已通过 `preview` 验证 service worker 注册与断网打开登录页。
- 内容完整性测试：节点数量、ID、锚点唯一、前置引用、无环、锚点标准数量。

## 当前边界

- 51 个主技术中只有 8 个锚点的内容是完整的；细分为草案内容，但已经可以按现有标准逐条评估。
- 训练记录已接入；推荐是确定性规则，还没有根据多周趋势自动调整权重。
- PWA 已接入；iOS 安装提示、推送提醒和后台同步尚未接入。
- 云同步把完整档案放在一个 Firestore 文档里，接近 1 MiB 时需要拆分；当前只做冲突选择，不做自动合并。
- 不做排行榜、XP、视频分析或教练协作编辑。
- 尚未在真实 Firebase 项目中执行完整端到端验收；首次配置后请按 `docs/firebase-setup.md` 的验收流程检查登录、双设备同步和分享撤销。

## 部署到 GitHub Pages

仓库包含 `.github/workflows/pages.yml`。推送到 `main` 后，工作流会执行类型检查、单元测试、lint 和构建，并发布 `dist`。

**首次部署前需要手动启用一次 GitHub Pages：**

1. 打开 https://github.com/EliazTray/badminton-skills/settings/pages
2. `Build and deployment` → `Source` 选择 **GitHub Actions**
3. 回到 https://github.com/EliazTray/badminton-skills/actions ，重新运行 `Deploy GitHub Pages`（或等下一次推送）

页面地址：**https://eliaztray.github.io/badminton-skills/**

> 注意：这个版本要求 Firebase 白名单登录。不要在没有配置 Firebase 和第一个管理员白名单的情况下部署到 `main`，否则站点只会显示配置页，无法进入应用。

项目使用 HashRouter，所以子页面地址形如 `https://eliaztray.github.io/badminton-skills/#/map`。生产构建通过 `VITE_BASE_PATH=/badminton-skills/` 写入正确的资源路径；`public/.nojekyll` 避免 GitHub Pages 的 Jekyll 处理。

### 云同步的生产配置

在仓库 `Settings → Secrets and variables → Actions → Variables` 添加 `VITE_FIREBASE_API_KEY`、`VITE_FIREBASE_AUTH_DOMAIN`、`VITE_FIREBASE_PROJECT_ID`、`VITE_FIREBASE_APP_ID`，然后重新运行部署。它们是公开的前端配置，不是私钥。`VITE_FIREBASE_AUTH_DOMAIN` 必须是 Firebase 控制台里的 `项目ID.firebaseapp.com` 或 `项目ID.web.app`，不能填 `localhost` 或 `eliaztray.github.io`；后者只放在 Authentication 的 Authorized domains 里。Firebase Authentication 的 Authorized domains 需要包含 `eliaztray.github.io`。

`firestore.rules` 不会随 GitHub Pages 自动部署；修改后要在 Firebase Console 发布，或执行 `npx firebase deploy --only firestore:rules`。第一步还要在 Firestore Console 手动创建管理员 `allowlist` 条目。

## 数据与隐私

- 未登录或未通过白名单时，不会渲染应用主体，也不会读取或写入 Firestore 数据。
- 本地数据仍保存在浏览器 IndexedDB 的 `keyval-store` 中，键名为 `badminton-skills`；只有通过白名单后才加载到应用界面。
- 通过验证后，完整档案会同步到 Firebase Firestore 的 `users/{uid}/state/current`，只有该账号可读写。
- 已通过验证的账号在离线时可以使用本地缓存继续查看和编辑；云端写入需要联网。
- 教练分享链接是公开只读的随机 ID 页面；分享内容只包含技能等级、内容版本和可选显示名称，不包含备注、评估历史、训练记录或视频。
- 白名单条目保存在 `allowlist/{email}`；只有管理员能列出和修改，普通用户只能读取自己的条目。
- 分享文档的公开读取规则不开放列表枚举；撤销分享会删除对应文档。
- Firebase Web 配置会出现在前端构建产物中，这是正常设计；不要把 service account 私钥放进前端。
- 未配置 Firebase 时没有账号、云同步或第三方 API 请求；配置后会访问 Firebase Authentication 和 Firestore。
- 设置页可以导出 JSON 备份；云同步不能替代本地备份。

## 代码结构

```text
src/
  app/            # 路由、AppShell、加载态
  features/       # dashboard / map / skill / sessions / settings / auth / sync / share
  components/     # 通用 UI
  data/           # 技能 schema、领域、51 个主技术 + 49 个细分节点、内容校验
  lib/            # 图算法、进度统计、日期、媒体查询、Firebase、分享与同步
  store/          # Zustand + IndexedDB 持久化
  test/           # 测试 setup
scripts/          # 技能目录生成
docs/             # 技能目录、技术族谱草案、Firebase 配置说明
firestore.rules   # Firestore 安全规则
```

- 技能内容在 `src/data/skills/` 按领域拆分；`src/data/index.ts` 负责组装并校验。
- 图谱布局在 `src/lib/graph.ts` 使用 dagre 计算；节点渲染在 `src/features/map/`。
- 等级和前置状态是纯函数，位于 `src/lib/progress.ts`。
- Firebase 初始化在 `src/lib/firebase.ts`；云同步状态机在 `src/features/sync/CloudSyncProvider.tsx`；安全规则在 `firestore.rules`。

## 下一步

1. **配置并验收 Firebase**：按 `docs/firebase-setup.md` 创建项目、发布规则、初始化第一个管理员白名单、配置 Actions variables，并用两个浏览器验证同步与分享。
2. **白名单验收**：确认未授权邮箱会停在「这个账号不在白名单」，管理员可以在账号页添加/移除成员，Firestore 规则确实拒绝未授权读写。
2. **内容评审**：打开 `docs/technique-taxonomy.md`，重点看 49 个细分的名称、所属主技术和术语标注。
3. Phase 2 后续：补全 rubric 标准；把当前 parent-child 结构升级成显式技术族 UI。
4. Phase 3：训练记录、起点评估、主练/补短/复习建议、snooze 和 12 周趋势已接入；继续补多周权重校准和更细的周目标提示。
5. Phase 4：PWA 已接入；继续补 iOS 安装引导、导入恢复快照、无障碍和部署优化。

内容分类参考常见的羽毛球教学体系，以及 BWF 球员发展与 Wang & Moffit 的技能水平教学思路；具体标准仍需结合你的实际训练经验评审。
