import React from 'react';
import { DocumentNode } from '@apollo/client';

// eslint-disable-next-line @typescript-eslint/ban-types
interface QueryFragmentComponent<FragmentProps, Props = {}>
  extends React.FC<Props & FragmentProps> {
  fragments: Record<keyof FragmentProps, DocumentNode>;
}

export default QueryFragmentComponent;
