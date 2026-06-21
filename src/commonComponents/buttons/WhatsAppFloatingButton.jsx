import { FaWhatsapp } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function WhatsAppFloatingButton() {
  const whatsappUrl = 'https://wa.me/918347152224?text=Hello%20Zeelin%20Overseas%2C%20I%20need%20help%20with%20packaging%20sourcing.';

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noreferrer"
      aria-label="Contact us on WhatsApp"
      title="Contact us on WhatsApp"
      className="group fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-white p-2 pr-3 text-slate-950 shadow-xl shadow-slate-900/15 ring-1 ring-emerald-200/80 transition-colors hover:bg-emerald-50 dark:bg-slate-950 dark:text-white dark:ring-emerald-500/30 dark:hover:bg-slate-900 sm:bottom-7 sm:right-7"
      initial={{ opacity: 0, y: 14, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -3, scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
      <motion.span
        className="absolute inset-0 -z-10 rounded-full border border-emerald-400/50"
        animate={{ scale: [1, 1.45], opacity: [0.45, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
      />
      <motion.span
        className="absolute inset-0 -z-10 rounded-full border border-emerald-400/40"
        animate={{ scale: [1, 1.7], opacity: [0.28, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut', delay: 0.7 }}
      />
      <span className="relative flex h-11 w-11 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-emerald-500/30">
        <FaWhatsapp className="h-6 w-6" />
        <span className="absolute right-0.5 top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-200" />
      </span>
      <span className="hidden text-sm font-extrabold tracking-tight sm:block">
        WhatsApp
      </span>
    </motion.a>
  );
}
