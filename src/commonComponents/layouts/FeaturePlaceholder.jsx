import { FiClock } from 'react-icons/fi';
import Card from '../cards/Card';
import { Reveal } from '../animations/ScrollReveal';

export default function FeaturePlaceholder({ title, description, icon: Icon = FiClock }) {
  return (
    <div className="flex flex-col gap-6 py-4">
      <div className="border-b border-brand-border/40 pb-5 dark:border-slate-800/40">
        <span className="text-label-sm text-secondary dark:text-cyan-300">Planned workspace</span>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-950 dark:text-white">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-500 dark:text-slate-400">{description}</p>
      </div>

      <Reveal>
        <Card variant="glass" hover={false} className="relative overflow-hidden p-8 sm:p-12">
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-secondary/10 blur-3xl" />
          <div className="relative flex flex-col items-center justify-center py-10 text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-200/60 bg-blue-50 text-secondary shadow-card dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-cyan-300">
              <Icon className="h-7 w-7" />
            </div>
            <h2 className="text-heading-lg text-slate-950 dark:text-white">Visual foundation ready</h2>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              This screen has its production visual and motion treatment. Its business functionality remains intentionally pending and unchanged.
            </p>
            <span className="mt-6 rounded-full border border-amber-200 bg-brand-accent-soft px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-accent-hover dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300">
              Logic integration pending
            </span>
          </div>
        </Card>
      </Reveal>
    </div>
  );
}
