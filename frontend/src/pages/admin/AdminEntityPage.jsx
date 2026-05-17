import { useEffect, useMemo, useState } from 'react';
import PaginationControls from '../../component/sharingComponents/PaginationControls';

const AdminEntityPage = ({ title, description, loadItems, deleteItem, columns, idKey = 'id', emptyMessage = 'No records found.', itemsKey = 'items' }) => {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshIndex, setRefreshIndex] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(null);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const result = await loadItems({ page, limit: pageSize || undefined });
        if (!active) return;

        if (Array.isArray(result)) {
          setItems(result);
          setPagination(null);
          return;
        }

        setItems(Array.isArray(result?.[itemsKey]) ? result[itemsKey] : []);
        setPagination(result?.pagination || null);
      } catch (err) {
        if (active) setError(err.message || 'Unable to load records.');
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    return () => {
      active = false;
    };
  }, [loadItems, refreshIndex, page, pageSize, itemsKey]);

  useEffect(() => {
    if (pagination?.limit && pagination.limit !== pageSize) {
      setPageSize(pagination.limit);
    }
  }, [pagination?.limit, pageSize]);

  useEffect(() => {
    if (pagination?.totalPages && page > pagination.totalPages) {
      setPage(pagination.totalPages);
    }
  }, [pagination?.totalPages, page]);

  const handleDelete = async (item) => {
    if (!deleteItem) return;
    const identifier = item?.[idKey];
    if (identifier == null) return;

    const confirmed = window.confirm(`Delete this ${title.toLowerCase().replace(/s$/, '')}?`);
    if (!confirmed) return;

    try {
      await deleteItem(identifier);
      setRefreshIndex((value) => value + 1);
    } catch (err) {
      setError(err.message || 'Unable to delete record.');
    }
  };

  const visibleColumns = useMemo(() => columns || [], [columns]);

  return (
    <div className="space-y-6 text-white">
      <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <h1 className="text-3xl font-bold">{title}</h1>
        {description && <p className="mt-2 max-w-3xl text-sm text-slate-300">{description}</p>}
      </section>

      {error && <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</div>}

      <section className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/80 shadow-2xl shadow-black/10">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-white/5 text-slate-300">
              <tr>
                {visibleColumns.map((column) => (
                  <th key={column.key} className="px-4 py-4 font-medium whitespace-nowrap">{column.label}</th>
                ))}
                {deleteItem && <th className="px-4 py-4 font-medium whitespace-nowrap">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-200">
              {loading ? (
                <tr>
                  <td className="px-4 py-6 text-slate-400" colSpan={visibleColumns.length + (deleteItem ? 1 : 0)}>
                    Loading records...
                  </td>
                </tr>
              ) : items.length > 0 ? (
                items.map((item) => (
                  <tr key={item[idKey]} className="align-top hover:bg-white/5">
                    {visibleColumns.map((column) => (
                      <td key={column.key} className="px-4 py-4 align-top text-slate-300">
                        {column.render ? column.render(item) : String(item[column.key] ?? '—')}
                      </td>
                    ))}
                    {deleteItem && (
                      <td className="px-4 py-4">
                        <button
                          type="button"
                          onClick={() => handleDelete(item)}
                          className="rounded-xl border border-rose-400/20 bg-rose-500/10 px-3 py-2 text-xs font-medium text-rose-200 transition hover:bg-rose-500/20"
                        >
                          Delete
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-4 py-6 text-slate-400" colSpan={visibleColumns.length + (deleteItem ? 1 : 0)}>
                    {emptyMessage}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {pagination?.totalPages > 1 && (
        <PaginationControls
          page={page}
          totalPages={pagination.totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
};

export default AdminEntityPage;