import type { Skill } from '../schema';

export const basicsSkills: Skill[] = [
  {
    id: 'forehand-grip',
    domainId: 'basics',
    name: '正手握拍',
    tier: 'foundation',
    isAnchor: true,
    contentStatus: 'complete',
    summary: '正手握拍是绝大多数正手击球和发力的起点。',
    keyPoints: [
      '虎口对准拍框侧棱，拇指与食指形成 V 字，握在拍柄前段。',
      '掌心与拍柄留一点空隙，手指自然包住，击球瞬间再收紧。',
      '准备时保持放松，靠转体、前臂旋转和手指发力，而不是一直死握。',
    ],
    commonErrors: [
      '整只手攥死，前臂僵硬，导致挥拍慢、手腕无法顺畅发力。',
      '握得太靠拍柄末端，击球时拍面容易晃，控制变差。',
    ],
    drills: [
      {
        name: '徒手握拍检查',
        description: '看着拍柄确认虎口、V 字和拍柄前段位置，闭眼再握一次，检查是否一致。',
        prescription: '每天 30 秒',
      },
      {
        name: '原地正手挥拍',
        description: '只做架拍、转体、挥拍和随挥，击球瞬间收紧手指，结束立刻放松。',
        prescription: '3 组 × 15 次',
      },
    ],
    prerequisites: [],
    rubric: {
      1: [
        '能指出虎口、V 字和拍柄前段的位置。',
        '无球时能在 10 秒内正确握住球拍。',
      ],
      2: [
        '原地正手挥拍 15 次，握拍位置基本不变。',
        '击球瞬间能主动收紧手指，随挥后恢复放松。',
      ],
      3: [
        '多球正手高远或平抽练习中连续 20 拍不调整握拍。',
        '出现握拍滑动时能自己发现，并在下一拍前纠正。',
      ],
      4: [
        '对抗中正手杀、吊、抽之间切换时握拍稳定。',
        '不需要有意识看拍柄也能完成正手握拍。',
      ],
    },
    tags: ['singles', 'doubles', 'attack'],
    relatedSkillIds: ['backhand-grip', 'grip-transition', 'contact-and-power'],
  },
  {
    id: 'backhand-grip',
    domainId: 'basics',
    name: '反手握拍',
    tier: 'foundation',
    contentStatus: 'draft',
    summary: '反手握拍让拇指成为发力和控制的支点，是反手网前、反手抽球和反手后场的基础。',
    keyPoints: [
      '拇指顶在拍柄较宽的一面，四指自然包住，不要整只手死攥。',
      '拍面略朝上，手腕保持中立，准备时留出转动空间。',
      '反手击球靠拇指顶压、前臂外旋和手指收紧，而不是只靠手腕甩。',
    ],
    commonErrors: [
      '拇指没有顶住拍柄，击球时拍面发飘，方向控制不稳。',
      '握拍过紧导致手腕僵硬，反手球只能靠手臂硬推。',
    ],
    drills: [
      {
        name: '反手拇指顶压',
        description: '无球状态下做反手推拍，感受拇指顶压和手指收紧，不甩手腕。',
        prescription: '3 组 × 15 次',
      },
    ],
    prerequisites: [],
    rubric: {
      1: ['能说出拇指的位置，并做一次无球反手挥拍。'],
      2: ['定点反手挑球或抽球 10 次，拍面方向基本稳定。'],
      3: ['连续反手抽挡 15 拍，拇指支撑明显，击球不飘。'],
      4: ['对抗中反手网前和反手抽球能稳定使用，失误后可调整。'],
    },
    tags: ['singles', 'doubles', 'defense'],
    relatedSkillIds: ['forehand-grip', 'grip-transition', 'backhand-net', 'backhand-drive'],
  },
  {
    id: 'grip-transition',
    domainId: 'basics',
    name: '握拍转换',
    tier: 'core',
    contentStatus: 'draft',
    summary: '在正手与反手之间快速切换，是连续多拍和网前变化的关键。',
    keyPoints: [
      '转换时用非持拍手扶住拍柄，让持拍手可以松开再调整。',
      '换握幅度尽量小，依靠手指和拍柄在掌心中的转动完成。',
      '在来球之前完成转换，击球时才不会一边跑一边找拍面。',
    ],
    commonErrors: [
      '只在原地练挥拍，来球一快就来不及换握。',
      '换握时整只手离开拍柄，导致拍头下垂、下一拍启动变慢。',
    ],
    drills: [
      {
        name: '正反手交替颠球',
        description: '用正手、反手交替颠球，每次击球前完成换握，保持拍头稳定。',
        prescription: '3 组 × 30 秒',
      },
    ],
    prerequisites: [
      { skillId: 'forehand-grip', minLevel: 2 },
      { skillId: 'backhand-grip', minLevel: 2 },
    ],
    rubric: {
      1: ['能说出握拍转换的步骤，并慢速完成正手到反手换握。'],
      2: ['原地正反手交替击球 20 次，换握后拍面方向正确。'],
      3: ['移动中连续正反手击球 15 拍，换握不拖慢下一拍。'],
      4: ['对抗中在网前和后场连续转换握拍，能保持击球质量。'],
    },
    tags: ['singles', 'doubles', 'attack', 'defense'],
    relatedSkillIds: ['forehand-grip', 'backhand-grip', 'contact-and-power'],
  },
  {
    id: 'ready-stance',
    domainId: 'basics',
    name: '准备姿势与架拍',
    tier: 'foundation',
    contentStatus: 'draft',
    summary: '准备姿势决定你能不能提前启动，架拍决定你能不能在正确的位置击球。',
    keyPoints: [
      '双脚略宽于肩，膝盖微屈，重心落在前脚掌，脚跟不要完全踩死。',
      '持拍手在身前，拍头略高于手腕，非持拍手自然指向来球方向。',
      '保持身体放松，眼睛看对方击球，准备用启动步进入移动。',
    ],
    commonErrors: [
      '站得太直、重心落在后跟，启动时第一步慢半拍。',
      '拍头垂在身体一侧，来球到身前才开始抬拍。',
    ],
    drills: [
      {
        name: '准备姿势影子练习',
        description: '对镜或录像检查膝盖、重心和拍头高度，听到口令后做启动步。',
        prescription: '4 组 × 20 秒',
      },
    ],
    prerequisites: [],
    rubric: {
      1: ['能说出准备姿势的三个关键点，并保持 20 秒。'],
      2: ['原地准备姿势下，能在一拍内完成启动步和架拍。'],
      3: ['多球练习中连续 10 球提前架拍，击球点不因准备不足而后退。'],
      4: ['对抗中每次对方击球前都能恢复准备姿势，下一拍启动及时。'],
    },
    tags: ['singles', 'doubles', 'defense'],
    relatedSkillIds: ['split-step', 'forehand-grip', 'contact-and-power'],
  },
  {
    id: 'contact-and-power',
    domainId: 'basics',
    name: '击球点与发力链',
    tier: 'core',
    contentStatus: 'draft',
    summary: '把蹬地、转体、肩肘和手指串成一条发力链，比单纯甩手臂更稳定也更省力。',
    keyPoints: [
      '击球点尽量在身体前上方，给自己留出击球和随挥空间。',
      '发力从蹬地开始，经转髋、转肩、肘部伸展到手指收紧，不要只靠手腕。',
      '击球前放松，击球瞬间集中收紧，随挥方向指向目标区域。',
    ],
    commonErrors: [
      '击球点落在身体后方，只能向上捞球，无法把力量送出去。',
      '全程手臂僵硬、手腕乱甩，球速看起来快但方向不稳。',
    ],
    drills: [
      {
        name: '无球发力链分解',
        description: '按蹬地、转髋、转肩、挥拍、随挥的顺序慢速分解，再做连贯挥拍。',
        prescription: '3 组 × 10 次',
      },
    ],
    prerequisites: [
      { skillId: 'ready-stance', minLevel: 2 },
      { skillId: 'forehand-grip', minLevel: 2 },
    ],
    rubric: {
      1: ['能按顺序说出蹬地、转体、挥拍和随挥。'],
      2: ['无球正手挥拍时能做出转体带动手臂，而不是只甩手腕。'],
      3: ['多球高远球 10 次中至少 7 次在身前上方击球，身体有转体。'],
      4: ['对抗中能在移动后找到合理击球点，发力后仍能快速回中。'],
    },
    tags: ['singles', 'doubles', 'attack'],
    relatedSkillIds: ['forehand-grip', 'forehand-clear', 'smash'],
  },
];
