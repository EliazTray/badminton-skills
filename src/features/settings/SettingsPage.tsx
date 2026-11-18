import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Cloud, Download, HardDrive, Info, LockKeyhole, Smartphone, Upload, UserRound } from 'lucide-react';
import { BASE_SKILLS, CONTENT_VERSION, VARIANT_SKILLS } from '../../data';
import { DOMAINS } from '../../data/domains';
import { useAppStore } from '../../store/appStore';
import { getStorageMode } from '../../store/storage';
import { useAuth } from '../auth/AuthProvider';
import { SYNC_PHASE_LABELS, formatSyncTime, useCloudSync } from '../sync/CloudSyncProvider';
import {
  bundleToAppData,
  createExportBundle,
  downloadExportBundle,
  parseImportBundle,
} from '../../lib/backup';
import { buttonClassName } from '../../components/ui/buttonStyles';

interface DataMessage {
  kind: 'ok' | 'error';
  text: string;
}

export function SettingsPage() {
  const data = useAppStore((state) => state.data);
  const importData = useAppStore((state) => state.importData);
  const markBackup = useAppStore((state) => state.markBackup);
  const storageMode = getStorageMode();
  const { configured: authConfigured, user } = useAuth();
  const { phase, lastSyncedAt } = useCloudSync();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dataMessage, setDataMessage] = useState<DataMessage | null>(null);
  const levels = Object.values(data.progress).filter((item) => item.level > 0).length;

  const handleExport = () => {
    const bundle = createExportBundle(data);
    downloadExportBundle(bundle);
    markBackup();
    setDataMessage({ kind: 'ok', text: '已导出 JSON 备份文件。' });
  };

  const handleImportFile = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      setDataMessage({ kind: 'error', text: '文件超过 5 MB，未导入。' });
      return;
    }

    try {
      const bundle = parseImportBundle(await file.text());
      const confirmed = window.confirm(
        `导入会覆盖当前数据。\n\n文件包含 ${Object.keys(bundle.progress).length} 条技能进度、${bundle.sessions.length} 条训练记录。\n内容版本：${bundle.contentVersion}\n\n继续导入？`,
      );
      if (!confirmed) return;

      importData(bundleToAppData(bundle));
      setDataMessage({
        kind: 'ok',
        text:
          bundle.contentVersion === CONTENT_VERSION
            ? '导入完成。'
            : `导入完成，但文件内容版本是 ${bundle.contentVersion}，当前版本是 ${CONTENT_VERSION}，请检查技能对应关系。`,
      });
    } catch (error) {
      setDataMessage({
        kind: 'error',
        text: error instanceof Error ? `导入失败：${error.message}` : '导入失败：文件格式不正确。',
      });
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header>
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-court">Settings</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">设置与数据</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
          数据默认只保存在浏览器；登录后可以同步到云端并跨设备使用，教练查看只读分享不需要账号。
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
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-court-soft text-court">
            <Smartphone className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-sm font-bold">安装与离线</h2>
            <p className="mt-1 text-xs leading-5 text-muted">
              应用已支持安装到主屏幕和离线打开应用壳。iOS 用 Safari 的「分享 → 添加到主屏幕」；Android
              用浏览器菜单里的「安装应用」。
            </p>
            <p className="mt-1 text-[11px] leading-5 text-faint">
              首次打开后，资源会由 Service Worker 缓存；之后断网仍能打开登录页和本地数据。
            </p>
          </div>
        </div>
      </section>

      <section className="app-card p-5 md:p-6">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-court-soft text-court">
            <UserRound className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-sm font-bold">账号与云同步</h2>
            <p className="mt-1 text-xs leading-5 text-muted">
              {!authConfigured
                ? 'Firebase 尚未配置；应用不会加载数据。'
                : user
                  ? `${user.email} · ${SYNC_PHASE_LABELS[phase]}${lastSyncedAt ? ` · 最近 ${formatSyncTime(lastSyncedAt)}` : ''}`
                  : '未登录。登录并通过白名单后才能加载数据。'}
            </p>
          </div>
        </div>
        <Link to="/account" className={buttonClassName('secondary', 'mt-4')}>
          <Cloud className="h-4 w-4" />
          {user ? '管理账号与分享' : '登录或配置云同步'}
        </Link>
        <Link to="/welcome" className={buttonClassName('secondary', 'ml-2 mt-4')}>
          重新评估起点
        </Link>
      </section>

      <section className="app-card p-5 md:p-6">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-amber-soft text-amber">
            <LockKeyhole className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-sm font-bold">数据备份</h2>
            <p className="mt-1 text-xs leading-5 text-muted">
              导出的 JSON 会包含技能等级、评估历史、备注和训练记录。云同步不能替代备份；清理站点数据或更换账号前请先导出。
            </p>
            <p className="mt-2 text-[11px] font-medium text-faint">
              最近备份：{data.settings.lastBackupAt ?? '还没有导出过'}
            </p>
          </div>
        </div>
        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          <button type="button" onClick={handleExport} className={buttonClassName('primary', 'w-full')}>
            <Download className="h-4 w-4" />
            导出 JSON
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={buttonClassName('secondary', 'w-full')}
          >
            <Upload className="h-4 w-4" />
            导入 JSON
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            className="sr-only"
            aria-label="选择备份 JSON 文件"
            onChange={(event) => {
              const file = event.target.files?.[0];
              event.target.value = '';
              if (file) void handleImportFile(file);
            }}
          />
        </div>
        {dataMessage ? (
          <p
            className={
              dataMessage.kind === 'ok'
                ? 'mt-3 rounded-xl bg-court-soft/60 px-3 py-2 text-xs leading-5 text-court'
                : 'mt-3 rounded-xl bg-amber-soft/60 px-3 py-2 text-xs leading-5 text-amber'
            }
            role="status"
          >
            {dataMessage.text}
          </p>
        ) : null}
        <p className="mt-3 text-[11px] leading-5 text-faint">
          导入会覆盖当前档案；导入前建议先导出一次当前数据。视频只保存外部链接，不会包含视频文件。
        </p>
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
