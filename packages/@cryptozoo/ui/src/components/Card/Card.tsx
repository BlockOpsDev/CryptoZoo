import * as React from 'react';
import { gql, useQuery } from '@apollo/client';
import { Data } from '../Data';
import { GetUser } from './__generated__/GetUser';
import { GetUserTypeVariables } from '../Test/__generated__/GetUserType';

export interface CardProps {
  userId: string;
}

const GET_USER_QUERY = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      name
      ...Data_User
    }
  }
  ${Data.fragments.user}
`;

export const Card: React.FC<CardProps> = ({ userId }: CardProps) => {
  const { loading, data } = useQuery<GetUser, GetUserTypeVariables>(
    GET_USER_QUERY,
    {
      variables: { id: userId },
    }
  );

  return (
    <div
      className="flex w-1/2 max-w-sm items-center justify-center overflow-hidden rounded 
    bg-slate-600 text-white shadow-lg 
    shadow-slate-500/50"
    >
      {loading || !data ? (
        'Loading...'
      ) : (
        <div className="flex flex-col items-center">
          <div>{data.user && data.user.name}</div>
          <Data user={data.user} />
        </div>
      )}
    </div>
  );
};
