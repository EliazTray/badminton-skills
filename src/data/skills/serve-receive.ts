import type { Skill } from '../schema';

export const serveReceiveSkills: Skill[] = [
  {
    id: 'high-serve',
    domainId: 'serve-receive',
    name: '正手高远发球',
    tier: 'foundation',
    isAnchor: true,
    contentStatus: 'complete',
    summary: '把球又高又深地发到对方后场，给自己争取准备时间，是单打最基础的发球。',
    keyPoints: [
      '侧身站位，非持拍脚在前，持拍手把球拍向后引，重心放在后脚。',
      '球在身体前下方下落时击球，拍面向上送，击球后随挥到身体前上方。',
      '目标不是发得越高越好，而是又高又深，让球落向对方后场两角。',
    ],
    commonErrors: [
      '击球点太靠后或太高，球发得平而短，对方可以直接下压。',
      '只用手臂发力，缺少转体和送拍，发球稳定性和深度都不够。',
    ],
    drills: [
      {
        name: '后场落点发球',
        description: '在对方后场两个角放目标，连续发 20 个高远球，记录落入后场区域的次数。',
        prescription: '4 组 × 20 个',
      },
      {
        name: '发球节奏练习',
        description: '固定呼吸和抛球节奏，每次发球前停一拍，避免越练越快。',
        prescription: '3 组 × 10 个',
      },
    ],
    prerequisites: [
      { skillId: 'forehand-grip', minLevel: 2 },
      { skillId: 'ready-stance', minLevel: 2 },
    ],
    rubric: {
      1: [
        '能说出正手高远发球的站位、击球点和随挥方向。',
        '无球时能完成一次完整的发球动作。',
      ],
      2: [
        '连续发 10 个球，至少 7 个过网并落入对方后场。',
        '发球动作基本连贯，击球后拍面朝目标方向随挥。',
      ],
      3: [
        '连续发 20 个球，至少 15 个落入对方后场三分之一区域。',
        '其中至少 10 个球有足够高度，对方无法在网前直接扑压。',
      ],
      4: [
        '单打对抗中发球落点能稳定压到后场两角，关键分不因发球失误送分。',
        '能根据对手站位调整发球深度，而不是每个球都一样。',
      ],
    },
    tags: ['singles', 'doubles'],
    relatedSkillIds: ['forehand-grip', 'ready-stance', 'flat-serve'],
  },
  {
    id: 'backhand-low-serve',
    domainId: 'serve-receive',
    name: '反手网前发球',
    tier: 'core',
    contentStatus: 'draft',
    summary: '用反手把球贴网发到前发球线附近，迫使对方起高球，是双打最常用的发球。',
    keyPoints: [
      '持拍手同侧脚在前，身体靠近前发球线，拍头保持在腰部高度。',
      '用拇指顶压拍柄，轻轻把球送过网，击球后拍头停住，不要大幅随挥。',
      '目标落点是前发球线后一点的中路，过网高度尽量低。',
    ],
    commonErrors: [
      '击球时抬肘或甩腕，球过网太高，被对方直接扑杀。',
      '发球力量过大，球飞过前发球线太远，失去低平优势。',
    ],
    drills: [
      {
        name: '贴网发球',
        description: '在网带上方拉一条绳子作为高度参照，连续发短球，要求球贴网过。',
        prescription: '4 组 × 20 个',
      },
    ],
    prerequisites: [
      { skillId: 'backhand-grip', minLevel: 2 },
      { skillId: 'ready-stance', minLevel: 2 },
    ],
    rubric: {
      1: ['能说出反手发网前球的站位、握拍和击球点。'],
      2: ['连续发 10 个球，至少 7 个过网并落在前发球线附近。'],
      3: ['连续发 20 个球，至少 15 个过网高度低且落点集中，不出现发球失误。'],
      4: ['双打对抗中发球能稳定限制对方抢攻，并根据接发站位变化落点。'],
    },
    tags: ['singles', 'doubles', 'net'],
    relatedSkillIds: ['backhand-grip', 'doubles-short-serve', 'doubles-receive-attack'],
  },
  {
    id: 'flat-serve',
    domainId: 'serve-receive',
    name: '发平高球',
    tier: 'core',
    contentStatus: 'draft',
    summary: '用比高远球更平的弧线把球发到对方后场，压缩对方准备时间。',
    keyPoints: [
      '发球动作和高远球类似，但击球点稍高、拍面更向前送。',
      '球飞行弧线更平，落点仍要深，避免落在中场被对方进攻。',
      '在对手站位靠前或接发习惯提前移动时使用，不要每个球都用。',
    ],
    commonErrors: [
      '弧线太平但落点不够深，球落在中场，直接送给对方杀球。',
      '为了压低弧线而收力，球发不过对方后场，反而变成半场球。',
    ],
    drills: [
      {
        name: '平高球落点',
        description: '在后场放两个目标，连续发平高球，要求球过对方头顶并落在后场区域。',
        prescription: '3 组 × 15 个',
      },
    ],
    prerequisites: [
      { skillId: 'high-serve', minLevel: 2 },
      { skillId: 'contact-and-power', minLevel: 2 },
    ],
    rubric: {
      1: ['能说出平高球和高远球的弧线区别。'],
      2: ['连续发 10 个球，至少 7 个过网且落入对方后场。'],
      3: ['连续发 20 个球，至少 14 个既有平飞弧线又有足够深度。'],
      4: ['单打中能根据对手接发站位选择平高球，发球后不被直接进攻。'],
    },
    tags: ['singles', 'doubles', 'attack'],
    relatedSkillIds: ['high-serve', 'contact-and-power'],
  },
  {
    id: 'doubles-short-serve',
    domainId: 'serve-receive',
    name: '双打发短球',
    tier: 'core',
    contentStatus: 'draft',
    summary: '把球低平地发到对方前场中路，限制对方起拍进攻，并给搭档创造封网机会。',
    keyPoints: [
      '站位靠近前发球线，拍头稳定，用反手拇指和小臂把球送过网。',
      '落点优先中路前发球线附近，让接发者难以判断由谁处理。',
      '发球后立刻举拍封网，不要把球发出去就站着看。',
    ],
    commonErrors: [
      '发球高度过高，被对方直接扑杀或推到底线。',
      '发球后没有跟进封网，搭档在后场只能被动防守。',
    ],
    drills: [
      {
        name: '发球封网连接',
        description: '发短球后立刻向前一步举拍，模拟封对方回放或推球。',
        prescription: '4 组 × 15 个',
      },
    ],
    prerequisites: [{ skillId: 'backhand-low-serve', minLevel: 2 }],
    rubric: {
      1: ['能说出双打短球的落点和发球后的封网职责。'],
      2: ['连续发 10 个短球，至少 7 个低过网并落在前场。'],
      3: ['连续发 20 个短球，至少 15 个落点集中在中路，发球后能立即举拍。'],
      4: ['双打比赛中能根据接发者站位变化短球落点，发球后不被对方直接抢攻。'],
    },
    tags: ['doubles', 'net'],
    relatedSkillIds: ['backhand-low-serve', 'front-back-formation', 'front-court-coordination'],
  },
  {
    id: 'singles-receive',
    domainId: 'serve-receive',
    name: '单打接发',
    tier: 'core',
    contentStatus: 'draft',
    summary: '在对方发球后快速判断落点，用稳定的回球把发球权转成自己的第一拍。',
    keyPoints: [
      '站在前发球线后一步左右，重心在前脚掌，拍头抬起。',
      '对方发球出手后做启动步，根据球的深度选择下压、推后场或高远。',
      '接发优先保证过网和深度，不要一上来就追求贴边线。',
    ],
    commonErrors: [
      '站得太靠后，对方发短球时来不及上前。',
      '接发时只看球不看对方站位，回球总是送给对方舒服的位置。',
    ],
    drills: [
      {
        name: '接发随机落点',
        description: '让搭档交替发高远和短球，接发者启动后回直线或斜线，连续 20 个。',
        prescription: '3 组 × 20 个',
      },
    ],
    prerequisites: [
      { skillId: 'ready-stance', minLevel: 2 },
      { skillId: 'split-step', minLevel: 2 },
    ],
    rubric: {
      1: ['能说出接发站位和启动时机。'],
      2: ['接发 10 个球，至少 7 个能过网并回到对方后场或网前。'],
      3: ['接发 20 个球，至少 15 个有明确落点，不出现直接下网或出界。'],
      4: ['单打中能根据对方发球质量选择回球方式，接发后进入主动或均势。'],
    },
    tags: ['singles', 'defense'],
    relatedSkillIds: ['split-step', 'frontcourt-footwork', 'four-corners'],
  },
  {
    id: 'doubles-receive-attack',
    domainId: 'serve-receive',
    name: '双打接发抢攻',
    tier: 'advanced',
    contentStatus: 'draft',
    summary: '接对方短球时主动向前压，用推、扑或放网把发球权直接转成进攻。',
    keyPoints: [
      '站位靠近前发球线，拍头高于网带，看到短球先向前迎球。',
      '优先推对方中路或边线空当，也可以轻放网前迫使对方起球。',
      '接发抢攻后立刻跟进封网，和搭档形成前后进攻站位。',
    ],
    commonErrors: [
      '接发时拍头太低，只能向上挑球，把进攻机会还给对方。',
      '只顾发力扑球，没有观察对方站位，球打到对方拍面上。',
    ],
    drills: [
      {
        name: '接发推扑',
        description: '搭档连续发短球，接发者交替推中路和扑边线，每球后跟进封网。',
        prescription: '4 组 × 15 个',
      },
    ],
    prerequisites: [
      { skillId: 'doubles-short-serve', minLevel: 2 },
      { skillId: 'frontcourt-footwork', minLevel: 2 },
      { skillId: 'net-push', minLevel: 2 },
    ],
    rubric: {
      1: ['能说出接发抢攻的站位、拍头高度和目标落点。'],
      2: ['接发短球 10 个，至少 6 个能主动向前推到对方场地。'],
      3: ['接发 15 个短球，至少 10 个形成有效进攻或迫使对方起球。'],
      4: ['双打对抗中能根据发球质量和对手站位选择推、扑、放，接发后保持进攻站位。'],
    },
    tags: ['doubles', 'attack', 'net'],
    relatedSkillIds: ['doubles-short-serve', 'net-push', 'net-kill', 'front-back-formation'],
  },
];
