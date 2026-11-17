import type { Skill } from '../schema';

export const midcourtDefenseSkills: Skill[] = [
  {
    id: 'flat-drive',
    domainId: 'midcourt-defense',
    name: '平抽挡',
    tier: 'core',
    isAnchor: true,
    contentStatus: 'complete',
    summary: '在中场用平快的抽球和挡球与对方对抗，谁先稳住拍面，谁就能先拿到主动。',
    keyPoints: [
      '准备时拍头抬到胸前，握拍放松，双脚保持低重心。',
      '击球时用小臂旋转和手指收紧，把球平着送到对方中场或后场。',
      '每一拍后立刻回位举拍，连续抽挡时动作越小越好。',
    ],
    commonErrors: [
      '拍头垂得太低，来球快时只能向上挑，失去平抽的主动。',
      '每拍都想发力，动作越来越大，反而来不及准备下一拍。',
    ],
    drills: [
      {
        name: '中场连续平抽',
        description: '和搭档站在中场连续平抽，目标先稳定 20 拍，再逐渐加快节奏。',
        prescription: '4 组 × 20 拍',
      },
      {
        name: '正反手交替平抽',
        description: '搭档随机把球送到正手和反手位，练习快速换握和平抽，保持拍头高度。',
        prescription: '3 组 × 30 秒',
      },
    ],
    prerequisites: [
      { skillId: 'ready-stance', minLevel: 2 },
      { skillId: 'grip-transition', minLevel: 2 },
    ],
    rubric: {
      1: [
        '能说出平抽挡的拍头高度、握拍和击球方向。',
        '无球时能完成正手和反手平抽动作。',
      ],
      2: [
        '和搭档连续平抽 10 拍，至少 7 拍过网且不出现明显高球。',
        '击球后能立刻恢复举拍，而不是垂下拍头。',
      ],
      3: [
        '连续平抽 20 拍，至少 14 拍保持平快且落点在中后场。',
        '正反手交替时能在来球前完成换握，不因换拍漏球。',
      ],
      4: [
        '双打对抗中能连续平抽不被动，主动变线或加速创造机会。',
        '对方加速时能稳住拍面，不因急于发力而失误。',
      ],
    },
    tags: ['singles', 'doubles', 'defense', 'attack'],
    relatedSkillIds: ['ready-stance', 'grip-transition', 'forehand-drive', 'backhand-drive'],
  },
  {
    id: 'forehand-drive',
    domainId: 'midcourt-defense',
    name: '正手抽球',
    parentSkillId: 'flat-drive',
    role: 'specialized',
    tier: 'core',
    contentStatus: 'draft',
    summary: '用正手握拍在中场把球平快地抽向对方，适合处理肩部高度的来球。',
    keyPoints: [
      '侧身引拍，拍头抬到肩部高度，击球点在身体前侧。',
      '用前臂旋转和手指收紧把球向前送，拍面保持稳定。',
      '抽球后顺势回位，拍头不要垂到膝盖以下。',
    ],
    commonErrors: [
      '引拍太低，击球时只能向上挑，球速和弧线都不理想。',
      '击球点靠后，身体被球顶住，抽不出速度。',
    ],
    drills: [
      {
        name: '正手直线抽球',
        description: '搭档连续喂中场球，练习正手抽直线，每组 15 球。',
        prescription: '4 组 × 15 球',
      },
    ],
    prerequisites: [{ skillId: 'flat-drive', minLevel: 2 }],
    rubric: {
      1: ['能说出正手抽球的击球点和拍面方向。'],
      2: ['定点正手抽球 10 次，至少 7 个过网并落在对方中场或后场。'],
      3: ['连续正手抽球 15 次，至少 11 个保持平快且落点稳定。'],
      4: ['对抗中能用正手抽球变线，抽后保持拍头高度准备下一拍。'],
    },
    tags: ['singles', 'doubles', 'attack', 'defense'],
    relatedSkillIds: ['flat-drive', 'backhand-drive', 'smash-drive'],
  },
  {
    id: 'backhand-drive',
    domainId: 'midcourt-defense',
    name: '反手抽球',
    parentSkillId: 'flat-drive',
    role: 'specialized',
    tier: 'core',
    contentStatus: 'draft',
    summary: '用反手握拍在中场处理身体左侧的平快球，靠拇指支撑和短促发力。',
    keyPoints: [
      '反手握拍，拍头抬到胸前，拇指顶住拍柄。',
      '击球时用拇指顶压和前臂外旋把球平着推出，动作短促。',
      '击球后迅速回到准备姿势，避免下一拍被追身。',
    ],
    commonErrors: [
      '反手握拍太紧，拍面无法调整，球总是回到对方舒服的位置。',
      '击球时抬肘过高，动作变形，球容易下网。',
    ],
    drills: [
      {
        name: '反手平抽',
        description: '搭档连续喂反手位平球，练习反手抽直线和斜线，每组 15 球。',
        prescription: '4 组 × 15 球',
      },
    ],
    prerequisites: [
      { skillId: 'flat-drive', minLevel: 2 },
      { skillId: 'backhand-grip', minLevel: 2 },
    ],
    rubric: {
      1: ['能说出反手抽球的握拍和拇指发力方式。'],
      2: ['定点反手抽球 10 次，至少 6 个过网并落到对方场区。'],
      3: ['连续反手抽球 15 次，至少 10 个保持平快，失误不超过 3 次。'],
      4: ['双打对抗中反手位不被连续追打，能用反手抽球变线。'],
    },
    tags: ['singles', 'doubles', 'defense'],
    relatedSkillIds: ['flat-drive', 'backhand-grip', 'smash-drive'],
  },
  {
    id: 'block',
    domainId: 'midcourt-defense',
    name: '挡网',
    tier: 'core',
    contentStatus: 'draft',
    summary: '借对方来球的力量，用拍面把球轻轻挡到网前，把进攻转成防守反击。',
    keyPoints: [
      '拍头在身前，握拍放松，击球时不需要大幅引拍。',
      '拍面稍微向上，借力把球挡到对方前场，过网高度尽量低。',
      '挡网后立刻准备下一拍，不要站在原地看球。',
    ],
    commonErrors: [
      '握拍太紧、主动发力，球弹得过高，被对方继续扑压。',
      '拍面角度不对，球直接下网或挡到中场。',
    ],
    drills: [
      {
        name: '接杀挡网',
        description: '搭档在中场杀球，练习用挡网把球回到前场，每组 15 球。',
        prescription: '4 组 × 15 球',
      },
    ],
    prerequisites: [
      { skillId: 'flat-drive', minLevel: 2 },
      { skillId: 'net-shot', minLevel: 2 },
    ],
    rubric: {
      1: ['能说出挡网的借力原则和拍面角度。'],
      2: ['定点挡网 10 次，至少 6 个过网并落在前场。'],
      3: ['接杀挡网 15 次，至少 9 个贴网过，失误不超过 3 次。'],
      4: ['对抗中能用挡网化解对方杀球，挡后能跟进下一拍。'],
    },
    tags: ['singles', 'doubles', 'defense', 'net'],
    relatedSkillIds: ['smash-block', 'net-shot', 'defensive-lift'],
  },
  {
    id: 'smash-block',
    domainId: 'midcourt-defense',
    name: '接杀挡网',
    tier: 'core',
    contentStatus: 'draft',
    summary: '面对对方杀球，用低重心和短促的挡网把球回到对方前场。',
    keyPoints: [
      '先降低重心，拍头在身前，眼睛盯住对方拍面。',
      '用挡而不是挥，拍面稍向上，把球送到对方前场空当。',
      '挡完立刻起身准备下一拍，不要因为怕球而闭眼或后仰。',
    ],
    commonErrors: [
      '站得太直，杀球到身边才降重心，来不及挡。',
      '挡网时主动发力，球弹得过高，再次被进攻。',
    ],
    drills: [
      {
        name: '半场接杀',
        description: '搭档连续杀球到左右两侧，练习低重心挡直线和斜线，每组 15 球。',
        prescription: '4 组 × 15 球',
      },
    ],
    prerequisites: [
      { skillId: 'block', minLevel: 2 },
      { skillId: 'defense-stance', minLevel: 2 },
    ],
    rubric: {
      1: ['能说出接杀时的重心、拍面角度和挡网目标。'],
      2: ['定点接杀挡网 10 次，至少 5 次过网并落在前场。'],
      3: ['连续接杀 15 次，至少 9 次挡过网，失误不超过 4 次。'],
      4: ['对抗中能稳定接住对方中等力量杀球，挡网后进入防守反击。'],
    },
    tags: ['singles', 'doubles', 'defense', 'net'],
    relatedSkillIds: ['block', 'defense-stance', 'smash-drive', 'attack-defense-transition'],
  },
  {
    id: 'smash-drive',
    domainId: 'midcourt-defense',
    name: '接杀抽球',
    tier: 'advanced',
    contentStatus: 'draft',
    summary: '面对对方杀球，不只挡网，而是用反手或正手抽球把球顶回对方后场。',
    keyPoints: [
      '接杀时拍头保持在身前，判断球的高度后选择抽而不是挡。',
      '用前臂和手指短促发力，把球抽向对方后场空当，不要大幅引拍。',
      '抽完后快速回位，抽球线路要有目的，不能只是把球救过去。',
    ],
    commonErrors: [
      '引拍太大，杀球速度太快，拍子还没挥出球已经到了。',
      '只想着发力，拍面不稳，球直接出界或下网。',
    ],
    drills: [
      {
        name: '接杀抽后场',
        description: '搭档连续杀球到身体两侧，练习反手和正手抽到后场，记录成功次数。',
        prescription: '4 组 × 15 球',
      },
    ],
    prerequisites: [
      { skillId: 'backhand-drive', minLevel: 2 },
      { skillId: 'smash-block', minLevel: 2 },
    ],
    rubric: {
      1: ['能说出接杀抽球和挡网的选择区别。'],
      2: ['定点接杀抽球 10 次，至少 5 次过网并落到对方后场。'],
      3: ['连续接杀 15 次，至少 8 次能抽到后场，失误不超过 4 次。'],
      4: ['对抗中能根据杀球质量选择挡或抽，抽球后能回到防守位置。'],
    },
    tags: ['singles', 'doubles', 'defense', 'attack'],
    relatedSkillIds: ['backhand-drive', 'smash-block', 'attack-defense-transition'],
  },
  {
    id: 'defense-stance',
    domainId: 'midcourt-defense',
    name: '防守站位与重心',
    tier: 'foundation',
    contentStatus: 'draft',
    summary: '用更宽、更低的站位和正确的拍头高度，为接杀和两侧防守做好准备。',
    keyPoints: [
      '双脚比准备姿势更宽，膝盖弯曲，重心落在前脚掌。',
      '拍头放在胸前偏下，拍面朝前，方便向两侧挡或抽。',
      '根据对方杀球线路微调站位，不要站死在中线。',
    ],
    commonErrors: [
      '防守时站得太直，重心高，低平杀球到脚边来不及。',
      '拍头垂得太低，接杀只能向上挑，无法挡网。',
    ],
    drills: [
      {
        name: '防守姿势保持',
        description: '保持低重心防守姿势 30 秒，搭档随机指向左右，练习小步移动。',
        prescription: '4 组 × 30 秒',
      },
    ],
    prerequisites: [
      { skillId: 'ready-stance', minLevel: 2 },
      { skillId: 'split-step', minLevel: 2 },
    ],
    rubric: {
      1: ['能说出防守站位的宽度、重心和拍头高度。'],
      2: ['保持防守姿势 30 秒，膝盖不锁死，拍头在身前。'],
      3: ['多球防守中能保持低重心，左右移动后仍能稳定击球。'],
      4: ['对抗中能根据对方进攻线路调整防守站位，不轻易被追身。'],
    },
    tags: ['singles', 'doubles', 'defense'],
    relatedSkillIds: ['ready-stance', 'split-step', 'smash-block', 'side-defense'],
  },
  {
    id: 'defensive-lift',
    domainId: 'midcourt-defense',
    name: '被动挑球',
    tier: 'core',
    contentStatus: 'draft',
    summary: '在低点把对方的重杀或吊球挑到后场，争取回位时间，是防守的兜底。',
    keyPoints: [
      '先降低重心，拍头低于球，尽量在身体前方击球。',
      '用前臂和手腕向上送，拍面打开，把球挑得又高又深。',
      '挑球后立刻回中，不要停在原地看球飞。',
    ],
    commonErrors: [
      '身体没有降下去，只能伸手够球，挑球高度和深度都不够。',
      '击球点太靠后，挑球变成被动捞球，容易被对方连续进攻。',
    ],
    drills: [
      {
        name: '低点挑后场',
        description: '搭档连续杀球或放网，练习在低点挑到后场，每组 15 球。',
        prescription: '4 组 × 15 球',
      },
    ],
    prerequisites: [
      { skillId: 'lift', minLevel: 2 },
      { skillId: 'defense-stance', minLevel: 2 },
    ],
    rubric: {
      1: ['能说出被动挑球的击球点、拍面方向和目标深度。'],
      2: ['定点低点挑球 10 次，至少 6 次过网并落到后场。'],
      3: ['连续防守挑球 15 次，至少 10 次挑到对方后场，失误不超过 3 次。'],
      4: ['对抗中能在低点把球挑到底线，挑后及时回中继续防守。'],
    },
    tags: ['singles', 'doubles', 'defense'],
    relatedSkillIds: ['lift', 'defense-stance', 'backhand-clear'],
  },
];
