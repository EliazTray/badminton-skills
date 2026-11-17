import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { CONTENT_VERSION } from '../data';
import type { AppData, Assessment, Level } from '../data/schema';
import { AppDataSchema, DEFAULT_APP_DATA } from '../data/schema';
import { todayISO } from '../lib/dates';
import { appStorage, getStorageMode, requestPersistentStorage } from './storage';

interface PersistedState {
  data: AppData;
}

export interface AssessSkillInput {
  level: Level;
  criteria: string[];
  note?: string;
  videoUrl?: string;
}

interface AppStore {
  data: AppData;
  hydrated: boolean;
  storageWarning?: string;
  setHydrated: (hydrated: boolean) => void;
  setStorageWarning: (warning?: string) => void;
  setQuickLevel: (skillId: string, level: Level) => void;
  assessSkill: (skillId: string, input: AssessSkillInput) => void;
}

function createId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      data: DEFAULT_APP_DATA,
      hydrated: false,
      storageWarning: undefined,

      setHydrated: (hydrated) => set({ hydrated }),

      setStorageWarning: (storageWarning) => set({ storageWarning }),

      setQuickLevel: (skillId, level) => {
        set((state) => {
          const previous = state.data.progress[skillId];
          if ((previous?.level ?? 0) === level) return state;

          const assessment: Assessment = {
            id: createId(),
            date: todayISO(),
            level,
            kind: level === 0 ? 'correction' : 'baseline',
            criteriaSnapshot: [],
            contentVersion: CONTENT_VERSION,
            note: 'Phase 1 快速标记',
          };

          return {
            data: {
              ...state.data,
              progress: {
                ...state.data.progress,
                [skillId]: {
                  level,
                  assessments: [...(previous?.assessments ?? []), assessment],
                  note: previous?.note,
                },
              },
            },
          };
        });

        void requestPersistentStorage();
      },

      assessSkill: (skillId, input) => {
        set((state) => {
          const previous = state.data.progress[skillId];
          const previousLevel = previous?.level ?? 0;
          if (input.level === previousLevel || input.criteria.length === 0) {
            return state;
          }

          const assessment: Assessment = {
            id: createId(),
            date: todayISO(),
            level: input.level,
            kind: input.level < previousLevel ? 'correction' : 'rubric',
            criteriaSnapshot: input.criteria,
            contentVersion: CONTENT_VERSION,
            note: input.note,
            videoUrl: input.videoUrl,
          };

          return {
            data: {
              ...state.data,
              progress: {
                ...state.data.progress,
                [skillId]: {
                  level: input.level,
                  assessments: [...(previous?.assessments ?? []), assessment],
                  note: previous?.note,
                },
              },
            },
          };
        });

        void requestPersistentStorage();
      },
    }),
    {
      name: 'badminton-skills',
      version: 1,
      storage: createJSONStorage(() => appStorage),
      partialize: (state) => ({ data: state.data }),
      merge: (persistedState, currentState) => {
        const persisted = persistedState as Partial<PersistedState> | undefined;
        if (!persisted || persisted.data === undefined) {
          return currentState;
        }

        const parsed = AppDataSchema.safeParse(persisted.data);
        if (!parsed.success) {
          return {
            ...currentState,
            storageWarning: '本地数据格式无法读取。请先导出备份，或在设置中重置数据。',
          };
        }

        return { ...currentState, data: parsed.data };
      },
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          state?.setStorageWarning('读取本地数据失败，当前使用临时内存模式。');
        } else if (getStorageMode() === 'memory') {
          state?.setStorageWarning('浏览器未提供可用的本地存储，本次记录不会自动保存。');
        }
        state?.setHydrated(true);
      },
    },
  ),
);
