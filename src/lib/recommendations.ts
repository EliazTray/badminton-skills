import type {
  Level,
  Profile,
  Session,
  Settings,
  Skill,
  SkillProgress,
} from '../data/schema';
import { daysSince, startOfCurrentWeek, todayISO } from './dates';
import { getDescendantCount } from './graph';
import { getAllDomainStats, getFrontierSkills, getSkillLevel } from './progress';
import { getLastPracticeBySkill, getStaleSkills, getWeekSessionStats } from './sessions';

export type RecommendationSlot = 'main' | 'balance' | 'review' | 'extra';

export interface Recommendation {
  slot: RecommendationSlot;
  skill: Skill;
  reason: string;
}

export interface RecommendationInput {
  progress: Record<string, SkillProgress>;
  sessions: Session[];
  profile: Profile;
  settings: Settings;
  now?: Date;
}

function modeMatches(skill: Skill, profile: Profile): boolean {
  if (profile.primaryMode === 'both') return true;
  if (profile.primaryMode === 'doubles') {
    return skill.tags.includes('doubles') || skill.domainId === 'doubles';
  }
  return !skill.tags.includes('doubles') || skill.tags.includes('singles');
}

function recentPracticePenalty(skillId: string, lastPractices: Map<string, string>, now: Date): number {
  const lastDate = lastPractices.get(skillId);
  if (!lastDate) return 0;
  const days = daysSince(lastDate, now);
  return days <= 2 ? 5 : days <= 5 ? 2 : 0;
}

function reasonForMain(
  skill: Skill,
  level: Level,
  domainAverage: number,
  lastDate: string | undefined,
  staleDays: number,
  now: Date,
  weeklyGoalMet: boolean,
): string {
  if (weeklyGoalMet) return '本周目标已完成，这条可以选做；优先保持规律。';
  if (lastDate && daysSince(lastDate, now) > staleDays) {
    return `已经 ${daysSince(lastDate, now)} 天没练，适合重新找手感。`;
  }
  if (level > 0) return '正在练，继续把动作和稳定性做扎实。';
  if (skill.isAnchor) return '领域锚点，先从这里标出起点。';
  if (domainAverage < 0.5) return '这个领域还有明显空位，适合先开一个头。';
  if (getDescendantCount(skill.id) >= 6) return '基础枢纽，能解锁多条后续路径。';
  return '前置已满足，可以开始练。';
}

export function buildRecommendations({
  progress,
  sessions,
  profile,
  settings,
  now = new Date(),
}: RecommendationInput): Recommendation[] {
  const frontier = getFrontierSkills(progress).filter((skill) => modeMatches(skill, profile));
  if (frontier.length === 0) return [];

  const domainStats = new Map(
    getAllDomainStats(progress).map((domain) => [domain.domainId, domain]),
  );
  const lastPractices = getLastPracticeBySkill(sessions);
  const weekStats = getWeekSessionStats(sessions, todayISO(startOfCurrentWeek(now)));
  const weeklyGoalMet = weekStats.count >= profile.weeklyTargetSessions;
  const focusDomains = new Set(profile.focusDomainIds);

  const scored = frontier.map((skill) => {
    const level = getSkillLevel(progress, skill.id);
    const domain = domainStats.get(skill.domainId);
    const domainAverage = domain?.averageLevel ?? 0;
    const descendants = getDescendantCount(skill.id);
    const priority =
      level * 10 +
      (focusDomains.has(skill.domainId) ? 8 : 0) +
      (4 - domainAverage) * 4 +
      (skill.isAnchor ? 4 : 0) +
      Math.min(descendants, 8) * 0.6 -
      recentPracticePenalty(skill.id, lastPractices, now);
    return { skill, level, domainAverage, priority };
  });

  scored.sort((a, b) => b.priority - a.priority || a.skill.name.localeCompare(b.skill.name, 'zh-CN'));

  const picked: Recommendation[] = [];
  const used = new Set<string>();

  const main = scored[0];
  if (main) {
    picked.push({
      slot: 'main',
      skill: main.skill,
      reason: reasonForMain(
        main.skill,
        main.level,
        main.domainAverage,
        lastPractices.get(main.skill.id),
        settings.staleDays,
        now,
        weeklyGoalMet,
      ),
    });
    used.add(main.skill.id);
  }

  const balanceCandidates = scored.filter((item) => !used.has(item.skill.id));
  balanceCandidates.sort((a, b) => {
    const aSameDomain = a.skill.domainId === main?.skill.domainId ? 1 : 0;
    const bSameDomain = b.skill.domainId === main?.skill.domainId ? 1 : 0;
    const aScore = (4 - a.domainAverage) * 8 + a.level * 2 - aSameDomain * 4;
    const bScore = (4 - b.domainAverage) * 8 + b.level * 2 - bSameDomain * 4;
    return bScore - aScore || a.skill.name.localeCompare(b.skill.name, 'zh-CN');
  });
  const balance = balanceCandidates[0];
  if (balance) {
    picked.push({
      slot: 'balance',
      skill: balance.skill,
      reason:
        balance.domainAverage <= 0.5
          ? '这个领域平均等级最低，补一补更均衡。'
          : '换一个领域练，避免只盯着一处。',
    });
    used.add(balance.skill.id);
  }

  const stale = getStaleSkills(progress, sessions, settings.staleDays, now).find(
    (item) => !used.has(item.skill.id),
  );
  if (stale) {
    picked.push({
      slot: 'review',
      skill: stale.skill,
      reason: `已经 ${stale.days} 天没有训练；用短时间复习保持手感。`,
    });
    used.add(stale.skill.id);
  }

  if (picked.length < 3) {
    for (const candidate of scored) {
      if (picked.length >= 3) break;
      if (used.has(candidate.skill.id)) continue;
      picked.push({
        slot: 'extra',
        skill: candidate.skill,
        reason: '前置已满足，可以继续推进。',
      });
      used.add(candidate.skill.id);
    }
  }

  return picked.slice(0, 3);
}
