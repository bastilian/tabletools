import { graphql, HttpResponse } from 'msw';

const api = graphql.link('http://local.com/graphql');

export default [
  api.query('GetTracks', ({ variables, ...rest }) => {
    console.log('gql rest', variables, rest);
    return HttpResponse.json({
      data: {
        user: {
          id: variables.id,
          name: 'John Maverick',
        },
      },
    });
  }),
];
