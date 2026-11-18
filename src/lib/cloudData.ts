import type { AppData } from '../data/schema';

export interface CloudState {
  data: AppData;
  revision: number;
  clientUpdatedAt: string;
  clientId: string;
  updatedAt?: string;
}

export class CloudConflictError extends Error {
  constructor() {
    super('云端数据已在另一台设备更新。');
    this.name = 'CloudConflictError';
  }
}

export class CloudNotFoundError extends Error {
  constructor() {
    super('云端还没有这份数据。');
    this.name = 'CloudNotFoundError';
  }
}

export function stableStringify(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map((item) => stableStringify(item)).join(',')}]`;
  }
  if (value && typeof value === 'object') {
    return `{${Object.keys(value as Record<string, unknown>)
      .sort()
      .map(
        (key) =>
          `${JSON.stringify(key)}:${stableStringify((value as Record<string, unknown>)[key])}`,
      )
      .join(',')}}`;
  }
  return JSON.stringify(value);
}

export function hasMeaningfulData(data: AppData): boolean {
  return (
    Boolean(data.profile.onboardedAt) ||
    data.sessions.length > 0 ||
    Object.values(data.progress).some(
      (progress) => progress.level > 0 || progress.assessments.length > 0,
    )
  );
}

export type InitialSyncDecision = 'create' | 'equal' | 'adopt-cloud' | 'conflict';

export function decideInitialSync(
  local: AppData,
  cloud: CloudState | null,
): InitialSyncDecision {
  if (!cloud) return 'create';
  if (stableStringify(local) === stableStringify(cloud.data)) return 'equal';
  if (!hasMeaningfulData(local)) return 'adopt-cloud';
  return 'conflict';
}

export function appDataByteSize(data: AppData): number {
  return new TextEncoder().encode(JSON.stringify(data)).byteLength;
}

export const MAX_CLOUD_DATA_BYTES = 900_000;
