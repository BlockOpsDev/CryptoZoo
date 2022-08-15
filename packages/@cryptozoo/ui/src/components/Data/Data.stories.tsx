import { ComponentStory, ComponentMeta } from '@storybook/react';
import { apolloContext } from '../../utils/apollo/apollo-decorator';

import { Data } from './Data';

export default {
  title: 'Data',
  component: Data,
  decorators: [apolloContext],
} as ComponentMeta<typeof Data>;

const Template: ComponentStory<typeof Data> = (args) => <Data {...args} />;

export const Primary = Template.bind({});

Primary.args = {
  user: {
    wallet: '0x00000000',
  },
};
