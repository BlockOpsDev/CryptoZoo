import { ComponentStory, ComponentMeta } from '@storybook/react';
import { apolloContext } from '../../utils/apollo/apollo-decorator';

import { Select } from './Select';

export default {
  title: 'Inputs/Select',
  component: Select,
  decorators: [apolloContext],
} as ComponentMeta<typeof Select>;

const Template: ComponentStory<typeof Select> = (args) => (
  <Select {...args} />
);

export const Primary = Template.bind({});

Primary.args = {};
