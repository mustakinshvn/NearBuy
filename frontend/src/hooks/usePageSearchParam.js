import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

export const usePageSearchParam = (paramName = 'page') => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Math.max(1, Number.parseInt(searchParams.get(paramName) || '1', 10) || 1);

  const setPageInParams = useCallback((nextPage) => {
    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      if (nextPage > 1) {
        next.set(paramName, String(nextPage));
      } else {
        next.delete(paramName);
      }
      return next;
    });
  }, [paramName, setSearchParams]);

  return {
    page,
    searchParams,
    setSearchParams,
    setPageInParams,
  };
};
