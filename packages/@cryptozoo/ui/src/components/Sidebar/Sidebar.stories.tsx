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

Primary.args = {
  navItems: [
    { title: 'Home', to: '#', locked: false, iconKey: 'home' },
    { title: 'ZooSwap', to: '#', locked: false, iconKey: 'swap' },
    { title: 'Marketplace', to: '#', locked: true, iconKey: 'store' },
    { title: 'Breeding/Hatching', to: '#', locked: true, iconKey: 'heart' },
    { title: 'Rewards', to: '#', locked: true, iconKey: 'trophy' },
    { title: 'Games', to: '#', locked: true, iconKey: 'game' },
    { title: 'Links/Resources', to: '#', locked: false, iconKey: 'link' },
    { title: 'Discord', to: '#', locked: false, iconKey: 'discord' },
  ],
};
