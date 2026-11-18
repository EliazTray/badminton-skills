import { z } from 'zod';

export const DOMAIN_IDS = [
  'basics',
  'footwork',
  'serve-receive',
  'rear-court',
  'front-court',
  'midcourt-defense',
  'doubles',
  'tactics',
] as const;

export type DomainId = (typeof DOMAIN_IDS)[number];

export const LEVELS = [0, 1, 2, 3, 4] as const;
export type Level = (typeof LEVELS)[number];

export const MIN_LEVELS = [1, 2, 3, 4] as const;
export type MinLevel = (typeof MIN_LEVELS)[number];

export const TIERS = ['foundation', 'core', 'advanced'] as const;
export type SkillTier = (typeof TIERS)[number];

export const SKILL_TAGS = ['singles', 'doubles', 'attack', 'defense', 'net', 'rear'] as const;
export type SkillTag = (typeof SKILL_TAGS)[number];

export const CONTENT_STATUSES = ['complete', 'draft'] as const;
export type ContentStatus = (typeof CONTENT_STATUSES)[number];

export const SKILL_ROLES = ['base', 'specialized'] as const;
export type SkillRole = (typeof SKILL_ROLES)[number];

export const TERM_STATUSES = ['common', 'coach', 'needs-review'] as const;
export type TermStatus = (typeof TERM_STATUSES)[number];

export const SESSION_TYPES = ['课程', '多球', '对抗', '比赛', '步法/体能', '自主练习'] as const;
export type SessionType = (typeof SESSION_TYPES)[number];

export const LEVEL_NAMES: Record<Level, string> = {
  0: '未开始',
  1: '认知',
  2: '定点',
  3: '稳定',
  4: '实战',
};

export const LEVEL_DESCRIPTIONS: Record<Level, string> = {
  0: '没有练过或还不能完成。',
  1: '能复述动作要点，可无球或慢速模仿。',
  2: '固定喂球或固定线路下基本完成，动作结构正确。',
  3: '移动中或连续多拍下达到成功率 / 落点门槛，质量可控。',
  4: '对抗中主动使用，压力下保持稳定，并能变化落点或节奏。',
};

export const DOMAIN_ID_VALUES = new Set<string>(DOMAIN_IDS);
export const SKILL_TAG_VALUES = new Set<string>(SKILL_TAGS);

const levelSchema = z.union([
  z.literal(0),
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
]);

const minLevelSchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
]);

const dateStringSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '日期必须是 YYYY-MM-DD');

const safeUrlSchema = z
  .string()
  .url()
  .refine((value) => {
    try {
      const parsed = new URL(value);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  }, '只允许 http / https 链接');

export const DrillSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  prescription: z.string().optional(),
});

export const PrerequisiteSchema = z.object({
  skillId: z.string().min(1),
  minLevel: minLevelSchema,
});

export const SkillSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/, '技能 ID 只能使用小写字母、数字和连字符'),
  domainId: z.enum(DOMAIN_IDS),
  name: z.string().min(1),
  tier: z.enum(TIERS),
  isAnchor: z.boolean().optional(),
  parentSkillId: z.string().min(1).optional(),
  role: z.enum(SKILL_ROLES).optional(),
  aliases: z.array(z.string().min(1)).optional(),
  termStatus: z.enum(TERM_STATUSES).optional(),
  contentStatus: z.enum(CONTENT_STATUSES),
  summary: z.string().min(1),
  keyPoints: z.array(z.string().min(1)).min(3),
  commonErrors: z.array(z.string().min(1)).min(2),
  drills: z.array(DrillSchema).min(1),
  prerequisites: z.array(PrerequisiteSchema),
  rubric: z.object({
    1: z.array(z.string().min(1)).min(1),
    2: z.array(z.string().min(1)).min(1),
    3: z.array(z.string().min(1)).min(1),
    4: z.array(z.string().min(1)).min(1),
  }),
  tags: z.array(z.enum(SKILL_TAGS)).min(1),
  relatedSkillIds: z.array(z.string().min(1)).optional(),
});

export const AssessmentSchema = z.object({
  id: z.string().min(1),
  date: dateStringSchema,
  level: levelSchema,
  kind: z.enum(['baseline', 'rubric', 'correction']),
  criteriaSnapshot: z.array(z.string()),
  contentVersion: z.string().min(1),
  note: z.string().optional(),
  videoUrl: safeUrlSchema.optional(),
  sessionId: z.string().optional(),
});

export const SkillProgressSchema = z.object({
  level: levelSchema,
  assessments: z.array(AssessmentSchema),
  note: z.string().optional(),
});

export const SessionFocusSchema = z.object({
  skillId: z.string().min(1),
  successRate: z.number().min(0).max(100).optional(),
  note: z.string().optional(),
});

export const SessionSchema = z.object({
  id: z.string().min(1),
  date: dateStringSchema,
  type: z.enum(SESSION_TYPES),
  durationMin: z.number().int().min(1).max(600),
  intensity: z.union([
    z.literal(1),
    z.literal(2),
    z.literal(3),
    z.literal(4),
    z.literal(5),
  ]),
  focus: z.array(SessionFocusSchema).max(5),
  content: z.string().min(1),
  notes: z.string().optional(),
  videoUrl: safeUrlSchema.optional(),
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1),
});

export const ProfileSchema = z.object({
  onboardedAt: z.string().optional(),
  primaryMode: z.enum(['singles', 'doubles', 'both']),
  focusDomainIds: z.array(z.enum(DOMAIN_IDS)).max(2),
  weeklyTargetSessions: z.number().int().min(1).max(7),
});

export const SettingsSchema = z.object({
  theme: z.enum(['system', 'light', 'dark']),
  staleDays: z.union([z.literal(14), z.literal(21), z.literal(30)]),
  lastBackupAt: z.string().optional(),
  recommendationSnoozes: z.record(z.string(), z.string()).optional(),
});

export const AppDataSchema = z.object({
  schemaVersion: z.literal(1),
  profile: ProfileSchema,
  settings: SettingsSchema,
  progress: z.record(z.string(), SkillProgressSchema),
  sessions: z.array(SessionSchema),
});

export const ExportBundleSchema = z.object({
  schemaVersion: z.literal(1),
  contentVersion: z.string().min(1),
  exportedAt: z.string().min(1),
  profile: ProfileSchema,
  settings: SettingsSchema,
  progress: z.record(z.string(), SkillProgressSchema),
  sessions: z.array(SessionSchema),
});

export const ShareSnapshotSchema = z.object({
  schemaVersion: z.literal(1),
  contentVersion: z.string().min(1),
  displayName: z.string().max(40).optional(),
  levels: z.record(z.string(), levelSchema),
  updatedAt: z.string().min(1),
});

export type Drill = z.infer<typeof DrillSchema>;
export type Prerequisite = z.infer<typeof PrerequisiteSchema>;
export type Skill = z.infer<typeof SkillSchema>;
export type Assessment = z.infer<typeof AssessmentSchema>;
export type SkillProgress = z.infer<typeof SkillProgressSchema>;
export type SessionFocus = z.infer<typeof SessionFocusSchema>;
export type Session = z.infer<typeof SessionSchema>;
export type Profile = z.infer<typeof ProfileSchema>;
export type Settings = z.infer<typeof SettingsSchema>;
export type AppData = z.infer<typeof AppDataSchema>;
export type ExportBundle = z.infer<typeof ExportBundleSchema>;
export type ShareSnapshot = z.infer<typeof ShareSnapshotSchema>;

export const DEFAULT_PROFILE: Profile = {
  primaryMode: 'both',
  focusDomainIds: ['basics', 'footwork'],
  weeklyTargetSessions: 3,
};

export const DEFAULT_SETTINGS: Settings = {
  theme: 'system',
  staleDays: 21,
};

export const DEFAULT_APP_DATA: AppData = {
  schemaVersion: 1,
  profile: DEFAULT_PROFILE,
  settings: DEFAULT_SETTINGS,
  progress: {},
  sessions: [],
};
