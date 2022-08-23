import * as React from 'react';
import { gql, useQuery } from '@apollo/client';
import { FragmentComponentExample } from '../FragmentComponentExample';
import { GetUser, GetUserVariables } from './__generated__/GetUser';

export interface QueryComponentExampleProps {
  userId: string;
}

const GET_USER_QUERY = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      name
      ...FragmentComponentExample_User
    }
  }
  ${FragmentComponentExample.fragments.user}
`;

export const QueryComponentExample: React.FC<QueryComponentExampleProps> = ({ userId }: QueryComponentExampleProps) => {
  const { loading, data } = useQuery<GetUser, GetUserVariables>(
    GET_USER_QUERY,
    {
      variables: { id: userId },
    }
  );

  return (
    <div
      className="text-primary-text flex w-1/2 max-w-sm items-center justify-center overflow-hidden 
    rounded bg-slate-600 shadow-lg 
    shadow-slate-500/50"
    >
      {loading || !data ? (
        'Loading...'
      ) : (
        <div className="flex flex-col items-center">
          <div>{data.user && data.user.name}</div>
          <FragmentComponentExample user={data.user} />
        </div>
      )}
    </div>
  );
};
