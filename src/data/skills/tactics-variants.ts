import { defineVariant } from './variant';

export const tacticsVariants = [
  defineVariant({
    id: 'rotation-attack',
    domainId: 'tactics',
    name: '进攻轮转',
    parentSkillId: 'rotation',
    tier: 'advanced',
    termStatus: 'needs-review',
    summary: '从防守或相持中获得下压机会后，两人转成前后进攻站位。',
    keyPoints: [
      '谁下压谁跟进前场，搭档补到后场，形成前后站位。',
      '前场举拍封直线，后场准备下一拍进攻。',
      '轮转时用口令或手势明确谁先动。',
    ],
    errors: ['下压后两人都向前，后场空出。', '前场后退抢球，导致站位重叠。'],
    drills: [{ name: '挡网转进攻', description: '防守挡网后，击球者跟进前场，搭档补后场，连续 10 个回合。', prescription: '4 组 × 10 回合' }],
    rubric: {
      1: ['能说出获得下压机会后的轮转方向。', '无球时能和搭档完成一次转进攻。'],
      2: ['挡网后 8 次，至少 5 次能形成前后站位。', '两人不抢同一球。'],
      3: ['连续 10 个回合，至少 7 次转进攻后保持阵型。', '前场能封住直线。'],
      4: ['比赛中能根据回球质量自然转进攻，形成连续下压。', '轮转后不出现明显空当。'],
    },
    tags: ['doubles', 'attack'],
    relatedSkillIds: ['rotation', 'rotation-defense', 'front-back-formation'],
  }),
  defineVariant({
    id: 'rotation-defense',
    domainId: 'tactics',
    name: '防守轮转',
    parentSkillId: 'rotation',
    tier: 'advanced',
    termStatus: 'needs-review',
    summary: '起高球或挑球后，两人从前后进攻转成左右防守，覆盖对方下压。',
    keyPoints: [
      '前场队员先退，后场队员上前，两人左右分开。',
      '各自优先防直线，斜线由同伴补位。',
      '防守起球后继续保持左右站位，不轻易前压。',
    ],
    errors: ['起高球后前场不回退，后场一个人防全场。', '两人同时后退，撞在一起。'],
    drills: [{ name: '挑球转防守', description: '前场挑球后两人转左右防守，接对方杀球，连续 10 个回合。', prescription: '4 组 × 10 回合' }],
    rubric: {
      1: ['能说出起高球后的防守轮转方向。', '无球时能和搭档完成一次转防守。'],
      2: ['挑球后 8 次，至少 5 次能形成左右防守。', '两人不重叠、不撞拍。'],
      3: ['连续 10 个回合，至少 7 次转防守后能挡回对方进攻。', '防守覆盖直线和斜线。'],
      4: ['比赛中能根据起球质量自然转防守，并寻找反攻机会。', '转换后阵型保持稳定。'],
    },
    tags: ['doubles', 'defense'],
    relatedSkillIds: ['rotation', 'rotation-attack', 'side-defense'],
  }),
];
