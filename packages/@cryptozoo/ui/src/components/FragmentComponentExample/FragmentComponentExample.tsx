import FragC from '../../utils/FragC';
import { gql } from '@apollo/client';
import { FragmentComponentExample_User } from './__generated__/FragmentComponentExample_User';

export interface FragmentComponentExampleProps {
  user: FragmentComponentExample_User | null;
}

export const FragmentComponentExample: FragC<FragmentComponentExampleProps> = ({ user }: FragmentComponentExampleProps) => {
  return (
    <div>
      <p className="text-white">{user && user.wallet + ' ' + user.name}</p>
    </div>
  );
};

FragmentComponentExample.fragments = {
  user: gql`
    fragment FragmentComponentExample_User on User {
      wallet
      name
    }
  `,
};
