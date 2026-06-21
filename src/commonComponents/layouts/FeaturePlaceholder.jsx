import { FiClock } from 'react-icons/fi';
import Card from '../cards/Card';
import { Reveal } from '../animations/ScrollReveal';

export default function FeaturePlaceholder({ title, description, icon: Icon = FiClock }) {
  return (
    <div className="flex flex-col gap-6 py-4">
      <div className="border-b border-border-default/40 pb-5">
        <span className="text-label-sm text-accent-gold">Planned workspace</span>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-text-primary">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm text-text-secondary">{description}</p>
      </div>

      <Reveal>
        <Card variant="glass" hover={false} className="relative overflow-hidden p-8 sm:p-12">
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-accent-gold/10 blur-3xl" />
          <div className="relative flex flex-col items-center justify-center py-10 text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-accent-gold/25 bg-accent-gold/10 text-accent-gold shadow-card">
              <Icon className="h-7 w-7" />
            </div>
            <h2 className="text-heading-lg text-text-primary">Visual foundation ready</h2>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-text-secondary">
              This screen has its production visual and motion treatment. Its business functionality remains intentionally pending and unchanged.
            </p>
            <span className="mt-6 rounded-full border border-accent-gold/30 bg-background-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-accent-gold-active">
              Logic integration pending
            </span>
          </div>
        </Card>
      </Reveal>
    </div>
  );
}
