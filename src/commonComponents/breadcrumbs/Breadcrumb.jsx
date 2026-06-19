import { FiChevronRight, FiHome } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export default function Breadcrumb({
  items = [], // [{ label: 'Home', link: '/' }, { label: 'Products' }]
  className = '',
  homeLink = '/',
}) {
  return (
    <nav className={`flex items-center text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium ${className}`} aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2">
        <li className="inline-flex items-center">
          <Link
            to={homeLink}
            className="inline-flex items-center gap-1.5 text-slate-500 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
          >
            <FiHome className="h-4 w-4" />
            <span className="hidden sm:inline">Home</span>
          </Link>
        </li>
        
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={idx} className="flex items-center">
              <FiChevronRight className="h-4 w-4 mx-1 text-slate-400 dark:text-slate-600" />
              {isLast || !item.link ? (
                <span className="text-slate-800 dark:text-white font-semibold truncate max-w-[120px] sm:max-w-xs">
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.link}
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors truncate max-w-[120px] sm:max-w-xs"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
