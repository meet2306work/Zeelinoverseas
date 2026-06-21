import { FiTrendingUp, FiAnchor, FiBriefcase, FiShield, FiGlobe, FiUsers } from 'react-icons/fi';
import Card from '../../commonComponents/cards/Card';

export default function AboutScreen() {
  const stats = [
    { label: 'Cleared Cargo (Tons)', value: '4.8M+', icon: FiAnchor },
    { label: 'Global Trade Partners', value: '1,200+', icon: FiUsers },
    { label: 'Active Countries', value: '54+', icon: FiGlobe },
    { label: 'Customs Agents', value: '85+', icon: FiBriefcase },
  ];

  const values = [
    {
      title: 'Global Connectivity',
      desc: 'Seamlessly routing sea freight, air cargo, and intermodal inland supply chains across borders.',
      icon: FiGlobe,
    },
    {
      title: 'Regulated Compliance',
      desc: 'Ensuring absolute regulatory clearance with full ISO standards, certified HS Codes, and custom broker clearances.',
      icon: FiShield,
    },
    {
      title: 'Precision Execution',
      desc: 'Leveraging real-time milestones tracking and custom B2B CRM workflows to eliminate delivery friction.',
      icon: FiTrendingUp,
    },
  ];

  return (
    <div className="flex flex-col gap-12 py-4 animate-fade-in-up">
      {/* Hero Headline Section */}
      <section className="text-center md:text-left border-b border-border-default/40 pb-6">
        <h1 className="text-display-md font-extrabold text-text-primary tracking-tight mb-2">
          About Zeelinoverseas
        </h1>
        <p className="text-body-md text-text-secondary max-w-2xl">
          Leading B2B import-export logistics and enterprise e-commerce systems. Mapped to bridge intermodal shipping pipelines with customized digital contract processing.
        </p>
      </section>

      {/* Visual Stats Row */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card key={idx} variant="glass" className="p-6 border-border-default/50">
              <div className="flex items-center gap-4">
                <div className="rounded-xl p-3 bg-accent-gold/15 text-accent-gold">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-extrabold text-text-primary leading-none mb-1">
                    {stat.value}
                  </h3>
                  <p className="text-xs text-text-secondary font-semibold uppercase tracking-wider">
                    {stat.label}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </section>

      {/* Corporate Strategy block */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-background-surface p-8 rounded-3xl border border-border-default/35">
        <div className="flex flex-col gap-4">
          <span className="text-label-sm text-accent-gold tracking-widest font-bold">
            Corporate Statement
          </span>
          <h2 className="text-2xl font-extrabold text-text-primary tracking-tight leading-snug">
            Streamlining Global Commerce with Intelligent Workflows
          </h2>
          <p className="text-body-md text-text-secondary leading-relaxed">
            Zeelinoverseas drives end-to-end import and export operations. From custom manufacturing tooling specs and raw material sourcing to sea-port shipping manifests, our network ensures verified, on-time contract fulfillment.
          </p>
        </div>
        <div className="relative aspect-video rounded-2xl overflow-hidden bg-black-accent border border-border-default/20 flex items-center justify-center p-6 text-center">
          <div className="absolute inset-0 bg-cover bg-center opacity-40" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&q=80')` }} />
          <div className="absolute inset-0 bg-gradient-to-t from-black-accent via-black-accent/80 to-black-accent/40" />
          <div className="relative flex flex-col gap-2 z-10">
            <FiShield className="h-10 w-10 text-accent-gold mx-auto" />
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">SGS Audit Verified</h4>
            <p className="text-[11px] text-slate-300 max-w-xs leading-relaxed font-medium">
              Consistently audited trade practices ensuring full compliance with international maritime logistics security guidelines.
            </p>
          </div>
        </div>
      </section>

      {/* Core Values grid */}
      <section className="flex flex-col gap-6">
        <h3 className="text-xs font-bold text-text-secondary uppercase tracking-widest text-center md:text-left">
          Our Core Operations Pillars
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {values.map((v, idx) => {
            const Icon = v.icon;
            return (
              <Card key={idx} variant="default" className="p-6 flex flex-col gap-3 border border-border-default/45">
                <div className="h-10 w-10 rounded-xl bg-background-primary text-text-primary flex items-center justify-center">
                  <Icon className="h-5.5 w-5.5 text-accent-gold" />
                </div>
                <h4 className="text-base font-bold text-text-primary">
                  {v.title}
                </h4>
                <p className="text-xs text-text-secondary leading-relaxed">
                  {v.desc}
                </p>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
