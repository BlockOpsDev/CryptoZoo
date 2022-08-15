import { ComponentStory, ComponentMeta } from '@storybook/react';
import { apolloContext } from '../../utils/apollo/apollo-decorator';

import { FragmentComponentExample } from './FragmentComponentExample';

export default {
  title: 'Components/FragmentComponentExample',
  component: FragmentComponentExample,
  decorators: [apolloContext],
} as ComponentMeta<typeof FragmentComponentExample>;

const Template: ComponentStory<typeof FragmentComponentExample> = (args) => <FragmentComponentExample {...args} />;

export const Primary = Template.bind({});

Primary.args = {
  user: {
    wallet: '0x00000000',
  },
};
