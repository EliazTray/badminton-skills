import { ALL_SKILLS, CONTENT_VERSION } from '../data';
import type { AppData, Level, ShareSnapshot, SkillProgress } from '../data/schema';
import { ShareSnapshotSchema } from '../data/schema';

export function buildShareSnapshot(
  data: AppData,
  displayName?: string,
  now = new Date(),
): ShareSnapshot {
  const levels: Record<string, Level> = {};
  for (const [skillId, progress] of Object.entries(data.progress)) {
    if (progress.level > 0) {
      levels[skillId] = progress.level;
    }
  }

  return {
    schemaVersion: 1,
    contentVersion: CONTENT_VERSION,
    displayName: displayName?.trim().slice(0, 40) || undefined,
    levels,
    updatedAt: now.toISOString(),
  };
}

export function parseShareSnapshot(raw: unknown): ShareSnapshot {
  return ShareSnapshotSchema.parse(raw);
}

export function progressFromShare(snapshot: ShareSnapshot): Record<string, SkillProgress> {
  const progress: Record<string, SkillProgress> = {};
  for (const [skillId, level] of Object.entries(snapshot.levels)) {
    progress[skillId] = { level, assessments: [] };
  }
  return progress;
}

export function getUnknownSharedSkillIds(snapshot: ShareSnapshot): string[] {
  const known = new Set(ALL_SKILLS.map((skill) => skill.id));
  return Object.keys(snapshot.levels).filter((skillId) => !known.has(skillId));
}

export function buildShareUrl(shareId: string): string {
  const base = new URL(import.meta.env.BASE_URL, window.location.origin).href;
  return `${base}#/share/${shareId}`;
}
