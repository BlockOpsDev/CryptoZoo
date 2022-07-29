import React from 'react';
import { DocumentNode } from 'graphql';

// eslint-disable-next-line @typescript-eslint/ban-types
interface FragC<FragmentProps, Props = {}>
  extends React.FC<Props & FragmentProps> {
  fragments: Record<keyof FragmentProps, DocumentNode>;
}

export default FragC;
