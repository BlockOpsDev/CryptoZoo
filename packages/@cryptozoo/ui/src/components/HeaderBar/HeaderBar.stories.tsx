import { ComponentStory, ComponentMeta } from '@storybook/react';
import { apolloContext } from '../../utils/apollo/apollo-decorator';

import { HeaderBar } from './HeaderBar';

export default {
  title: 'HeaderBar',
  component: HeaderBar,
  decorators: [apolloContext],
} as ComponentMeta<typeof HeaderBar>;

const Template: ComponentStory<typeof HeaderBar> = (args) => (
  <HeaderBar {...args} />
);

export const Primary = Template.bind({});

Primary.args = {};
