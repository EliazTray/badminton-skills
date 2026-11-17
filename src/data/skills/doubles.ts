import type { Skill } from '../schema';

export const doublesSkills: Skill[] = [
  {
    id: 'front-back-formation',
    domainId: 'doubles',
    name: '前后站位',
    tier: 'foundation',
    isAnchor: true,
    contentStatus: 'complete',
    summary: '双打进攻时一前一后：前场封网、后场进攻，形成连续的压迫。',
    keyPoints: [
      '进攻时前场队员站在前发球线附近，拍头举高，负责封直线和放网。',
      '后场队员负责杀球、吊球和高远球，击球后根据质量决定是否跟进。',
      '前场队员不要回头抢后场球，后场队员也不要冲到前场抢同伴的球。',
    ],
    commonErrors: [
      '两个人站成左右平行，进攻时没人封网，杀球后下一拍接不上。',
      '前场队员拍头垂下或站得太靠后，对方挡网时来不及封。',
    ],
    drills: [
      {
        name: '前后站位封网',
        description: '后场连续杀球或吊球，前场封网，保持前后站位，连续 20 拍不换位。',
        prescription: '4 组 × 20 拍',
      },
      {
        name: '攻防轮转',
        description: '从前後站位开始，搭档起高球后两人轮转成左右防守，再回到前后进攻。',
        prescription: '3 组 × 10 次',
      },
    ],
    prerequisites: [{ skillId: 'ready-stance', minLevel: 2 }],
    rubric: {
      1: [
        '能说出双打进攻时前后两人的职责和基本站位。',
        '无球时能和搭档摆出正确的前后站位。',
      ],
      2: [
        '后场搭档连续杀球 10 次，前场能保持举拍并封住直线。',
        '前后两人不会同时后退或同时上前，基本保持一前一后。',
      ],
      3: [
        '连续进攻 20 拍，至少 15 拍保持前后站位，前场能封到一半以上的回球。',
        '后场杀球质量下降时，两人能及时调整为防守站位。',
      ],
      4: [
        '双打对抗中前后站位能稳定维持，前场能主动创造机会、后场能终结。',
        '能根据对方回球质量和搭档位置自然轮转，不出现两人抢球或让球。',
      ],
    },
    tags: ['doubles', 'attack', 'net'],
    relatedSkillIds: ['ready-stance', 'net-cover', 'rotation', 'cover-and-support'],
  },
  {
    id: 'side-defense',
    domainId: 'doubles',
    name: '左右防守站位',
    tier: 'core',
    contentStatus: 'draft',
    summary: '双打防守时两人左右平分场地，各自负责直线，把对方的杀球挡回去。',
    keyPoints: [
      '两人站在中场附近，左右分开，拍头举在胸前，重心降低。',
      '优先防直线，斜线由同伴覆盖；不要两人都扑向同一个球。',
      '挡网或抽球后根据回球质量决定是否转为前后进攻站位。',
    ],
    commonErrors: [
      '两人站得太近或太靠后，边线空当太大。',
      '防守时拍头垂下，对方杀球到身前才抬拍。',
    ],
    drills: [
      {
        name: '左右接杀',
        description: '两人左右防守，搭档连续杀向两边，练习各自防直线和补位。',
        prescription: '4 组 × 20 球',
      },
    ],
    prerequisites: [{ skillId: 'defense-stance', minLevel: 2 }],
    rubric: {
      1: ['能说出双打左右防守的分工和站位宽度。'],
      2: ['两人能摆出左右防守站位，拍头保持在身前。'],
      3: ['连续防守 15 球，至少 10 球能挡回对方场区，不出现两人抢球。'],
      4: ['比赛中能根据对方杀球线路保持左右防守，挡网后自然转为进攻。'],
    },
    tags: ['doubles', 'defense'],
    relatedSkillIds: ['defense-stance', 'smash-block', 'rotation'],
  },
  {
    id: 'cover-and-support',
    domainId: 'doubles',
    name: '补位与配合',
    tier: 'core',
    contentStatus: 'draft',
    summary: '搭档击球时，另一个人要补住空当，让场地始终有人覆盖。',
    keyPoints: [
      '搭档击球时，自己先判断他可能回什么球，再移动到最可能出现的空当。',
      '前场队员封网时，后场队员补后场两角；后场队员杀球时，前场队员准备封直线。',
      '不要站在搭档身后看球，也不要抢搭档已经能处理的球。',
    ],
    commonErrors: [
      '两人盯着同一个球，另一边完全空着。',
      '搭档击球后自己原地不动，没有根据回球方向调整位置。',
    ],
    drills: [
      {
        name: '二打二补位',
        description: '半场二打二，规定每次击球后必须补到空当，练习不抢球、不让球。',
        prescription: '4 组 × 30 秒',
      },
    ],
    prerequisites: [{ skillId: 'front-back-formation', minLevel: 2 }],
    rubric: {
      1: ['能说出搭档击球时自己的补位原则。'],
      2: ['二打二中能根据搭档位置调整站位，不总站在同一处。'],
      3: ['连续多拍中多数回合能覆盖空当，不出现两人抢同一球。'],
      4: ['双打对抗中补位自然，搭档进攻时能预判并封住对方回球线路。'],
    },
    tags: ['doubles', 'defense', 'net'],
    relatedSkillIds: ['front-back-formation', 'front-court-coordination', 'rotation'],
  },
  {
    id: 'front-court-coordination',
    domainId: 'doubles',
    name: '前场封网配合',
    tier: 'advanced',
    contentStatus: 'draft',
    summary: '前场队员如何和后场搭档配合，封住直线、创造机会，而不是抢球或漏球。',
    keyPoints: [
      '后场搭档杀直线时，前场优先封直线；后场杀斜线时，前场调整到斜线方向。',
      '前场封网用短促动作，不要大幅度挥拍，避免挡住搭档视线。',
      '前场不要退到中场抢后场球；如果后场搭档已经到位，前场继续守网前。',
    ],
    commonErrors: [
      '后场杀球后前场站在原地，没有根据球路封线。',
      '前场球员回头抢后场球，导致网前完全空出。',
    ],
    drills: [
      {
        name: '杀封配合',
        description: '后场定点杀直线和斜线，前场根据球路封网，连续 20 球。',
        prescription: '4 组 × 20 球',
      },
    ],
    prerequisites: [
      { skillId: 'net-cover', minLevel: 2 },
      { skillId: 'front-back-formation', minLevel: 2 },
    ],
    rubric: {
      1: ['能说出前后场搭档的封网分工。'],
      2: ['后场杀直线时，前场能封住直线回球。'],
      3: ['杀封配合 20 球，至少 12 球前场能封到或迫使对方起球。'],
      4: ['比赛中前后场配合默契，前场能根据搭档球路提前移动，不抢球不漏球。'],
    },
    tags: ['doubles', 'attack', 'net'],
    relatedSkillIds: ['net-cover', 'front-back-formation', 'rotation'],
  },
  {
    id: 'attack-defense-transition',
    domainId: 'doubles',
    name: '攻防转换',
    tier: 'advanced',
    contentStatus: 'draft',
    summary: '在进攻和防守之间快速切换，是双打多拍回合里最容易被忽视的能力。',
    keyPoints: [
      '自己起高球或挑球后，立刻准备转防守，前场后退、后场上前。',
      '挡网或抽球形成反攻时，击球者跟进，搭档补位，转回前后进攻。',
      '转换过程中先保证两人不撞、不抢，再追求下一拍的主动。',
    ],
    commonErrors: [
      '起高球后还保持进攻站位，后场暴露大空当。',
      '挡网成功后两人都向前冲，后场无人保护。',
    ],
    drills: [
      {
        name: '连续攻防转换',
        description: '搭档随机杀球或吊球，防守方挡网后转进攻，连续 10 个回合。',
        prescription: '4 组 × 10 回合',
      },
    ],
    prerequisites: [
      { skillId: 'rotation', minLevel: 2 },
      { skillId: 'smash-block', minLevel: 2 },
      { skillId: 'front-court-coordination', minLevel: 2 },
    ],
    rubric: {
      1: ['能说出进攻转防守、防守转进攻的触发时机。'],
      2: ['无球时能完成一次前后站位到左右防守的转换。'],
      3: ['连续 10 个回合中至少 7 次转换到位，不出现两人站位重叠。'],
      4: ['双打比赛中能根据来球质量自然切换阵型，转换后仍保持主动或均势。'],
    },
    tags: ['doubles', 'attack', 'defense'],
    relatedSkillIds: ['rotation', 'smash-block', 'front-court-coordination'],
  },
];
