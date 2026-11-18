import { Link } from 'react-router-dom';
import { ArrowRight, ClipboardList, Milestone } from 'lucide-react';
import { BASE_SKILLS, VARIANT_SKILLS } from '../../data';
import { buttonClassName } from '../../components/ui/buttonStyles';

export function LogPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header>
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-court">Training log</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">训练记录</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
          记录每一次训练，才能知道哪些技能真的练过、哪些已经开始生疏。当前版本先把手动技能评估和云同步跑通，完整训练表单会在下一阶段接入。
        </p>
      </header>

      <section className="app-card p-6 md:p-8">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-court-soft text-court">
          <ClipboardList className="h-6 w-6" />
        </span>
        <h2 className="mt-5 text-lg font-bold tracking-tight">先把图谱的起点标出来</h2>
        <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
          当前先解决「我在哪」的问题：浏览 {BASE_SKILLS.length} 个主技术、{VARIANT_SKILLS.length} 个细分，查看前置关系，并按标准评估等级。训练记录、成功率和视频链接会在下一阶段加入。
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link to="/map" className={buttonClassName('primary')}>
            去技能图谱
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/" className={buttonClassName('secondary')}>
            回到概览
          </Link>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-3">
        {[
          {
            icon: Milestone,
            title: '记录什么',
            body: '日期、类型、时长、练到的技能、成功率和备注。',
          },
          {
            icon: ClipboardList,
            title: '自动派生什么',
            body: '最近练习时间、待复习技能、本周训练量和领域进度。',
          },
          {
            icon: ArrowRight,
            title: '怎么影响建议',
            body: '长期未练的技能进入复习槽位，训练频率会参与下一步推荐。',
          },
        ].map(({ icon: Icon, title, body }) => (
          <div key={title} className="app-card p-4">
            <Icon className="h-4 w-4 text-court" />
            <h3 className="mt-3 text-sm font-bold">{title}</h3>
            <p className="mt-1 text-xs leading-5 text-muted">{body}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
