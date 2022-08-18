import { ComponentStory, ComponentMeta } from '@storybook/react';
import { apolloContext } from '../../utils/apollo/apollo-decorator';

import { NavLink } from './NavLink';

import { iconMap } from './NavLink';

export default {
  title: 'Components/NavLink',
  component: NavLink,
  argTypes: {
    iconKey: {
      options: [...Object.keys(iconMap)],
      control: { type: 'select' },
    },
  },
  decorators: [apolloContext],
} as ComponentMeta<typeof NavLink>;

const Template: ComponentStory<typeof NavLink> = (args) => (
  <NavLink {...args} />
);

export const Primary = Template.bind({});

Primary.args = {
  title: 'Home',
  to: '#',
  locked: false,
  iconKey: 'home',
};
