import { http, HttpResponse, delay } from 'msw';

import { fakeApi } from './fakeApi';

const apiEndpoint = http.get('/api', async ({ params, request }) => {
  const allParams = {
    ...params,
    ...Object.fromEntries(new URL(request.url).searchParams),
  };
  console.log('[API] request to /api', allParams);
  await delay(500);
  return HttpResponse.json(fakeApi('/api', allParams));
});

export default [apiEndpoint];
