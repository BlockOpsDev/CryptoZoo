import { ComponentStory, ComponentMeta } from '@storybook/react';
import { apolloContext } from '../../../utils/apollo/apollo-decorator';

import { QueryComponentExample } from './QueryComponentExample';

export default {
  title: 'Apollo/QueryComponentExample',
  component: QueryComponentExample,
  decorators: [apolloContext],
} as ComponentMeta<typeof QueryComponentExample>;

const Template: ComponentStory<typeof QueryComponentExample> = (args) => <QueryComponentExample {...args} />;

export const Primary = Template.bind({});

Primary.args = {
  userId: '1',
};
