declare module '*.graphql' {
  import { DocumentNode } from '@apollo/client';

  const value: DocumentNode;
  export = value;
}
