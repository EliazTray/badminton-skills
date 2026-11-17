import type { Skill } from '../schema';

/**
 * 搓球族的首批细分技术。
 * 术语优先对齐刘辉公开课程里的收搓 / 展搓；课程内容未核实，标准标为草案。
 */
export const netSpinVariants: Skill[] = [
  {
    id: 'net-spin-fh-close',
    domainId: 'front-court',
    name: '正手收搓',
    tier: 'core',
    parentSkillId: 'net-spin',
    role: 'specialized',
    termStatus: 'common',
    aliases: ['正手收搓'],
    contentStatus: 'draft',
    summary: '正手网前由外向内切球托，让球翻滚贴网下落，是最常用的搓球细分。',
    keyPoints: [
      '拍头高于手腕，肘部放松，拍面从右外侧朝中线包过去。',
      '接触球托右后侧或底部，用手指收紧完成短促摩擦，不要用大臂挥拍。',
      '击球后拍头短暂制动，让球过网即下坠；动作越小，对手越难判断。',
    ],
    commonErrors: [
      '用大臂向前送，拍面没有真正摩擦球托，球只会平推过去。',
      '击球点太低或拍面太开，球被向上托高，给对手扑球机会。',
    ],
    drills: [
      {
        name: '定点收搓贴网',
        description: '搭档连续抛球，正手收搓到对方前场，要求球过网后下坠，记录贴网次数。',
        prescription: '4 组 × 15 球',
      },
      {
        name: '收搓落点',
        description: '在对方前场放两个目标，交替搓直线和斜线，要求过网高度低、落点集中。',
        prescription: '3 组 × 12 球',
      },
    ],
    prerequisites: [{ skillId: 'net-spin', minLevel: 2 }],
    rubric: {
      1: [
        '能说出收搓是由外向内摩擦球托，并做出无球模仿。',
        '知道正手收搓的拍面方向和击球点大致位置。',
      ],
      2: [
        '定点收搓 10 次，至少 6 个过网并落在前场。',
        '动作以手指摩擦为主，不是用整条手臂把球推出去。',
      ],
      3: [
        '连续收搓 15 次，至少 10 个球过网后明显下坠，飞行翻滚。',
        '能控制过网高度和落点，球不轻易弹到中场。',
      ],
      4: [
        '对抗中能主动使用正手收搓，连续 3 次不出现下网或过高。',
        '能根据来球位置调整收搓的拍面角度，把对手调到网前。',
      ],
    },
    tags: ['singles', 'doubles', 'net'],
    relatedSkillIds: ['net-spin', 'net-spin-fh-open', 'net-shot'],
  },
  {
    id: 'net-spin-fh-open',
    domainId: 'front-court',
    name: '正手展搓',
    tier: 'advanced',
    parentSkillId: 'net-spin',
    role: 'specialized',
    termStatus: 'common',
    aliases: ['正手展搓'],
    contentStatus: 'draft',
    summary: '正手网前由内向外展切球托，球更贴网、落点更靠边线，适合近网和低点来球。',
    keyPoints: [
      '拍头先伸向球，几乎不引拍，拍面从身体内侧朝外展开。',
      '接触球托左后侧或底部，用短促的手指摩擦让球翻滚。',
      '展搓的球容易飞得略高，贴网或低点使用更安全；不要在高点硬展。',
    ],
    commonErrors: [
      '引拍过大，动作提前暴露，对手容易判断落点。',
      '拍面展开太多或摩擦过薄，球过网过高或直接下网。',
    ],
    drills: [
      {
        name: '近网展搓',
        description: '搭档连续喂贴网球，练习正手展搓，要求球贴网过并落向边线。',
        prescription: '4 组 × 15 球',
      },
      {
        name: '收展交替',
        description: '同一准备动作交替做收搓和展搓，观察对手启动方向，动作尽量一致。',
        prescription: '3 组 × 12 球',
      },
    ],
    prerequisites: [{ skillId: 'net-spin', minLevel: 2 }],
    rubric: {
      1: [
        '能说出展搓是由内向外摩擦，并区分它和收搓的方向。',
        '能做出无球展搓动作，拍面方向正确。',
      ],
      2: [
        '定点展搓 10 次，至少 6 个过网并落在前场。',
        '动作幅度小，主要靠手腕和手指展开，不靠大臂。',
      ],
      3: [
        '连续展搓 15 次，至少 10 个贴网下落，落点不飘到中场。',
        '能根据来球高度选择展搓或收搓，而不是每个球都用同一招。',
      ],
      4: [
        '对抗中能用展搓处理贴网低球，连续 3 次不出现过高或下网。',
        '能利用展搓把球送到边线，迫使对手横向移动。',
      ],
    },
    tags: ['singles', 'doubles', 'net'],
    relatedSkillIds: ['net-spin', 'net-spin-fh-close', 'cross-net'],
  },
  {
    id: 'net-spin-bh-close',
    domainId: 'front-court',
    name: '反手收搓',
    tier: 'core',
    parentSkillId: 'net-spin',
    role: 'specialized',
    termStatus: 'common',
    aliases: ['反手收搓'],
    contentStatus: 'draft',
    summary: '反手网前由外向内切球托，用拇指和手指控制摩擦，处理左侧网前球。',
    keyPoints: [
      '反手握拍，拇指顶住拍柄，拍头先伸向来球，身体保持低重心。',
      '拍面从左侧外向内包，摩擦球托左后侧或底部，手指收紧。',
      '击球后短制动，球过网即下坠；反手不要只靠手腕甩。',
    ],
    commonErrors: [
      '握拍太紧，拇指和手腕僵硬，球只能平推或弹高。',
      '拍面没有包住球托，摩擦不足，球不翻滚且落点不稳定。',
    ],
    drills: [
      {
        name: '反手收搓',
        description: '搭档连续喂反手网前球，练习收搓贴网，记录过网后下坠的球数。',
        prescription: '4 组 × 15 球',
      },
    ],
    prerequisites: [{ skillId: 'net-spin', minLevel: 2 }],
    rubric: {
      1: [
        '能说出反手收搓的握拍和由外向内摩擦方向。',
        '能做出无球反手收搓动作。',
      ],
      2: [
        '定点反手收搓 10 次，至少 6 个过网并落在前场。',
        '击球时拇指支撑稳定，不是整只手向下压。',
      ],
      3: [
        '连续反手收搓 15 次，至少 10 个过网后下坠，落点稳定。',
        '能在身体前侧完成击球，不因够球而破坏拍面。',
      ],
      4: [
        '对抗中能主动用反手收搓处理贴网或低点球，连续 3 次失误可控。',
        '能根据对手站位调整落点，不总是回到对手手边。',
      ],
    },
    tags: ['singles', 'doubles', 'net'],
    relatedSkillIds: ['net-spin', 'net-spin-bh-open', 'net-shot-bh'],
  },
  {
    id: 'net-spin-bh-open',
    domainId: 'front-court',
    name: '反手展搓',
    tier: 'advanced',
    parentSkillId: 'net-spin',
    role: 'specialized',
    termStatus: 'common',
    aliases: ['反手展搓'],
    contentStatus: 'draft',
    summary: '反手网前由内向外展切球托，适合贴近网带的来球，落点更靠边线。',
    keyPoints: [
      '反手握拍，拍头先伸出，身体跟到网前，不要只伸手臂。',
      '拍面由内向外展开，摩擦球托右后侧或底部，手指控制出球。',
      '展搓弧线略高，尽量在低点或贴网时使用，避免高点被扑。',
    ],
    commonErrors: [
      '身体没有跟上网，够球导致拍面角度失控。',
      '展开幅度太大，球飞过网太高或落到中场。',
    ],
    drills: [
      {
        name: '反手展搓边线',
        description: '搭档喂贴网球，练习反手展搓到边线，要求过网高度低、落点靠边。',
        prescription: '4 组 × 15 球',
      },
    ],
    prerequisites: [{ skillId: 'net-spin', minLevel: 2 }],
    rubric: {
      1: [
        '能说出反手展搓由内向外摩擦的方向，并做出无球动作。',
        '知道它和反手收搓的使用时机区别。',
      ],
      2: [
        '定点反手展搓 10 次，至少 6 个过网并落在前场。',
        '拍面能稳定展开，球不总是平推过网。',
      ],
      3: [
        '连续反手展搓 15 次，至少 10 个贴网下落，落点靠边线。',
        '上网击球时身体稳定，不因伸展而失去平衡。',
      ],
      4: [
        '对抗中能用反手展搓处理贴网低球，连续 3 次质量稳定。',
        '能配合收搓交替使用，让对手无法提前判断落点。',
      ],
    },
    tags: ['singles', 'doubles', 'net'],
    relatedSkillIds: ['net-spin', 'net-spin-bh-close', 'net-shot-bh'],
  },
];
