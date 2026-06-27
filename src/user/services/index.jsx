import { Link, useLocation } from 'react-router-dom';
import { 
  FiShield, 
  FiSearch, 
  FiLayers, 
  FiArrowRight, 
  FiTruck, 
  FiCheckCircle 
} from 'react-icons/fi';
import Card from '../../commonComponents/cards/Card';

export default function ServicesScreen() {
  const location = useLocation();
  const isPortal = location.pathname.startsWith('/user');
  const services = [
    {
      id: 'custom-packaging',
      title: 'Custom Packaging & Design',
      description: 'Tailored dimensions, custom board grade selection, and premium color printing optimization. Design custom box layouts aligned with your brand dimensions.',
      icon: FiLayers,
      badge: 'Design & Tooling',
      features: ['Multi-ply material options', 'Custom brand printing layout', 'Durable structural prototypes'],
    },
    {
      id: 'express-delivery',
      title: 'Doorstep Courier Delivery',
      description: 'Reliable parcel delivery and bulk logistics networks. Partnered with leading couriers (FedEx, DHL, UPS) to provide fast door-to-door transit with live status updates.',
      icon: FiTruck,
      badge: 'Fast Shipping',
      features: ['Real-time courier tracking', 'Standard & Express options', 'Safe bulk pallet logistics'],
    },
    {
      id: 'volume-discounts',
      title: 'Wholesale & Volume Discounts',
      description: 'Scale your operations seamlessly. Order custom batches starting from minor minimum order quantities (MOQ) up to high-volume manufacturing runs at optimized pricing.',
      icon: FiSearch,
      badge: 'Bulk Sourcing',
      features: ['Tier-based discount brackets', 'Flexible production scaling', 'Quality batch inspection'],
    },
    {
      id: 'online-payment',
      title: 'Frictionless RFQ & Transactions',
      description: 'Request custom pricing proposals within 24 hours. Place purchase orders, execute secure bank wire transfers, and track order fulfillment directly inside the portal.',
      icon: FiShield,
      badge: 'Secure Billing',
      features: ['Automated RFQ builder', 'Pre-approved P.O. terms', 'Transparent invoice generation'],
    },
  ];

  return (
    <div className="flex flex-col gap-12 py-4 animate-fade-in-up">
      {/* Header section */}
      <section className="text-center md:text-left border-b border-brand-border/40 dark:border-slate-800/40 pb-6">
        <span className="text-label-sm text-secondary dark:text-accent tracking-widest font-bold">
          Enterprise Solutions
        </span>
        <h1 className="text-display-md font-extrabold text-slate-900 dark:text-white tracking-tight mt-1 mb-2">
          Premium Packaging &amp; Shipping Services
        </h1>
        <p className="text-body-md text-slate-500 dark:text-slate-400 max-w-2xl">
          End-to-end custom design packaging, wholesale batch production, and door-to-door courier tracking designed to guarantee seamless business fulfillment.
        </p>
      </section>

      {/* Services Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {services.map((service) => {
          const Icon = service.icon;
          return (
            <Card 
              key={service.id} 
              variant="glass" 
              className="p-8 flex flex-col justify-between hover:-translate-y-1 transition-all duration-300 border-slate-200/40 dark:border-slate-800/40 group"
            >
              <div className="flex flex-col gap-5">
                <div className="flex items-center justify-between">
                  <div className="h-12 w-12 rounded-2xl bg-secondary/10 dark:bg-accent/10 text-secondary dark:text-accent flex items-center justify-center transition-colors duration-300">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-[10px] font-bold tracking-wider uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-350 px-2.5 py-1 rounded-full">
                    {service.badge}
                  </span>
                </div>
                
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-secondary dark:group-hover:text-accent transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800/60 pt-4 mt-1">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Key Service Capabilities</h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {service.features.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-450">
                        <FiCheckCircle className="h-3.5 w-3.5 text-secondary dark:text-accent flex-shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/60 flex justify-end">
                <Link 
                  to={isPortal ? "/user/rfq" : "/rfq"} 
                  className="flex items-center gap-1.5 text-xs font-bold text-secondary dark:text-accent hover:gap-2.5 transition-all"
                  id={`btn-inquire-${service.id}`}
                >
                  <span>Inquire for Quote</span>
                  <FiArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </Card>
          );
        })}
      </section>

      {/* Custom Trade Banner */}
      <section className="bg-slate-900 dark:bg-slate-900/60 rounded-3xl p-8 border border-slate-800 text-center flex flex-col items-center gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none -translate-x-1/2 translate-y-1/2" />
        
        <h2 className="text-xl font-bold text-white tracking-tight relative z-10">
          Need Custom Branded Packaging Boxes?
        </h2>
        <p className="text-xs text-slate-400 max-w-lg leading-relaxed relative z-10">
          Submit a custom RFQ detailing your packaging measurements, quantities, and delivery location. Our sales team will compile a custom quote within 24 hours.
        </p>
        <Link 
          to={isPortal ? "/user/rfq" : "/rfq"} 
          className="inline-flex items-center justify-center px-5 py-2.5 bg-secondary text-white font-bold text-xs rounded-xl shadow-lg shadow-secondary/25 hover:bg-secondary/90 transition-all z-10"
          id="btn-services-cta"
        >
          Create Multi-Item RFQ
        </Link>
      </section>
    </div>
  );
}
