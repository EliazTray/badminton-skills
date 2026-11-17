import { CONTENT_VERSION } from '../data';
import type { AppData, ExportBundle } from '../data/schema';
import { ExportBundleSchema } from '../data/schema';
import { todayISO } from './dates';

export function createExportBundle(data: AppData, now = new Date()): ExportBundle {
  return {
    schemaVersion: 1,
    contentVersion: CONTENT_VERSION,
    exportedAt: now.toISOString(),
    profile: data.profile,
    settings: data.settings,
    progress: data.progress,
    sessions: data.sessions,
  };
}

export function bundleToAppData(bundle: ExportBundle): AppData {
  return {
    schemaVersion: 1,
    profile: bundle.profile,
    settings: bundle.settings,
    progress: bundle.progress,
    sessions: bundle.sessions,
  };
}

export function parseImportBundle(rawText: string): ExportBundle {
  let parsed: unknown;
  try {
    parsed = JSON.parse(rawText);
  } catch {
    throw new Error('文件不是有效的 JSON。');
  }
  return ExportBundleSchema.parse(parsed);
}

export function downloadExportBundle(bundle: ExportBundle): void {
  const blob = new Blob([JSON.stringify(bundle, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `badminton-skills-backup-${todayISO()}.json`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
