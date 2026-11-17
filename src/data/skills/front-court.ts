import type { Skill } from '../schema';

export const frontCourtSkills: Skill[] = [
  {
    id: 'net-shot',
    domainId: 'front-court',
    name: '放网',
    tier: 'foundation',
    isAnchor: true,
    contentStatus: 'complete',
    summary: '用柔和的手指控制把球轻放到对方网前，让球贴网下落，是网前技术的地基。',
    keyPoints: [
      '上网最后一步跨稳，拍头先到位，击球点尽量在网带高度附近。',
      '握拍放松，用手指轻轻托送球托，不要用手臂大幅挥拍。',
      '击球后拍头顺势向上送一点，然后立刻准备封网或后退。',
    ],
    commonErrors: [
      '握拍太紧、动作太大，球弹得太高，被对方扑杀。',
      '最后一步不够大，身体离网太远，只能伸手够球，放网质量不稳。',
    ],
    drills: [
      {
        name: '定点放网',
        description: '搭档在网对面抛球，连续放网到对方前场，要求球过网即下坠。',
        prescription: '4 组 × 15 球',
      },
      {
        name: '上网放网回中',
        description: '从中心启动上网放网，击球后回中，再重复，保持低重心。',
        prescription: '4 组 × 10 次',
      },
    ],
    prerequisites: [
      { skillId: 'frontcourt-footwork', minLevel: 2 },
      { skillId: 'ready-stance', minLevel: 2 },
    ],
    rubric: {
      1: [
        '能说出放网的击球点、握拍力度和随挥方向。',
        '无球时能做出上网放网的动作。',
      ],
      2: [
        '定点放网 10 次，至少 7 个过网并落在前场。',
        '击球时手臂动作小，主要用手指控制，不把球弹高。',
      ],
      3: [
        '上网放网 15 次，至少 11 个贴网下落且落在前场目标区域。',
        '放网后能立刻回中或举拍封网，不站在原地。',
      ],
      4: [
        '单打或双打对抗中能主动放网，连续 3 次不出现下网或过高。',
        '能根据对方站位选择放直线或斜线，控制对手上网方向。',
      ],
    },
    tags: ['singles', 'doubles', 'net'],
    relatedSkillIds: ['frontcourt-footwork', 'net-spin', 'net-push', 'net-kill'],
  },
  {
    id: 'net-spin',
    domainId: 'front-court',
    name: '搓球',
    tier: 'core',
    contentStatus: 'draft',
    summary: '用拍面摩擦球托底部，让球过网后快速翻滚下坠，增加对方回球难度。',
    keyPoints: [
      '拍头高于手腕，拍面略向上，用拍面斜切球托底部。',
      '击球时手腕和手指快速而短促地摩擦，动作要小。',
      '目标是球过网即下坠，落点越靠近网带越好。',
    ],
    commonErrors: [
      '击球点太低，只能向上挑，球过网后还会上升。',
      '动作太大，变成推球或挑球，没有搓球的旋转效果。',
    ],
    drills: [
      {
        name: '搓球贴网',
        description: '搭档连续抛球，练习搓球，要求球过网后下坠，记录贴网次数。',
        prescription: '4 组 × 15 球',
      },
    ],
    prerequisites: [{ skillId: 'net-shot', minLevel: 2 }],
    rubric: {
      1: ['能说出搓球的拍面角度和摩擦方向。'],
      2: ['定点搓球 10 次，至少 6 个过网并落在前场。'],
      3: ['连续搓球 15 次，至少 10 个过网后明显下坠，落点集中。'],
      4: ['对抗中能用搓球限制对方回放，并为下一拍创造机会。'],
    },
    tags: ['singles', 'doubles', 'net'],
    relatedSkillIds: ['net-shot', 'cross-net', 'net-cover'],
  },
  {
    id: 'net-push',
    domainId: 'front-court',
    name: '推球',
    tier: 'core',
    contentStatus: 'draft',
    summary: '在网前用较平的弧线把球推到对方后场，迫使对方后退。',
    keyPoints: [
      '拍头抬高，击球点在网带上方，拍面朝前而不是朝上。',
      '用小臂和手指向前推送，动作短促，球贴着网带过。',
      '优先推对方后场两个角，推完立刻准备下一拍。',
    ],
    commonErrors: [
      '拍面太开，球被挑高，失去推球的平快优势。',
      '推球动作太大，球过网太高，被对方中场拦截。',
    ],
    drills: [
      {
        name: '网前推两角',
        description: '搭档连续放网，练习推直线和斜线到后场，每组 15 球。',
        prescription: '4 组 × 15 球',
      },
    ],
    prerequisites: [{ skillId: 'net-shot', minLevel: 2 }],
    rubric: {
      1: ['能说出推球的拍面方向和目标落点。'],
      2: ['定点推球 10 次，至少 7 个过网并落到对方后场。'],
      3: ['连续推球 15 次，至少 11 个弧线平、落点深，不出现半场球。'],
      4: ['对抗中能用推球把对方调离网前，推后能继续保持主动。'],
    },
    tags: ['singles', 'doubles', 'net', 'attack'],
    relatedSkillIds: ['net-shot', 'net-cover', 'flat-drive'],
  },
  {
    id: 'cross-net',
    domainId: 'front-court',
    name: '勾对角',
    tier: 'advanced',
    contentStatus: 'draft',
    summary: '在网前用拍面变化把球勾到对角网前，让对手从一边跑到另一边。',
    keyPoints: [
      '准备动作和放网、推球尽量一致，击球前不暴露对角线意图。',
      '拍面在击球瞬间转向对角，用手指控制方向和过网高度。',
      '球要贴网过，落点靠近对角前发球线，勾完立刻回中。',
    ],
    commonErrors: [
      '引拍过大，动作路线明显，对手提前移动。',
      '拍面转得太多，球直接出边线或下网。',
    ],
    drills: [
      {
        name: '勾对角目标',
        description: '在网前定点练习直线放网和勾对角，交替进行，记录落入对角区域的次数。',
        prescription: '4 组 × 15 球',
      },
    ],
    prerequisites: [
      { skillId: 'net-shot', minLevel: 2 },
      { skillId: 'net-spin', minLevel: 2 },
    ],
    rubric: {
      1: ['能说出勾对角的拍面变化和落点目标。'],
      2: ['定点勾对角 10 次，至少 5 个过网并落在对角前场。'],
      3: ['连续勾对角 15 次，至少 9 个落点稳定且过网高度低。'],
      4: ['对抗中能用勾对角打破对方直线站位，动作隐蔽且失误可控。'],
    },
    tags: ['singles', 'doubles', 'net'],
    relatedSkillIds: ['net-shot', 'net-spin', 'frontcourt-footwork'],
  },
  {
    id: 'net-kill',
    domainId: 'front-court',
    name: '扑球',
    tier: 'core',
    contentStatus: 'draft',
    summary: '当对方回球高于网带时，向前下压，直接把球扑到对方场地。',
    keyPoints: [
      '看到高球先向前一步，拍头保持高于网带，击球点尽量在网前上方。',
      '用前臂旋转和手指快速下压，动作短促，不要大幅引拍。',
      '击球时控制拍面，避免拍头触网或过网。',
    ],
    commonErrors: [
      '引拍太大，错过最高点，球已经下落才开始扑。',
      '过于兴奋向前冲，拍头触网犯规或身体失去平衡。',
    ],
    drills: [
      {
        name: '网前扑球',
        description: '搭档在网前连续抛高球，练习向前扑压，要求不触网、球向下。',
        prescription: '4 组 × 15 球',
      },
    ],
    prerequisites: [
      { skillId: 'net-shot', minLevel: 2 },
      { skillId: 'frontcourt-footwork', minLevel: 2 },
    ],
    rubric: {
      1: ['能说出扑球的击球时机和拍面方向。'],
      2: ['定点扑球 10 次，至少 6 次过网并落在对方场区。'],
      3: ['连续扑球 15 次，至少 10 次有明显向下角度，且不触网。'],
      4: ['双打或单打中能抓住对方高球扑杀，扑后保持平衡和下一拍准备。'],
    },
    tags: ['singles', 'doubles', 'net', 'attack'],
    relatedSkillIds: ['net-shot', 'net-cover', 'front-court-coordination'],
  },
  {
    id: 'lift',
    domainId: 'front-court',
    name: '挑球',
    tier: 'core',
    contentStatus: 'draft',
    summary: '在网前把低球挑到对方后场，是防守和重新拉开对手的基本手段。',
    keyPoints: [
      '上网后拍头低于球，击球点尽量在身体前下方。',
      '用前臂和手腕向上送，随挥到肩上，球要高且深。',
      '挑球后立刻回中，准备对方的下压。',
    ],
    commonErrors: [
      '只用手腕向上挑，球不够深，落在中场被对方杀。',
      '挑球后停在网前，对方快速回球时来不及退防。',
    ],
    drills: [
      {
        name: '挑球到底线',
        description: '搭档连续放网，练习挑球到对方后场两角，要求球高且深。',
        prescription: '4 组 × 15 球',
      },
    ],
    prerequisites: [
      { skillId: 'net-shot', minLevel: 2 },
      { skillId: 'contact-and-power', minLevel: 2 },
    ],
    rubric: {
      1: ['能说出挑球的击球点、随挥方向和目标深度。'],
      2: ['定点挑球 10 次，至少 7 个过网并落到对方后场。'],
      3: ['连续挑球 15 次，至少 11 个高且深，不出现半场球。'],
      4: ['对抗中能在网前被动时挑到底线，挑后及时回中防守。'],
    },
    tags: ['singles', 'doubles', 'defense', 'net'],
    relatedSkillIds: ['net-shot', 'defensive-lift', 'recovery-step'],
  },
  {
    id: 'backhand-net',
    domainId: 'front-court',
    name: '反手网前球',
    tier: 'core',
    contentStatus: 'draft',
    summary: '用反手握拍处理网前左侧来球，包括反手放网、挑球和推球。',
    keyPoints: [
      '反手握拍，拇指顶住拍柄，拍头先伸向来球，身体保持低重心。',
      '击球时用手指和手腕控制拍面，放网要轻，挑球要送得高而深。',
      '根据来球高度选择放、推或挑，不要在网前只能被动挑高。',
    ],
    commonErrors: [
      '握拍太紧，反手网前只能弹高，无法控制落点。',
      '身体没有跟上网，只伸手臂，击球点太远且不稳定。',
    ],
    drills: [
      {
        name: '反手网前三点',
        description: '搭档连续喂反手网前球，交替做放网、推球和挑球，每组 15 球。',
        prescription: '4 组 × 15 球',
      },
    ],
    prerequisites: [
      { skillId: 'backhand-grip', minLevel: 2 },
      { skillId: 'net-shot', minLevel: 2 },
    ],
    rubric: {
      1: ['能说出反手网前球的握拍和拍面控制。'],
      2: ['定点反手放网 10 次，至少 6 个过网并落在前场。'],
      3: ['反手网前放、推、挑各 10 次，至少 7 次达到预期落点。'],
      4: ['对抗中能稳定处理反手网前球，并根据对方站位选择放、推或挑。'],
    },
    tags: ['singles', 'doubles', 'net', 'defense'],
    relatedSkillIds: ['backhand-grip', 'net-shot', 'backhand-low-serve'],
  },
  {
    id: 'net-cover',
    domainId: 'front-court',
    name: '封网',
    tier: 'advanced',
    contentStatus: 'draft',
    summary: '在双打前场举拍封住对方回球线路，用短促的拦截把进攻延续下去。',
    keyPoints: [
      '站在前发球线附近，拍头高于网带，膝盖微屈，准备向两侧启动。',
      '看到对方回球方向后先用小步移动，拍面迎球，不要大幅挥拍。',
      '封网后保持举拍，不要因为一次击球就站直或后退。',
    ],
    commonErrors: [
      '拍头垂在身侧，对方推球时来不及举拍。',
      '封网时挥拍太大，球打在拍框上或下网。',
    ],
    drills: [
      {
        name: '前场封网反应',
        description: '搭档在后场连续杀球或吊球，前场练习封直线和斜线，保持拍头高度。',
        prescription: '4 组 × 20 秒',
      },
    ],
    prerequisites: [
      { skillId: 'net-kill', minLevel: 2 },
      { skillId: 'ready-stance', minLevel: 2 },
    ],
    rubric: {
      1: ['能说出封网的站位、拍头高度和移动方式。'],
      2: ['无球状态下能在前场保持举拍并左右移动 20 秒。'],
      3: ['多球封网 15 次，至少 10 次能拦截到球并回向对方场区。'],
      4: ['双打对抗中能封住对方直线回球，封网后继续保持前场压迫。'],
    },
    tags: ['doubles', 'net', 'attack'],
    relatedSkillIds: ['net-kill', 'front-back-formation', 'front-court-coordination'],
  },
];
