import type { DomainId } from './schema';

export interface Domain {
  id: DomainId;
  name: string;
  shortName: string;
  description: string;
  order: number;
}

export const DOMAINS: Domain[] = [
  {
    id: 'basics',
    name: '基础与握拍',
    shortName: '基础',
    description: '握拍、架拍、击球点与发力链，是所有技术的地基。',
    order: 1,
  },
  {
    id: 'footwork',
    name: '步法',
    shortName: '步法',
    description: '启动、移动、到位和回中；决定你能不能舒服地打出下一拍。',
    order: 2,
  },
  {
    id: 'serve-receive',
    name: '发球与接发',
    shortName: '发接发',
    description: '每一分的起点。稳定、低失误，才有后面的主动。',
    order: 3,
  },
  {
    id: 'rear-court',
    name: '后场技术',
    shortName: '后场',
    description: '高远、吊球、杀球和反手过渡，处理对方的后场来球。',
    order: 4,
  },
  {
    id: 'front-court',
    name: '网前技术',
    shortName: '网前',
    description: '放、搓、推、勾、扑、挑，控制网前就能控制节奏。',
    order: 5,
  },
  {
    id: 'midcourt-defense',
    name: '中场与防守',
    shortName: '中场防守',
    description: '平抽挡、接杀和防守站位，把对方的进攻变成反攻机会。',
    order: 6,
  },
  {
    id: 'doubles',
    name: '双打基础',
    shortName: '双打',
    description: '站位、轮转、补位与封网配合，双打不是两个人的单打。',
    order: 7,
  },
  {
    id: 'tactics',
    name: '战术与比赛',
    shortName: '战术',
    description: '把技术组合成球路，把训练中的东西带进比赛。',
    order: 8,
  },
];

export const DOMAIN_BY_ID = new Map(DOMAINS.map((domain) => [domain.id, domain]));

export function getDomain(domainId: DomainId): Domain {
  const domain = DOMAIN_BY_ID.get(domainId);
  if (!domain) {
    throw new Error(`Unknown domain: ${domainId}`);
  }
  return domain;
}
