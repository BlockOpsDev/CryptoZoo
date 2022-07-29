import { GET_USER_QUERY } from '../../components/Card/Card';

export const mocks = [
  {
    request: {
      query: GET_USER_QUERY,
      variables: {
        id: '1',
      },
    },
    result: {
      data: {
        user: {
          __typename: 'User',
          id: '1',
          name: 'Bucke',
          wallet: '0x12334567823',
        },
      },
    },
  },
];
