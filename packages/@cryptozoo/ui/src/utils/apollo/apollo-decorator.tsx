import { MockedProvider } from '@apollo/client/testing';
import { DecoratorFn } from '@storybook/react';
import { mocks } from './mock-data';

export const apolloContext: DecoratorFn = (Story) => {
  return (
    <MockedProvider mocks={mocks} addTypename={false}>
      <Story />
    </MockedProvider>
  );
};
