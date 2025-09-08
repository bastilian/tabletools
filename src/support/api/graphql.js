import { graphql, HttpResponse } from 'msw';

import {
  apiHandler,
  apiItemHandler,
  apiTreehandler,
  apiGenresHandler,
  apiSelectionHandler,
  apiErrorHandler,
} from './mockBackend';

const api = graphql.link('http://local.com/graphql');

const withVariables = (fn, namespace = 'items') => {
  return async ({ variables, request }) => {
    const allParams = {
      ...variables,
      ...Object.fromEntries(new URL(request.url).searchParams),
    };
    const { data, meta } = await fn(allParams);

    return HttpResponse.json({
      data: {
        data: {
          [namespace]: data,
        },
        meta,
      },
    });
  };
};

export default [
  api.query('GetTracks', withVariables(apiHandler)),
  api.query('GetItem', withVariables(apiItemHandler)),
  api.query('GetTree', withVariables(apiTreehandler, 'tree')),
  api.query('GetGenres', withVariables(apiGenresHandler, 'genres')),
  api.query('GetError', withVariables(apiErrorHandler, 'error')),
  api.query('GetSelection', withVariables(apiSelectionHandler, 'selection')),
];
