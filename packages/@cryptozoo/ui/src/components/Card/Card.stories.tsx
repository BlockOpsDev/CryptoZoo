import { ComponentStory, ComponentMeta } from '@storybook/react';
import { apolloContext } from '../../utils/apollo/apollo-decorator';

import { Card } from './Card';

export default {
  title: 'Components/Card',
  component: Card,
  decorators: [apolloContext],
} as ComponentMeta<typeof Card>;

const Template: ComponentStory<typeof Card> = (args) => <Card {...args} />;

export const Primary = Template.bind({});

Primary.args = {};
