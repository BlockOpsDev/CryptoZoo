import { ComponentStory, ComponentMeta } from '@storybook/react';
import { apolloContext } from '../../utils/apollo/apollo-decorator';

import { Test } from './Test';

export default {
  title: 'Test',
  component: Test,
  decorators: [apolloContext],
} as ComponentMeta<typeof Test>;

const Template: ComponentStory<typeof Test> = (args) => <Test {...args} />;

export const Primary = Template.bind({});

Primary.args = {
  id: '1',
};
