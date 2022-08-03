import QueryFragmentComponent from '../../utils/QueryFragmentComponent';
import { gql } from '@apollo/client';
import { Data_User } from './__generated__/Data_User';

export interface DataProps {
  user: Data_User | null;
}

export const Data: QueryFragmentComponent<DataProps> = ({ user }: DataProps) => {
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
