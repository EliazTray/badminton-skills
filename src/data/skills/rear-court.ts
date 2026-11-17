import type { Skill } from '../schema';

export const rearCourtSkills: Skill[] = [
  {
    id: 'forehand-clear',
    domainId: 'rear-court',
    name: '正手高远球',
    tier: 'core',
    isAnchor: true,
    contentStatus: 'complete',
    summary: '用高弧线把球送到对方后场，既是防守摆脱，也是单打拉开对手的基础。',
    keyPoints: [
      '侧身架拍，非持拍手指向来球，肘部抬高，拍头保持在身后。',
      '击球点在右肩前上方，转体带动肩肘，前臂旋转和手指收紧完成鞭打。',
      '随挥到身体左前方，击球后立刻回中，准备下一拍。',
    ],
    commonErrors: [
      '击球点落在身体后方或太低，球只能往上捞，打不到底线。',
      '只用手臂抡拍，没有转体和前臂旋转，球速慢且肩膀容易累。',
    ],
    drills: [
      {
        name: '两点高远球',
        description: '从中心移动到底线两角，各打一个高远球，要求球落到对方后场三分之一区域。',
        prescription: '4 组 × 10 球',
      },
      {
        name: '连续高远球',
        description: '和搭档连续对拉高远球，目标先稳定 10 拍，再追求落点深度。',
        prescription: '3 组 × 10 拍',
      },
    ],
    prerequisites: [
      { skillId: 'forehand-grip', minLevel: 2 },
      { skillId: 'contact-and-power', minLevel: 2 },
      { skillId: 'rearcourt-footwork', minLevel: 2 },
    ],
    rubric: {
      1: [
        '能说出架拍、转体、击球点和随挥方向。',
        '无球时能完成一次完整的正手高远球挥拍。',
      ],
      2: [
        '定点喂球 10 次，至少 7 次在身前上方击球，球能过网。',
        '击球后能完成随挥，而不是击完就停住。',
      ],
      3: [
        '后场两点移动中连续 10 球，至少 8 球到达对方后场区域。',
        '连续对拉高远球 10 拍，不出现因击球点过低而直接下网。',
      ],
      4: [
        '单打对抗中被动时能用高远球摆脱，连续 3 拍不失误。',
        '能把球控制到底线两角，并根据对手站位调整深度。',
      ],
    },
    tags: ['singles', 'doubles', 'rear'],
    relatedSkillIds: ['contact-and-power', 'rearcourt-footwork', 'overhead-clear', 'four-corners'],
  },
  {
    id: 'overhead-clear',
    domainId: 'rear-court',
    name: '头顶高远球',
    tier: 'core',
    contentStatus: 'draft',
    summary: '用正手握拍在头顶上方处理反手区的后场球，减少被压反手时的被动。',
    keyPoints: [
      '先侧身并让球落到头顶偏左的位置，肘部抬高，身体略向后展。',
      '击球点保持在头顶前上方，转体带动手臂向前上方挥出。',
      '随挥后迅速回中，不要因为身体后仰而停在原地。',
    ],
    commonErrors: [
      '身体正对网后退，击球点跑到头顶后方，发不出力。',
      '为了够球把手臂伸直硬打，肩膀和肘部容易受伤。',
    ],
    drills: [
      {
        name: '头顶区两点',
        description: '从中心后退到头顶区，连续打高远球，要求球落到底线附近。',
        prescription: '4 组 × 10 球',
      },
    ],
    prerequisites: [
      { skillId: 'forehand-clear', minLevel: 2 },
      { skillId: 'rearcourt-footwork', minLevel: 2 },
    ],
    rubric: {
      1: ['能说出头顶击球和正手高远球的位置区别。'],
      2: ['定点头顶喂球 10 次，至少 7 次能过网。'],
      3: ['后场头顶区移动中 10 球，至少 8 球打到对方后场。'],
      4: ['单打中能用头顶高远球处理被压反手的球，不被迫频繁使用反手。'],
    },
    tags: ['singles', 'doubles', 'rear'],
    relatedSkillIds: ['forehand-clear', 'overhead-drop', 'backhand-clear'],
  },
  {
    id: 'forehand-drop',
    domainId: 'rear-court',
    name: '正手吊球',
    tier: 'core',
    contentStatus: 'draft',
    summary: '用和高远球相似的准备动作，把球轻吊到对方网前，迫使对手上前。',
    keyPoints: [
      '架拍和高远球保持一致，让对方看不出你要吊球。',
      '击球时减速并切拍，让球刚过网就下落，落点靠近前发球线。',
      '吊球后立刻准备下一拍，质量高的吊球往往能换来对方起高球。',
    ],
    commonErrors: [
      '提前把拍头放低，动作明显，对方很容易判断。',
      '击球太用力，球飞过网后还在上升，变成半场高球。',
    ],
    drills: [
      {
        name: '高吊一致动作',
        description: '同一准备动作交替打高远和吊球，搭档在对面判断球路，连续 20 球。',
        prescription: '4 组 × 20 球',
      },
    ],
    prerequisites: [{ skillId: 'forehand-clear', minLevel: 2 }],
    rubric: {
      1: ['能说出吊球和高远球的动作相似点与击球区别。'],
      2: ['定点吊球 10 次，至少 6 个过网并落在前场。'],
      3: ['高吊交替 15 球，至少 10 个吊球落点在前场区域，动作不明显变形。'],
      4: ['单打中能用吊球调动对手上前，吊球后能连续衔接下一拍。'],
    },
    tags: ['singles', 'doubles', 'rear', 'net'],
    relatedSkillIds: ['forehand-clear', 'overhead-drop', 'sliced-drop'],
  },
  {
    id: 'overhead-drop',
    domainId: 'rear-court',
    name: '头顶吊球',
    tier: 'core',
    contentStatus: 'draft',
    summary: '在头顶位置用和高远球相似的准备动作，把球轻吊到对方网前。',
    keyPoints: [
      '先移动到头顶球后方，保持和高远球一样的架拍高度。',
      '击球瞬间减速切拍，拍面朝向网前目标，不要向下猛压。',
      '落地后回中，注意对方可能回放网前。',
    ],
    commonErrors: [
      '身体没有侧开，吊球时只能用手臂够，落点控制不稳。',
      '切拍过多，球直接下网或过网高度太低。',
    ],
    drills: [
      {
        name: '头顶高吊交替',
        description: '头顶区同一动作交替打高远和吊球，观察对方判断是否被影响。',
        prescription: '4 组 × 15 球',
      },
    ],
    prerequisites: [
      { skillId: 'overhead-clear', minLevel: 2 },
      { skillId: 'forehand-drop', minLevel: 2 },
    ],
    rubric: {
      1: ['能说出头顶吊球和高远球的共同准备动作。'],
      2: ['定点头顶吊球 10 次，至少 6 个过网并落在前场。'],
      3: ['头顶区高吊交替 15 球，至少 10 个吊球落点稳定在前场。'],
      4: ['对抗中能用头顶吊球打破对方后场站位，吊球后能衔接上网。'],
    },
    tags: ['singles', 'doubles', 'rear', 'net'],
    relatedSkillIds: ['overhead-clear', 'forehand-drop', 'reverse-slice-drop'],
  },
  {
    id: 'reverse-slice-drop',
    domainId: 'rear-court',
    name: '滑板吊球',
    parentSkillId: 'forehand-drop',
    role: 'specialized',
    tier: 'advanced',
    contentStatus: 'draft',
    summary: '用拍面从外向内滑切球托，打出带有欺骗性的斜线吊球。',
    keyPoints: [
      '准备动作保持高远球姿势，手腕和拍面在击球前不要提前暴露方向。',
      '击球时拍面从球的外侧滑过，让球改变方向飞向对角网前。',
      '控制切拍力度，球过网即下坠，不要因为切得太薄而不过网。',
    ],
    commonErrors: [
      '切拍动作太大太慢，对方一眼看出是滑板。',
      '只用手腕切球，拍面角度不稳定，落点忽长忽短。',
    ],
    drills: [
      {
        name: '滑板落点',
        description: '定点喂球，连续做滑板吊对角，要求球落在对角前场区域。',
        prescription: '4 组 × 12 球',
      },
    ],
    prerequisites: [
      { skillId: 'overhead-drop', minLevel: 2 },
      { skillId: 'grip-transition', minLevel: 2 },
    ],
    rubric: {
      1: ['能说出滑板吊球的拍面方向和击球感觉。'],
      2: ['定点滑板吊球 10 次，至少 5 次过网并落在对角前场。'],
      3: ['连续 15 个滑板吊球，至少 9 个落点稳定，动作不明显变形。'],
      4: ['对抗中能和高远球共用准备动作，用滑板吊球有效调动对手。'],
    },
    tags: ['singles', 'doubles', 'rear', 'net'],
    relatedSkillIds: ['overhead-drop', 'sliced-drop', 'grip-transition'],
  },
  {
    id: 'sliced-drop',
    domainId: 'rear-court',
    name: '劈吊',
    parentSkillId: 'forehand-drop',
    role: 'specialized',
    tier: 'advanced',
    contentStatus: 'draft',
    summary: '用较快的切击把球压向对方网前，弧线比普通吊球更平、更快。',
    keyPoints: [
      '准备动作像高远球或杀球，击球瞬间拍面斜切球托。',
      '球过网后快速下坠，落点可以更靠近边线，增加对手移动距离。',
      '击球后立刻准备下一拍，劈吊质量高时对方常会回放网前。',
    ],
    commonErrors: [
      '切得太薄，球速慢且不过网。',
      '为了追求速度把球切到场外，落点控制不稳。',
    ],
    drills: [
      {
        name: '劈吊直线与斜线',
        description: '定点喂球，交替劈吊直线和斜线，记录落入前场目标区的次数。',
        prescription: '4 组 × 12 球',
      },
    ],
    prerequisites: [
      { skillId: 'forehand-drop', minLevel: 2 },
      { skillId: 'grip-transition', minLevel: 2 },
    ],
    rubric: {
      1: ['能说出劈吊和普通吊球的弧线区别。'],
      2: ['定点劈吊 10 次，至少 5 次过网并落在前场。'],
      3: ['连续劈吊 15 次，至少 9 次落点稳定且过网高度低。'],
      4: ['对抗中能用劈吊直线和斜线调动对手，失误率可控。'],
    },
    tags: ['singles', 'doubles', 'attack', 'net'],
    relatedSkillIds: ['forehand-drop', 'reverse-slice-drop', 'smash'],
  },
  {
    id: 'smash',
    domainId: 'rear-court',
    name: '重杀',
    tier: 'core',
    contentStatus: 'draft',
    summary: '在最高点击球，用全身发力把球向下压到对方场地，是最直接的进攻手段。',
    keyPoints: [
      '先侧身架拍，肘部抬高，击球点在身体前上方，尽量在最高点接触球。',
      '发力顺序是蹬地、转体、收腹、前臂旋转和手指收紧，不是单纯抡手臂。',
      '击球后随挥到身体左下方，并立刻回中，防止对方挡网反击。',
    ],
    commonErrors: [
      '击球点太低或太靠后，球压不下去，杀球变成半场球。',
      '只用手臂发力，腰腹没有参与，球速慢且容易肩痛。',
    ],
    drills: [
      {
        name: '定点杀球',
        description: '中场喂高球，杀向对方两个边线，每组 10 球，记录下网和出界数。',
        prescription: '4 组 × 10 球',
      },
    ],
    prerequisites: [
      { skillId: 'forehand-clear', minLevel: 2 },
      { skillId: 'contact-and-power', minLevel: 3 },
    ],
    rubric: {
      1: ['能说出杀球的击球点、发力顺序和随挥方向。'],
      2: ['定点杀球 10 次，至少 6 次过网并落在对方场区。'],
      3: ['连续杀球 15 次，至少 10 次有向下的球速，失误不超过 3 次。'],
      4: ['对抗中能抓住高球主动杀球，杀后能回中并衔接下一拍。'],
    },
    tags: ['singles', 'doubles', 'attack', 'rear'],
    relatedSkillIds: ['forehand-clear', 'contact-and-power', 'point-smash', 'clear-drop-attack'],
  },
  {
    id: 'point-smash',
    domainId: 'rear-court',
    name: '点杀',
    parentSkillId: 'smash',
    role: 'specialized',
    tier: 'advanced',
    contentStatus: 'draft',
    summary: '用短促的鞭打和手腕发力打出落点尖、准备快的杀球，不一定追求绝对重。',
    keyPoints: [
      '架拍到位后减少大幅引拍，用前臂旋转和手指收紧快速击球。',
      '击球点要高，拍面快速向前下方压，落点优先找边线和中路空当。',
      '点杀后立刻准备封网或下一拍，不要停在原地欣赏。',
    ],
    commonErrors: [
      '引拍过大，失去点杀突然性，变成慢速重杀。',
      '只甩手腕不转前臂，球速不足且容易手腕不适。',
    ],
    drills: [
      {
        name: '点杀两点',
        description: '中场喂球，快速点杀直线和斜线，每组 12 球，要求准备动作小。',
        prescription: '4 组 × 12 球',
      },
    ],
    prerequisites: [
      { skillId: 'smash', minLevel: 2 },
      { skillId: 'overhead-clear', minLevel: 2 },
    ],
    rubric: {
      1: ['能说出点杀和重杀在引拍、发力上的区别。'],
      2: ['定点点杀 10 次，至少 6 次过网并有明显向下角度。'],
      3: ['连续点杀 15 次，至少 9 次落点集中且动作突然。'],
      4: ['对抗中能突然点杀空当，杀后衔接下一拍不脱节。'],
    },
    tags: ['singles', 'doubles', 'attack', 'rear'],
    relatedSkillIds: ['smash', 'overhead-clear', 'front-court-coordination'],
  },
  {
    id: 'backhand-clear',
    domainId: 'rear-court',
    name: '反手高远球',
    tier: 'advanced',
    contentStatus: 'draft',
    summary: '在反手后场用反手握拍把球回到对方后场，是摆脱反手区被动的兜底技术。',
    keyPoints: [
      '先转身背对网，移动到球的左后方，肘部抬高，拍头引到身体左侧。',
      '用拇指顶压和前臂外旋把球向上送，击球点在身体左前上方。',
      '击球后转身回中，不要背对网停留。',
    ],
    commonErrors: [
      '只用手腕甩，球打不到底线，还容易伤手腕。',
      '身体没有转到位，击球点跑到身后，只能勉强碰到球。',
    ],
    drills: [
      {
        name: '反手后场定点',
        description: '让搭档发反手后场球，练习转身、顶肘和反手高远，目标落到底线。',
        prescription: '4 组 × 10 球',
      },
    ],
    prerequisites: [
      { skillId: 'backhand-grip', minLevel: 3 },
      { skillId: 'rearcourt-footwork', minLevel: 3 },
      { skillId: 'defensive-footwork', minLevel: 2 },
    ],
    rubric: {
      1: ['能说出反手高远球的转身方向、击球点和拇指发力。'],
      2: ['定点反手后场 10 次，至少 5 次能过网。'],
      3: ['反手后场移动中 10 球，至少 6 球回到对方后场区域。'],
      4: ['单打中被压反手时能用反手高远稳定过渡，避免直接失分。'],
    },
    tags: ['singles', 'doubles', 'defense', 'rear'],
    relatedSkillIds: ['backhand-grip', 'rearcourt-footwork', 'defensive-footwork'],
  },
];
