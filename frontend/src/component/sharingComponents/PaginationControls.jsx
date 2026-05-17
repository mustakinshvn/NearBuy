import { ChevronLeft, ChevronRight } from 'lucide-react';

const PaginationControls = ({ page, totalPages, onPageChange, scrollToTop = true }) => {
  if (!totalPages || totalPages <= 1) {
    return null;
  }

  const safePage = Math.min(Math.max(page || 1, 1), totalPages);

  const pages = [];
  const start = Math.max(1, safePage - 1);
  const end = Math.min(totalPages, safePage + 1);

  const handlePageChange = (nextPage) => {
    if (scrollToTop && typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    onPageChange(nextPage);
  };

  if (start > 1) {
    pages.push(1);
    if (start > 2) {
      pages.push('ellipsis-start');
    }
  }

  for (let current = start; current <= end; current += 1) {
    pages.push(current);
  }

  if (end < totalPages) {
    if (end < totalPages - 1) {
      pages.push('ellipsis-end');
    }
    pages.push(totalPages);
  }

  return (
    <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <button
        type="button"
        onClick={() => handlePageChange(Math.max(1, safePage - 1))}
        disabled={safePage <= 1}
        className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </button>

      <div className="flex flex-wrap items-center gap-2">
        {pages.map((entry) => {
          if (typeof entry === 'string') {
            return (
              <span key={entry} className="px-2 text-sm text-slate-400">
                ...
              </span>
            );
          }

          const isActive = entry === safePage;
          return (
            <button
              key={entry}
              type="button"
              onClick={() => handlePageChange(entry)}
              className={`min-w-10 cursor-pointer rounded-xl px-3 py-2 text-sm font-semibold transition ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'border border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:text-blue-700'
              }`}
            >
              {entry}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => handlePageChange(Math.min(totalPages, safePage + 1))}
        disabled={safePage >= totalPages}
        className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition disabled:cursor-not-allowed disabled:opacity-40"
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
};

export default PaginationControls;