import type { Skill } from '../schema';

export const footworkSkills: Skill[] = [
  {
    id: 'split-step',
    domainId: 'footwork',
    name: '启动步',
    tier: 'foundation',
    contentStatus: 'draft',
    summary: '在对方击球的一瞬间做一个小启动，把静止的身体变成可以朝任何方向移动的状态。',
    keyPoints: [
      '对方挥拍击球前，双脚轻微离地或做一个小垫步，落地时重心落在前脚掌。',
      '启动幅度不需要大，关键是和对方击球时机同步。',
      '落地后根据来球方向，用并步或交叉步迈出第一步。',
    ],
    commonErrors: [
      '双脚踩死等球，来球过网后才开始动，第一步总是慢。',
      '启动跳得太高，落地时反而失去平衡，下一拍跟不上。',
    ],
    drills: [
      {
        name: '听口令启动',
        description: '背对发令者，听到口令后做启动步并朝随机方向迈出第一步。',
        prescription: '4 组 × 20 秒',
      },
    ],
    prerequisites: [{ skillId: 'ready-stance', minLevel: 2 }],
    rubric: {
      1: ['能说出启动步的时机，并做出一次小启动。'],
      2: ['原地准备姿势下，听口令后 1 秒内完成启动和第一步。'],
      3: ['多球练习中连续 10 球在来球过网前启动，第一步方向正确。'],
      4: ['对抗中能根据对方击球动作提前启动，且不被假动作完全骗走重心。'],
    },
    tags: ['singles', 'doubles', 'defense'],
    relatedSkillIds: ['ready-stance', 'shuffle-step', 'recovery-step'],
  },
  {
    id: 'shuffle-step',
    domainId: 'footwork',
    name: '并步',
    tier: 'foundation',
    contentStatus: 'draft',
    summary: '用短距离并步调整位置，保持身体朝向和平衡，适合中场和网前的快速补位。',
    keyPoints: [
      '前脚先迈，后脚跟上，两脚保持约一个肩宽的距离。',
      '移动中膝盖保持微屈，身体不要上下起伏太大。',
      '最后一步要能把身体稳住，方便击球或继续移动。',
    ],
    commonErrors: [
      '两脚并在一起或交叉，导致下一拍无法快速变向。',
      '只动手臂不迈步，击球时身体离球太远。',
    ],
    drills: [
      {
        name: '左右并步触线',
        description: '在两条线之间来回并步，始终保持低重心，手摸到线后立刻返回。',
        prescription: '4 组 × 20 秒',
      },
    ],
    prerequisites: [{ skillId: 'split-step', minLevel: 2 }],
    rubric: {
      1: ['能做出向左右两侧的并步移动。'],
      2: ['左右并步 20 秒内保持低重心，脚步不交叉。'],
      3: ['多球中场两侧移动中，能用并步到位并稳定击球。'],
      4: ['对抗中能根据来球距离选择并步，不会因为碎步过多而失去位置。'],
    },
    tags: ['singles', 'doubles', 'defense'],
    relatedSkillIds: ['split-step', 'side-footwork', 'cross-step'],
  },
  {
    id: 'cross-step',
    domainId: 'footwork',
    name: '交叉步',
    tier: 'core',
    contentStatus: 'draft',
    summary: '用交叉步覆盖较长距离，是后退和两侧大范围移动的主要步法。',
    keyPoints: [
      '先转髋，再让后脚从身体后方交叉迈出，不要用交叉腿硬拧膝盖。',
      '交叉后迅速用小步或并步调整，让身体回到可击球的位置。',
      '移动过程中保持拍头抬起，眼睛盯球。',
    ],
    commonErrors: [
      '不转髋只靠腿交叉，膝盖和脚踝容易别扭，移动速度也慢。',
      '交叉步后没有调整步，击球时身体还在晃动。',
    ],
    drills: [
      {
        name: '后场交叉步回动',
        description: '从中心出发，交叉步到后场两点，做挥拍动作后回中。',
        prescription: '4 组 × 6 次',
      },
    ],
    prerequisites: [{ skillId: 'split-step', minLevel: 2 }],
    rubric: {
      1: ['能说出交叉步和并步的使用场景区别。'],
      2: ['无球状态下能向后场和两侧完成交叉步移动。'],
      3: ['后场两点交叉步移动中，5 次里至少 4 次能到位并完成挥拍。'],
      4: ['对抗中能根据来球深度选择交叉步，移动后仍能快速回中。'],
    },
    tags: ['singles', 'doubles', 'defense'],
    relatedSkillIds: ['split-step', 'rearcourt-footwork', 'frontcourt-footwork'],
  },
  {
    id: 'frontcourt-footwork',
    domainId: 'footwork',
    name: '上网步法',
    tier: 'core',
    isAnchor: true,
    contentStatus: 'complete',
    summary: '从中心启动到网前，用最后一大步跨出，让身体稳定地停在可以击球的位置。',
    keyPoints: [
      '启动后先做一到两步调整，最后一步用持拍手同侧脚大步跨出，形成弓步。',
      '跨出时膝盖朝脚尖方向，脚掌稳定落地，身体不要前扑到失去平衡。',
      '击球后用前腿蹬地回中，先起身再退，不要停在网前看球。',
    ],
    commonErrors: [
      '最后一步太小，只能伸手够球，击球点不稳且回中慢。',
      '整个人向前冲，重心压在脚尖上，击球后无法快速蹬回。',
    ],
    drills: [
      {
        name: '中心到网前弓步',
        description: '从中心启动，上网做放网动作，前腿蹬地回中；左右两条线路各做一次。',
        prescription: '4 组 × 8 次',
      },
      {
        name: '四点上网',
        description: '从中心出发，依次到正手网前和反手网前，完成击球动作后回中，保持低重心。',
        prescription: '3 组 × 20 秒',
      },
    ],
    prerequisites: [
      { skillId: 'split-step', minLevel: 2 },
      { skillId: 'cross-step', minLevel: 2 },
    ],
    rubric: {
      1: [
        '能说出上网步法的启动、跨步和回中顺序。',
        '无球时能做出一次完整的上网弓步。',
      ],
      2: [
        '从中心到网前 8 次，至少 6 次最后一步能稳定停住。',
        '击球后能主动用前腿蹬地回中，而不是停在原地。',
      ],
      3: [
        '多球正手/反手网前交替 10 球，至少 8 球到位且击球时身体稳定。',
        '上网后回中能在 2 步内完成，下一拍仍能启动。',
      ],
      4: [
        '单打对抗中能主动上网处理放网和挑球，连续 3 次上网不失去平衡。',
        '对方重复放网时，能用小调整步二次启动，而不是站死。',
      ],
    },
    tags: ['singles', 'doubles', 'net'],
    relatedSkillIds: ['split-step', 'cross-step', 'net-shot', 'recovery-step'],
  },
  {
    id: 'rearcourt-footwork',
    domainId: 'footwork',
    name: '后退步法',
    tier: 'core',
    contentStatus: 'draft',
    summary: '用侧身交叉步或并步后退，争取在球下落前到达后场击球位置。',
    keyPoints: [
      '看到对方出高球后先转髋侧身，再用交叉步或并步向后场移动。',
      '后退时保持拍头抬起，最后用小步调整到球的正下方或稍后方。',
      '击球后先回中再观察下一拍，不要一直后退到场地外。',
    ],
    commonErrors: [
      '正面对网倒退跑，速度慢且容易绊脚。',
      '后退太多，击球点跑到身体后面，只能用不上力的捞球。',
    ],
    drills: [
      {
        name: '后场两点后退',
        description: '从中心启动，后退到正手和头顶后场各做一次挥拍，再回中。',
        prescription: '4 组 × 8 次',
      },
    ],
    prerequisites: [
      { skillId: 'split-step', minLevel: 2 },
      { skillId: 'cross-step', minLevel: 2 },
    ],
    rubric: {
      1: ['能说出后退时为什么要先侧身。'],
      2: ['无球状态下能侧身交叉步后退到后场两点。'],
      3: ['多球后场两点 10 次，至少 7 次能在球下落前到位。'],
      4: ['对抗中能根据来球深度调整后退步幅，击球后快速回中。'],
    },
    tags: ['singles', 'doubles', 'rear'],
    relatedSkillIds: ['split-step', 'cross-step', 'forehand-clear', 'recovery-step'],
  },
  {
    id: 'side-footwork',
    domainId: 'footwork',
    name: '两侧移动',
    tier: 'core',
    contentStatus: 'draft',
    summary: '用并步或交叉步覆盖左右两侧，保持身体稳定，尤其用于防守和接杀。',
    keyPoints: [
      '启动后先用靠近来球方向的脚迈出，另一脚跟上，避免两脚交叉打结。',
      '移动时保持低重心，拍头在身前，不要边跑边把拍子垂下去。',
      '到位后用一小步制动，击球时身体不要继续向边线漂移。',
    ],
    commonErrors: [
      '大步跨过去却没有制动，击球时身体还在移动，球容易出边线。',
      '两侧移动时站得太直，接杀时来不及降低重心。',
    ],
    drills: [
      {
        name: '左右两点接杀步法',
        description: '从中心启动到左右两侧做防守动作，回到中心，保持低重心。',
        prescription: '4 组 × 20 秒',
      },
    ],
    prerequisites: [
      { skillId: 'split-step', minLevel: 2 },
      { skillId: 'shuffle-step', minLevel: 2 },
    ],
    rubric: {
      1: ['能说出两侧移动时的低重心和制动要点。'],
      2: ['无球左右移动 20 秒，脚步不交叉，能稳定停住。'],
      3: ['多球左右两侧 10 次，至少 7 次到位后能在身体稳定时击球。'],
      4: ['对抗中能接住对方的两边拉开，击球后回到中间位置。'],
    },
    tags: ['singles', 'doubles', 'defense'],
    relatedSkillIds: ['shuffle-step', 'defense-stance', 'smash-block'],
  },
  {
    id: 'recovery-step',
    domainId: 'footwork',
    name: '回中',
    tier: 'core',
    contentStatus: 'draft',
    summary: '每次击球后回到能覆盖下一拍的位置，是单打和双打连续性的关键。',
    keyPoints: [
      '击球后先用蹬地或小并步回到中心附近，不必每一步都回到同一个点。',
      '回中时保持低重心和拍头抬起，眼睛继续看对方。',
      '如果对方已经回球，优先准备下一拍，不要为了回中而错过启动。',
    ],
    commonErrors: [
      '击球后站着看球，下一拍才想起来回中。',
      '每次都机械回到场地正中心，忽略对方球路和自己上一拍的位置。',
    ],
    drills: [
      {
        name: '四点回中',
        description: '依次到四个角做击球动作，每次回中后立即启动下一拍。',
        prescription: '3 组 × 30 秒',
      },
    ],
    prerequisites: [
      { skillId: 'frontcourt-footwork', minLevel: 2 },
      { skillId: 'rearcourt-footwork', minLevel: 2 },
      { skillId: 'side-footwork', minLevel: 2 },
    ],
    rubric: {
      1: ['能说出回中的目的和基本时机。'],
      2: ['无球四点练习中，每次击球后能回到中心附近。'],
      3: ['多球四点连续 12 拍，至少 9 拍击球后能及时回中并启动。'],
      4: ['对抗中能根据球路选择回中位置，连续多拍不因站位失衡失分。'],
    },
    tags: ['singles', 'doubles', 'defense'],
    relatedSkillIds: ['frontcourt-footwork', 'rearcourt-footwork', 'side-footwork'],
  },
  {
    id: 'defensive-footwork',
    domainId: 'footwork',
    name: '被动步法',
    tier: 'advanced',
    contentStatus: 'draft',
    summary: '在被对方压到后场或拉开到边线时，用低重心的小步和跨步把球救回来。',
    keyPoints: [
      '先降低重心，用短步调整到球附近，不要最后一刻才大步跨。',
      '够不到球时用弓步或交叉步延长距离，同时保持身体平衡。',
      '击球后先稳住重心再回中，避免救完球直接摔倒或失去下一拍。',
    ],
    commonErrors: [
      '被动时还站着打，够不到球就只伸手，导致回球质量很低。',
      '救球后急于起身，重心还没稳就启动下一拍。',
    ],
    drills: [
      {
        name: '低重心救球',
        description: '从中心连续处理左右两侧的低平球，要求每次击球后能站起来回中。',
        prescription: '4 组 × 20 秒',
      },
    ],
    prerequisites: [
      { skillId: 'recovery-step', minLevel: 2 },
      { skillId: 'side-footwork', minLevel: 2 },
    ],
    rubric: {
      1: ['能说出被动时降低重心和延长步幅的原则。'],
      2: ['无球状态下能从中心低重心跨到两侧并回到中心。'],
      3: ['多球被动两侧 10 次，至少 6 次能把球回到对方场地并回中。'],
      4: ['对抗中被拉开时能救回大部分球，救球后不失去平衡。'],
    },
    tags: ['singles', 'doubles', 'defense'],
    relatedSkillIds: ['recovery-step', 'backhand-clear', 'defensive-lift'],
  },
];
