import { useCallback, useRef } from 'react';
import { parse, stringify } from 'qs';

const useSearchParamsState = ({ searchParams, setSearchParams }) => {
  const searchParamsState = useRef(
    searchParams ? parse(searchParams.toString()) : undefined,
  );

  const setSearchParamsState = useCallback(
    (params) => {
      setSearchParams(new URLSearchParams(stringify(params)));
    },
    [setSearchParams],
  );

  return [
    searchParams && searchParamsState.current,
    setSearchParams && setSearchParamsState,
  ];
};

export default useSearchParamsState;
