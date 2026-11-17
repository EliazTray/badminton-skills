import type { Skill } from '../schema';

export const tacticsSkills: Skill[] = [
  {
    id: 'four-corners',
    domainId: 'tactics',
    name: '四方球',
    tier: 'core',
    isAnchor: true,
    contentStatus: 'complete',
    summary: '用高远球和吊球把对手调到四个角，再用重复落点和突然变化寻找机会。',
    keyPoints: [
      '先用高远球压住对方后场，再用吊球或放网把对方拉到前场。',
      '击球后回中，观察对方移动方向，下一拍优先打相反方向或重复落点。',
      '四方球不是机械地打四个角，而是让对手每次都要移动，并等待他回出半场球。',
    ],
    commonErrors: [
      '只追求落点，不观察对手位置，球总是打到对方已经站好的地方。',
      '自己击球后不回中，被对手一拍反调动就失去位置。',
    ],
    drills: [
      {
        name: '四点调动',
        description: '和搭档半场对拉，规定每两拍必须改变一次落点区域，连续 20 拍。',
        prescription: '4 组 × 20 拍',
      },
      {
        name: '两角重复',
        description: '连续压对方后场两角，再突然吊网前，练习观察对方重心和回位。',
        prescription: '4 组 × 10 球',
      },
    ],
    prerequisites: [
      { skillId: 'forehand-clear', minLevel: 3 },
      { skillId: 'forehand-drop', minLevel: 2 },
      { skillId: 'net-shot', minLevel: 2 },
      { skillId: 'recovery-step', minLevel: 2 },
    ],
    rubric: {
      1: [
        '能说出四方球的目的和基本落点选择。',
        '能识别对方在场上的位置和空当。',
      ],
      2: [
        '固定球路练习中能把球分别打到对方四个区域，失误不超过 3 次。',
        '击球后能回到中心附近，准备下一拍。',
      ],
      3: [
        '半场对抗中连续 20 拍能主动改变落点至少 6 次，且自己回中不落后。',
        '能观察到对方被拉开后回出半场球，并用下一拍继续施压。',
      ],
      4: [
        '单打比赛中能有计划地调动对手，迫使对方出现半场球或失误。',
        '能根据对手移动习惯调整重复落点和变线节奏，不盲目打四点。',
      ],
    },
    tags: ['singles', 'doubles'],
    relatedSkillIds: ['forehand-clear', 'forehand-drop', 'net-shot', 'recovery-step', 'clear-drop-attack'],
  },
  {
    id: 'clear-drop-attack',
    domainId: 'tactics',
    name: '拉吊突击',
    tier: 'advanced',
    contentStatus: 'draft',
    summary: '先用高远球和吊球拉开对手，等对方回出半场球，再用杀球或点杀终结。',
    keyPoints: [
      '先用高远球把对手压到后场，再用吊球或劈吊让他上网。',
      '观察对方回球质量，出现半场高球时果断下压，不要犹豫。',
      '突击后立刻准备下一拍，杀球被挡回时要能连续进攻。',
    ],
    commonErrors: [
      '只会拉吊，不敢在机会出现时下压，回合拖长后被对方反击。',
      '一有高球就盲目重杀，不判断对方站位和球的质量。',
    ],
    drills: [
      {
        name: '拉吊后突击',
        description: '半场对练：两拍高远、一拍吊球，对方回半场球时必须杀或点杀。',
        prescription: '4 组 × 10 球',
      },
    ],
    prerequisites: [
      { skillId: 'four-corners', minLevel: 2 },
      { skillId: 'overhead-drop', minLevel: 2 },
      { skillId: 'smash', minLevel: 2 },
    ],
    rubric: {
      1: ['能说出拉吊突击的三个阶段和出手时机。'],
      2: ['固定球路中能完成高远、吊球、杀球的组合。'],
      3: ['半场对抗中能在 3 拍内制造一次有效下压，失误不超过 3 次。'],
      4: ['单打中能通过拉吊制造半场球，并在机会出现时用杀球或点杀得分。'],
    },
    tags: ['singles', 'attack'],
    relatedSkillIds: ['four-corners', 'overhead-drop', 'smash', 'point-smash'],
  },
  {
    id: 'control-net-attack',
    domainId: 'tactics',
    name: '控网抢攻',
    tier: 'advanced',
    contentStatus: 'draft',
    summary: '用放网、搓球和推球控制网前，迫使对方起高球，再用后场进攻终结。',
    keyPoints: [
      '网前出手要稳定，优先保证过网质量，不要一上来就追求贴网。',
      '对方回放网时果断扑或推，迫使对方起球；起高球后迅速后撤进攻。',
      '网前和后场之间要有连贯步法，不能控完网就站在原地。',
    ],
    commonErrors: [
      '放网过高，被对方直接扑杀，反而把进攻权送出去。',
      '网前得手后没有后撤，后场高球出现时无法形成进攻。',
    ],
    drills: [
      {
        name: '网前控后攻',
        description: '从网前放网开始，对方起高球后立刻后撤杀球，连续 10 个回合。',
        prescription: '4 组 × 10 回合',
      },
    ],
    prerequisites: [
      { skillId: 'net-push', minLevel: 2 },
      { skillId: 'net-kill', minLevel: 2 },
      { skillId: 'frontcourt-footwork', minLevel: 2 },
      { skillId: 'four-corners', minLevel: 2 },
    ],
    rubric: {
      1: ['能说出控网抢攻的网前目标和后场衔接时机。'],
      2: ['网前放网后能根据对方回球判断是否后撤。'],
      3: ['半场对抗中 10 个回合至少 6 次通过网前控制拿到进攻机会。'],
      4: ['单打或双打中能稳定控制网前，对方起球后形成有效进攻。'],
    },
    tags: ['singles', 'doubles', 'net', 'attack'],
    relatedSkillIds: ['four-corners', 'net-push', 'net-kill', 'frontcourt-footwork'],
  },
  {
    id: 'placement',
    domainId: 'tactics',
    name: '落点选择',
    tier: 'core',
    contentStatus: 'draft',
    summary: '根据对方站位和重心选择回球落点，让对手跑起来，而不是把球打到他手边。',
    keyPoints: [
      '击球前先扫一眼对方位置，优先选择空当或需要他变向的方向。',
      '高远球压两角，吊球和放网交替前后，避免连续打同一区域。',
      '关键分优先选择自己成功率高的落点，不要为了漂亮冒险。',
    ],
    commonErrors: [
      '低头看球，不看对手，回球总是送到对方站好的位置。',
      '为了追求贴边线导致出界，落点选择超出自己的能力。',
    ],
    drills: [
      {
        name: '看人回球',
        description: '搭档随机站在半场不同位置，练习根据他的站位选择相反方向，连续 20 球。',
        prescription: '4 组 × 20 球',
      },
    ],
    prerequisites: [
      { skillId: 'forehand-clear', minLevel: 2 },
      { skillId: 'net-shot', minLevel: 2 },
    ],
    rubric: {
      1: ['能说出落点选择要看对方位置，而不是只看球。'],
      2: ['固定喂球下能根据目标区域把球打到直线或斜线。'],
      3: ['20 球练习中至少 14 球打到对方不在的位置，出界不超过 3 次。'],
      4: ['比赛中能根据对方重心选择落点，关键分优先使用高成功率球路。'],
    },
    tags: ['singles', 'doubles'],
    relatedSkillIds: ['four-corners', 'rhythm-change', 'net-push'],
  },
  {
    id: 'rhythm-change',
    domainId: 'tactics',
    name: '节奏变化',
    tier: 'advanced',
    contentStatus: 'draft',
    summary: '通过快慢、轻重和出手时机的变化，让对手无法一直按自己的节奏击球。',
    keyPoints: [
      '在连续快抽或快拉中突然放慢，用吊球、放网或停顿打乱对方启动。',
      '准备动作保持一致，靠击球瞬间的速度和拍面变化制造节奏差。',
      '节奏变化要有目的，不要为了变化而增加自己的失误。',
    ],
    commonErrors: [
      '每个球都想做假动作，动作变形，失误率上升。',
      '节奏变化后自己也没有跟进，下一拍反而被动。',
    ],
    drills: [
      {
        name: '快慢交替',
        description: '连续高远球中每 3 拍插入一拍吊球或放网，观察搭档启动是否被打乱。',
        prescription: '4 组 × 15 球',
      },
    ],
    prerequisites: [
      { skillId: 'placement', minLevel: 2 },
      { skillId: 'overhead-drop', minLevel: 2 },
    ],
    rubric: {
      1: ['能说出节奏变化可以发生在哪些环节。'],
      2: ['固定球路中能完成快拉和轻吊的交替。'],
      3: ['15 球练习中至少 10 球能主动改变节奏，自身失误不超过 4 次。'],
      4: ['对抗中能用节奏变化迫使对方回出半场球，变化后仍能衔接下一拍。'],
    },
    tags: ['singles', 'doubles', 'attack', 'net'],
    relatedSkillIds: ['placement', 'overhead-drop', 'reverse-slice-drop'],
  },
  {
    id: 'error-management',
    domainId: 'tactics',
    name: '失误管理',
    tier: 'foundation',
    contentStatus: 'draft',
    summary: '知道什么时候该冒险、什么时候该把球打稳，减少无谓失误送分。',
    keyPoints: [
      '先区分主动失误和被动失误：主动失误要降低风险，被动失误要改善步法和击球点。',
      '关键分优先打高成功率球路，把边线目标放宽一点。',
      '失误后用一个固定动作重置：转身、深呼吸、看拍面，再准备下一分。',
    ],
    commonErrors: [
      '连续失误后急于用更难的球挽回，失误越滚越大。',
      '把所有失误都归因于手感，不记录是判断、步法还是技术问题。',
    ],
    drills: [
      {
        name: '风险分级对练',
        description: '设定比分，落后时只允许使用高成功率球路，练习关键分选择。',
        prescription: '3 局 × 11 分',
      },
    ],
    prerequisites: [{ skillId: 'ready-stance', minLevel: 2 }],
    rubric: {
      1: ['能区分主动失误和被动失误，并说出一种重置方法。'],
      2: ['练习赛中能在一分结束后执行固定的重置动作。'],
      3: ['11 分制练习中主动失误明显少于被动失误，关键分不连续送分。'],
      4: ['比赛中能根据比分和状态调整风险，失误后下一分仍能执行计划。'],
    },
    tags: ['singles', 'doubles'],
    relatedSkillIds: ['match-review', 'placement'],
  },
  {
    id: 'match-review',
    domainId: 'tactics',
    name: '比赛复盘',
    tier: 'foundation',
    contentStatus: 'draft',
    summary: '把比赛中的失分模式记下来，下一次训练才有明确的改进目标。',
    keyPoints: [
      '每场比赛只记录 2–3 个最明显的失分模式，不要试图复盘所有球。',
      '按发接发、步法、网前、后场、防守分类，找出重复出现的问题。',
      '把复盘结论转成下一次训练的一个具体练习，而不是停留在“要更稳定”。',
    ],
    commonErrors: [
      '只记得比分和几个精彩球，没有记录重复失分的方式。',
      '复盘结论太笼统，下一次训练没有可执行的练习。',
    ],
    drills: [
      {
        name: '三行复盘',
        description: '比赛后写三行：最常丢分的方式、最有效的得分方式、下次要练的一个技术。',
        prescription: '每场比赛后 3 分钟',
      },
    ],
    prerequisites: [{ skillId: 'error-management', minLevel: 2 }],
    rubric: {
      1: ['能说出复盘的目的，并记录一场比赛的三行总结。'],
      2: ['复盘能区分失分模式和技术环节，不只是写“失误多”。'],
      3: ['连续 3 场比赛的复盘能找出一个重复出现的问题，并安排对应练习。'],
      4: ['能根据复盘调整比赛战术，并在下一场比赛中验证改进效果。'],
    },
    tags: ['singles', 'doubles'],
    relatedSkillIds: ['error-management', 'four-corners'],
  },
  {
    id: 'rotation',
    domainId: 'tactics',
    name: '轮转',
    tier: 'advanced',
    contentStatus: 'draft',
    summary: '双打中根据球路从前后进攻转成左右防守，再转回进攻，不留下大空当。',
    keyPoints: [
      '起高球或挑球后，前场队员后退，后场队员上前，两人转成左右防守。',
      '得到下压机会后，击球者跟进前场，搭档补到后场，转回前后进攻。',
      '轮转时用简单口令或手势沟通，谁先动、谁补位要明确。',
    ],
    commonErrors: [
      '起高球后前场还站在原地，后场队员一个人防全场。',
      '两人同时向前或同时后退，轮转路线交叉，撞在一起。',
    ],
    drills: [
      {
        name: '攻防轮转循环',
        description: '从前后站位开始，后场起高球，两人转左右防守；挡网后前场跟进，再转回前后。',
        prescription: '4 组 × 10 个循环',
      },
    ],
    prerequisites: [
      { skillId: 'front-back-formation', minLevel: 2 },
      { skillId: 'side-defense', minLevel: 2 },
      { skillId: 'flat-drive', minLevel: 2 },
    ],
    rubric: {
      1: ['能说出前后进攻和左右防守之间的转换方向。'],
      2: ['无球时能和搭档完成一次攻防轮转。'],
      3: ['连续 10 个攻防转换，至少 7 次两人能到位，不出现明显空当。'],
      4: ['双打对抗中轮转自然，不因换位让球或撞拍，能连续保持阵型。'],
    },
    tags: ['doubles', 'attack', 'defense'],
    relatedSkillIds: ['front-back-formation', 'side-defense', 'attack-defense-transition'],
  },
];
