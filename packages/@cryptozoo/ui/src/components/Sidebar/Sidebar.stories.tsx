import { ComponentStory, ComponentMeta } from '@storybook/react';
import { apolloContext } from '../../utils/apollo/apollo-decorator';

import { Sidebar } from './Sidebar';

export default {
  title: 'Sidebar',
  component: Sidebar,
  decorators: [apolloContext],
} as ComponentMeta<typeof Sidebar>;

const Template: ComponentStory<typeof Sidebar> = (args) => (
  <Sidebar {...args} />
);

export const Primary = Template.bind({});

Primary.args = {};