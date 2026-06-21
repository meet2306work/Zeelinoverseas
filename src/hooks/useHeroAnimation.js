import { useEffect } from 'react';

export default function useHeroAnimation(heroRef) {
  useEffect(() => {
    const root = heroRef.current;
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    let context;
    let cancelled = false;

    const setupAnimation = async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ]);
      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);
      context = gsap.context(() => {
        const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
        timeline
          .from('[data-hero-item]', { autoAlpha: 0, y: 24, duration: 0.65, stagger: 0.09 })
          .from('[data-hero-board]', { autoAlpha: 0, x: 32, duration: 0.75 }, '-=0.48');

        if (window.matchMedia('(min-width: 1024px)').matches) {
          gsap.to('[data-hero-board]', {
            yPercent: -8,
            ease: 'none',
            scrollTrigger: {
              trigger: root,
              start: 'top top+=80',
              end: 'bottom top',
              scrub: 0.6,
            },
          });

          gsap.to('[data-hero-item]', {
            yPercent: 10,
            ease: 'none',
            scrollTrigger: {
              trigger: root,
              start: 'top top',
              end: 'bottom top',
              scrub: 0.5,
            },
          });
        }
      }, root);
    };

    setupAnimation();
    return () => {
      cancelled = true;
      context?.revert();
    };
  }, [heroRef]);
}
