import * as React from 'react';
import FragC from '../../utils/FragC';
import { gql } from '@apollo/client';

export interface DataProps {
  user: {
    wallet: string;
  };
}

export const Data: FragC<DataProps> = ({ user }: DataProps) => {
  return (
    <div>
      <p className="text-white">{user.wallet}</p>
    </div>
  );
};

Data.fragments = {
  user: gql`
    fragment Wallet on User {
      wallet
    }
  `,
};
