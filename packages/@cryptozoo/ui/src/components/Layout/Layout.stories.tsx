import { ComponentStory, ComponentMeta } from '@storybook/react';
import { apolloContext } from '../../utils/apollo/apollo-decorator';

import { Layout } from './Layout';

export default {
  title: 'Layouts/Main',
  component: Layout,
  argTypes: {
    onClick: { action: 'clicked' },
  },
  decorators: [apolloContext],
} as ComponentMeta<typeof Layout>;

const Template: ComponentStory<typeof Layout> = (args) => <Layout {...args} />;

export const Primary = Template.bind({});

Primary.args = {
  navLinkProps: [
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
