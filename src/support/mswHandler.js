import { http, HttpResponse, delay } from 'msw';

import {
  apiHandler,
  apiItemHandler,
  apiTreehandler,
  apiGenresHandler,
  apiSelectionHandler,
} from './api';

const DEFAULT_DELAY = 500;

const withAllParams = (fn) => {
  return async ({ params, request }) => {
    const allParams = {
      ...params,
      ...Object.fromEntries(new URL(request.url).searchParams),
    };

    await delay(DEFAULT_DELAY);
    return HttpResponse.json(await fn(allParams));
  };
};

export default [
  http.get('/api', withAllParams(apiHandler)),
  http.get('/api/item', withAllParams(apiItemHandler)),
  http.get('/api/tree', withAllParams(apiTreehandler)),
  http.get('/api/genres', withAllParams(apiGenresHandler)),
  http.get('/api/error', async () => {
    await delay(DEFAULT_DELAY);
    return HttpResponse.json(
      {
        errorMessage: 'Missing session',
      },
      { status: 500 },
    );
  }),
  http.get('/api/selection', withAllParams(apiSelectionHandler)),
];
