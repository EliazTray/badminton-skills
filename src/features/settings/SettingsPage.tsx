import { Link } from 'react-router-dom';
import { Download, HardDrive, Info, LockKeyhole, Upload } from 'lucide-react';
import { BASE_SKILLS, CONTENT_VERSION, VARIANT_SKILLS } from '../../data';
import { DOMAINS } from '../../data/domains';
import { useAppStore } from '../../store/appStore';
import { getStorageMode } from '../../store/storage';
import { buttonClassName } from '../../components/ui/buttonStyles';

export function SettingsPage() {
  const data = useAppStore((state) => state.data);
  const storageMode = getStorageMode();
  const levels = Object.values(data.progress).filter((item) => item.level > 0).length;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header>
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-court">Settings</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">设置与数据</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
          这个版本先把数据边界说清楚：数据默认只保存在你的浏览器里，不需要登录，也不会上传到服务器。
        </p>
      </header>

      <section className="app-card p-5 md:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-court-soft text-court">
              <HardDrive className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-sm font-bold">本地存储</h2>
              <p className="mt-1 text-xs leading-5 text-muted">
                {storageMode === 'indexeddb'
                  ? '当前使用 IndexedDB；数据只在这台设备和当前浏览器中可见。'
                  : '当前无法使用 IndexedDB，正在临时内存模式运行；本次记录不会自动保存。'}
              </p>
            </div>
          </div>
          <span className="rounded-full border border-line px-2.5 py-1 text-[10px] font-semibold text-muted">
            {storageMode === 'indexeddb' ? 'IndexedDB' : '临时内存'}
          </span>
        </div>

        <dl className="mt-5 grid gap-3 border-t border-line pt-5 text-xs sm:grid-cols-2">
          <div>
            <dt className="text-muted">内容版本</dt>
            <dd className="mt-1 font-semibold">{CONTENT_VERSION}</dd>
          </div>
          <div>
            <dt className="text-muted">技能节点</dt>
            <dd className="mt-1 font-semibold">
              {BASE_SKILLS.length} 主技术 + {VARIANT_SKILLS.length} 细分 · {DOMAINS.length} 个领域
            </dd>
          </div>
          <div>
            <dt className="text-muted">已标记技能</dt>
            <dd className="mt-1 font-semibold">{levels} 个</dd>
          </div>
          <div>
            <dt className="text-muted">训练记录</dt>
            <dd className="mt-1 font-semibold">{data.sessions.length} 条</dd>
          </div>
        </dl>
      </section>

      <section className="app-card p-5 md:p-6">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-amber-soft text-amber">
            <LockKeyhole className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-sm font-bold">备份与导入将在 Phase 4 接入</h2>
            <p className="mt-1 text-xs leading-5 text-muted">
              目前还没有正式的导出 / 导入界面。在加入备份前，不建议把这里当作唯一记录；Phase 2 完成后会先补上完整的内容评估，再在 Phase 4 做 JSON 导出、导入和恢复快照。
            </p>
          </div>
        </div>
        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          <button type="button" disabled className={buttonClassName('secondary', 'w-full')}>
            <Download className="h-4 w-4" />
            导出 JSON（即将开放）
          </button>
          <button type="button" disabled className={buttonClassName('secondary', 'w-full')}>
            <Upload className="h-4 w-4" />
            导入 JSON（即将开放）
          </button>
        </div>
      </section>

      <section className="app-card p-5 md:p-6">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-court" />
          <div>
            <h2 className="text-sm font-bold">关于内容</h2>
            <p className="mt-1 text-xs leading-5 text-muted">
              技能分类参考常见的羽毛球教学体系；当前 {BASE_SKILLS.length} 个主技术 +{' '}
              {VARIANT_SKILLS.length} 个首版细分中，8 个锚点技能标注为「完整」，其余为草案。动作描述和等级标准会在你评审后继续修正。
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <a
                href="https://development.bwfbadminton.com/wp-content/uploads/2018/09/LBU-Player-Development-in-Four-Countries-in-Badminton-FINAL.pdf"
                target="_blank"
                rel="noreferrer"
                className="text-xs font-semibold text-court hover:underline"
              >
                BWF 球员发展资料
              </a>
              <a
                href="https://eric.ed.gov/?q=badminton&id=EJ900551"
                target="_blank"
                rel="noreferrer"
                className="text-xs font-semibold text-court hover:underline"
              >
                Wang &amp; Moffit 技能水平教学
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="flex flex-wrap gap-3">
        <Link to="/map" className={buttonClassName('primary')}>
          回到技能图谱
        </Link>
        <Link to="/" className={buttonClassName('secondary')}>
          回到概览
        </Link>
      </div>
    </div>
  );
}
