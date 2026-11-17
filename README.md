# 羽球技能图谱

一个本地优先的羽毛球技能追踪 PWA。用领域化 DAG、0–4 级可观察标准和训练记录，回答三个问题：我会什么、我缺什么、下一步练什么。

当前是 **Phase 1**：技能图谱纵切。已经可以浏览 57 个技能节点、查看跨领域前置关系，并为 8 个锚点技能标记起点等级。完整内容评审、训练日志、推荐和 PWA 安装会在后续阶段接入。

## 快速开始

环境：Node 24 LTS（项目内提供了 `.node-version`）。本机已安装 fnm 时：

```bash
fnm use
npm install
npm run dev       # 仅本机访问
npm run dev:lan   # 同一局域网可访问（Vite 会打印 Network 地址）
```

`dev:lan` 会把开发服务器绑定到 `0.0.0.0`，同一 Wi-Fi / 局域网内的设备可以打开终端打印的 `Network` 地址。它没有登录和权限控制，只适合可信局域网；如果 macOS 防火墙弹出提示，需要允许 Node 接收传入连接。每位同事的等级与训练数据都保存在各自浏览器的 IndexedDB 中，不会共享。需要正式共享时，应部署静态构建而不是长期暴露开发服务器。

打开终端里显示的本地地址。默认进入概览，可从侧栏或底部导航进入「技能图谱」。

### 常用脚本

```bash
npm run dev              # 本地开发
npm run typecheck        # TypeScript 检查
npm run test             # 内容 / 图谱 / 进度单元测试
npm run lint             # ESLint
npm run build            # 生产构建
npm run preview          # 预览构建产物
npm run validate:content # 只跑技能目录完整性校验
npm run catalog:generate # 重新生成 docs/skill-catalog.md
```

## Phase 1 已实现

- 8 个领域、57 个技能节点，含前置关系、分层、标签和锚点。
- 领域总览 → 领域图谱 / 列表 → 技能详情的渐进披露。
- React Flow 领域 DAG：实线 / 虚线表示前置是否满足，跨领域前置以 ghost 节点显示。
- 技能详情：要点、常见错误、练习方法、1–4 级标准和等级历史。
- 8 个锚点技能可快速标记 0–4 级，记录为「起点估值」，刷新后保留。
- Zustand + IndexedDB 持久化，带异步 hydration 门禁和内存模式提示。
- 手机和桌面响应式；手机默认列表，图谱可切换并支持拖动 / 缩放。
- 内容完整性测试：节点数量、ID、锚点唯一、前置引用、无环、锚点标准数量。

## Phase 1 的边界

- 57 个节点中只有 8 个锚点的内容是完整的；其余节点标记为「草案」，等级评估暂不可用。
- 训练记录、成功率、待复习、视频链接和「本周三件事」推荐尚未接入。
- JSON 导出 / 导入、PWA 安装、离线缓存和 GitHub Pages 部署尚未接入。
- 目前不做账号、云同步、排行榜、XP、视频分析。

## 部署到 GitHub Pages

仓库包含 `.github/workflows/pages.yml`。推送到 `main` 后，工作流会执行类型检查、单元测试、lint 和构建，并发布 `dist`。

**首次部署前需要手动启用一次 GitHub Pages：**

1. 打开 https://github.com/EliazTray/badminton-skills/settings/pages
2. `Build and deployment` → `Source` 选择 **GitHub Actions**
3. 回到 https://github.com/EliazTray/badminton-skills/actions ，重新运行 `Deploy GitHub Pages`（或等下一次推送）

页面地址：**https://eliaztray.github.io/badminton-skills/**

项目使用 HashRouter，所以子页面地址形如 `https://eliaztray.github.io/badminton-skills/#/map`。生产构建通过 `VITE_BASE_PATH=/badminton-skills/` 写入正确的资源路径；`public/.nojekyll` 避免 GitHub Pages 的 Jekyll 处理。

## 数据与隐私

- 数据保存在浏览器 IndexedDB 的 `keyval-store` 中，键名为 `badminton-skills`。
- 没有后端、账号、分析脚本、远程字体或第三方 API。
- 应用资源 / PWA 更新和用户主动打开的外部链接是唯一可能的网络请求。
- 在导出功能接入前，不要把这当作唯一副本；清理浏览器数据会丢失进度。

## 代码结构

```text
src/
  app/            # 路由、AppShell、加载态
  features/       # dashboard / map / skill / sessions / settings
  components/     # 通用 UI
  data/           # 技能 schema、领域、57 个节点、内容校验
  lib/            # 图算法、进度统计、日期、媒体查询
  store/          # Zustand + IndexedDB 持久化
  test/           # 测试 setup
scripts/          # 技能目录生成
docs/             # 技能目录、技术族谱草案
```

- 技能内容在 `src/data/skills/` 按领域拆分；`src/data/index.ts` 负责组装并校验。
- 图谱布局在 `src/lib/graph.ts` 使用 dagre 计算；节点渲染在 `src/features/map/`。
- 等级和前置状态是纯函数，位于 `src/lib/progress.ts`。

## 下一步

1. **内容评审**：打开 `docs/skill-catalog.md`，重点看节点名称、前置关系和 8 个锚点的 3 / 4 级标准。
2. **技术族谱评审**：打开 `docs/technique-taxonomy.md`，确认「领域 → 技术族 → 基础 / 细分技术」的层级，以及劈吊、滑板吊、重杀、点杀等节点应该归入哪个族。
3. 确认后进入 Phase 2：补全现有节点的标准，接入完整等级评估和起点评估，并把首版约 44 个细分技术落成可折叠子节点。
4. Phase 3：训练记录、待复习和「本周三件事」推荐。
5. Phase 4：PWA、导出 / 导入、无障碍和可选部署。

内容分类参考常见的羽毛球教学体系，以及 BWF 球员发展与 Wang & Moffit 的技能水平教学思路；具体标准仍需结合你的实际训练经验评审。
