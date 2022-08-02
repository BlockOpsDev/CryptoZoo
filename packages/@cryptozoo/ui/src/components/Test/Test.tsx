import React from 'react';

import { gql, useQuery } from '@apollo/client';
import { GetUserType, GetUserTypeVariables } from './__generated__/GetUserType';

export interface TestProps {
  id: string;
}

export const GET_USER_QUERY = gql`
  query GetUserType($id: ID!) {
    user(id: $id) {
      id
      name
    }
  }
`;

export const Test: React.FC<TestProps> = ({ id }: TestProps) => {
  const { loading, data } = useQuery<GetUserType, GetUserTypeVariables>(
    GET_USER_QUERY,
    {
      variables: { id },
    }
  );

  if (loading || !data) return <div className="text-white">Loading...</div>;
  return <div className="text-white">{data.user && data.user.name}</div>;
};
