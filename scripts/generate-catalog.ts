import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  ALL_SKILLS,
  BASE_SKILLS,
  CONTENT_VERSION,
  DOMAINS,
  VARIANT_SKILLS,
  getAnchorSkill,
} from '../src/data';

const byId = new Map(ALL_SKILLS.map((skill) => [skill.id, skill]));
const tierLabels = { foundation: '基础', core: '进阶', advanced: '实战' } as const;
const statusLabels = { complete: '完整', draft: '草案' } as const;
const termLabels = { common: '通用', coach: '教练常用', 'needs-review': '待校对' } as const;

const lines: string[] = [
  '# 羽球技能目录',
  '',
  `> 内容版本：${CONTENT_VERSION} · ${BASE_SKILLS.length} 个主技术 + ${VARIANT_SKILLS.length} 个细分 · ${DOMAINS.length} 个领域`,
  '',
  '本文件由 `npm run catalog:generate` 从技能数据生成，用于内容和前置关系评审。',
  '',
  '## 等级说明',
  '',
  '| 等级 | 名称 | 判定含义 |',
  '|---:|---|---|',
  '| 0 | 未开始 | 没有练过或还不能完成 |',
  '| 1 | 认知 | 能复述动作要点，可无球或慢速模仿 |',
  '| 2 | 定点 | 固定喂球或固定线路下基本完成，动作结构正确 |',
  '| 3 | 稳定 | 移动中或连续多拍下达到成功率 / 落点门槛，质量可控 |',
  '| 4 | 实战 | 对抗中主动使用，压力下保持稳定，并能变化落点或节奏 |',
  '',
  '## 领域总览',
  '',
  '| 领域 | 主技术数 | 细分技术数 | 锚点 |',
  '|---|---:|---:|---|',
];

for (const domain of DOMAINS) {
  const baseSkills = BASE_SKILLS.filter((skill) => skill.domainId === domain.id);
  const variants = VARIANT_SKILLS.filter((skill) => skill.domainId === domain.id);
  const anchor = getAnchorSkill(domain.id);
  lines.push(
    `| ${domain.name} | ${baseSkills.length} | ${variants.length} | ${anchor?.name ?? '—'} |`,
  );
}

for (const domain of DOMAINS) {
  const skills = BASE_SKILLS.filter((skill) => skill.domainId === domain.id);
  lines.push('', `## ${domain.name}`, '', domain.description, '');
  lines.push('| 主技术 | 层级 | 锚点 | 前置 | 内容 |');
  lines.push('|---|---|---|---|---|');

  for (const skill of skills) {
    const prerequisites =
      skill.prerequisites.length === 0
        ? '—'
        : skill.prerequisites
            .map((item) => `${byId.get(item.skillId)?.name ?? item.skillId} L${item.minLevel}`)
            .join('、');
    lines.push(
      `| ${skill.name} | ${tierLabels[skill.tier]} | ${skill.isAnchor ? '★' : ''} | ${prerequisites} | ${statusLabels[skill.contentStatus]} |`,
    );
  }
}

lines.push('', '## 细分技术', '');
lines.push('| 领域 | 主技术 | 细分技术 | 术语状态 | 内容 |');
lines.push('|---|---|---|---|---|');

for (const domain of DOMAINS) {
  const variants = VARIANT_SKILLS.filter((skill) => skill.domainId === domain.id);
  for (const variant of variants) {
    const parent = variant.parentSkillId ? byId.get(variant.parentSkillId) : undefined;
    lines.push(
      `| ${domain.name} | ${parent?.name ?? '—'} | ${variant.name} | ${termLabels[variant.termStatus ?? 'needs-review']} | ${statusLabels[variant.contentStatus]} |`,
    );
  }
}

lines.push('', '## 锚点技能标准', '');

for (const domain of DOMAINS) {
  const anchor = getAnchorSkill(domain.id);
  if (!anchor) continue;
  lines.push(`### ${anchor.name}（${domain.name}）`, '', anchor.summary, '');
  for (const level of [1, 2, 3, 4] as const) {
    const label = ['认知', '定点', '稳定', '实战'][level - 1];
    lines.push(`**L${level} ${label}**`, '');
    for (const criterion of anchor.rubric[level]) {
      lines.push(`- ${criterion}`);
    }
    lines.push('');
  }
}

lines.push(
  '## 评审重点',
  '',
  '- 主技术分类是否符合你的实际训练顺序；有没有明显缺失或过早出现的技能。',
  '- 前置关系是否过严或过松；跨领域前置是否合理。',
  '- 细分技术是否挂在正确的主技术下，是否需要补充或删除。',
  '- 锚点的 3 / 4 级标准是否可观察、可自测，而不是主观感受。',
  '- 术语是否使用你熟悉的叫法；标为「待校对」的术语需要后续确认。',
  '',
);

const docsDir = resolve(process.cwd(), 'docs');
mkdirSync(docsDir, { recursive: true });
writeFileSync(resolve(docsDir, 'skill-catalog.md'), `${lines.join('\n')}\n`, 'utf8');
console.log(
  `Wrote docs/skill-catalog.md (${BASE_SKILLS.length} base + ${VARIANT_SKILLS.length} variants)`,
);
