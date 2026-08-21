import { http, HttpResponse } from 'msw';

import {
  apiHandler,
  apiItemHandler,
  apiTreehandler,
  apiGenresHandler,
  apiSelectionHandler,
  apiErrorHandler,
} from './mockBackend';

const withAllParams = (fn) => {
  return async ({ params, request }) => {
    const allParams = {
      ...params,
      ...Object.fromEntries(new URL(request.url).searchParams),
    };

    return HttpResponse.json(await fn(allParams));
  };
};

export default [
  http.get('/api', withAllParams(apiHandler)),
  http.get('/api/item', withAllParams(apiItemHandler)),
  http.get('/api/tree', withAllParams(apiTreehandler)),
  http.get('/api/genres', withAllParams(apiGenresHandler)),
  http.get('/api/error', withAllParams(apiErrorHandler)),
  http.get('/api/selection', withAllParams(apiSelectionHandler)),
];
