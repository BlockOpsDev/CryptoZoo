import * as React from 'react';
import { gql, useQuery } from '@apollo/client';
import { Data } from '../Data/Data';

export interface CardProps {
  userId: string;
}

export const GET_USER_QUERY = gql`
  query GetUser($id: String!) {
    user(id: $id) {
      id
      name
      ...Wallet
    }
  }
  ${Data.fragments.user}
`;

export const Card: React.FC<CardProps> = ({ userId }: CardProps) => {
  const { loading, data } = useQuery(GET_USER_QUERY, {
    variables: { id: userId },
  });

  return (
    <div
      className="flex w-1/2 max-w-sm items-center justify-center overflow-hidden rounded 
    bg-slate-600 text-white shadow-lg 
    shadow-slate-500/50"
    >
      {loading ? (
        'Loading...'
      ) : (
        <div className="flex flex-col items-center">
          <div>{data.user.name}</div>
          <Data user={data.user} />
        </div>
      )}
    </div>
  );
};
