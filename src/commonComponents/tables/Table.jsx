export default function Table({
  columns = [], // [{ key: 'id', label: 'ID', render: (val) => {} }]
  data = [],
  isLoading = false,
  emptyMessage = 'No data available',
  className = '',
}) {
  return (
    <div className={`w-full overflow-hidden rounded-xl border border-border-default/70 bg-background-surface shadow-premium ${className}`}>
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border-default/70 bg-background-primary/80">
              {columns.map((col, idx) => (
                <th
                  key={col.key || idx}
                  className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider select-none"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          
          <tbody className="divide-y divide-border-default/45">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center">
                  <div className="flex justify-center items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-accent-gold" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span className="text-sm text-text-secondary">Loading records...</span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-16 text-center text-sm text-text-secondary">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, rowIdx) => (
                <tr
                  key={row.id || rowIdx}
                  className="hover:bg-accent-gold/8 transition-colors"
                >
                  {columns.map((col, colIdx) => (
                    <td
                      key={col.key || colIdx}
                      className="px-6 py-4 text-sm text-text-primary"
                    >
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
