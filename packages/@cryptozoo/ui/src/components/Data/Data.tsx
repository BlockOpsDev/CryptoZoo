import React from 'react';
import FragC from '../../utils/FragC';
import { gql } from '@apollo/client';
import { Data_User } from './__generated__/Data_User';

export interface DataProps {
  user: Data_User | null;
}

export const Data: FragC<DataProps> = ({ user }: DataProps) => {
  return (
    <div>
      <p className="text-white">{user && user.wallet + ' ' + user.name}</p>
    </div>
  );
};

Data.fragments = {
  user: gql`
    fragment Data_User on User {
      wallet
      name
    }
  `,
};
