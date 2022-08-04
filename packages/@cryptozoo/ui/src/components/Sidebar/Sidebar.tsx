import React from 'react';
import Link from 'next/link';
import cx from 'classnames';

import {
  AiFillHome,
  AiOutlineSwap,
  AiFillHeart,
  AiFillTrophy,
} from 'react-icons/ai';
import { IoStorefront, IoGameController } from 'react-icons/io5';
import { FaLink, FaDiscord, FaLock } from 'react-icons/fa';

const ICON_SIZE = '30';

const iconMap: {
  [key: string]: Element;
} = {
  home: <AiFillHome size={ICON_SIZE} />,
  swap: <AiOutlineSwap size={ICON_SIZE} />,
  store: <IoStorefront size={ICON_SIZE} />,
  heart: <AiFillHeart size={ICON_SIZE} />,
  trophy: <AiFillTrophy size={ICON_SIZE} />,
  game: <IoGameController size={ICON_SIZE} />,
  link: <FaLink size={ICON_SIZE} />,
  discord: <FaDiscord size={ICON_SIZE} />,
};

export interface SidebarProps {
  expanded: boolean,
  navItems: NavItem[];
}

export interface NavItem {
  title: string;
  to: string;
  iconKey: string;
  locked: boolean;
}

const generateNavItem = (navItem: NavItem) => {
  return (
    <Link href={navItem.to}>
      <div className={cx(
        'py-2 px-4 w-full bg-layer--3 rounded-lg flex justify-center items-center relative cursor-pointer gap-x-2',
        navItem.locked ? 'text-secondary-text' : 'text-primary-text',
      )}>

        {iconMap[navItem.iconKey]}

        <span>{navItem.title}</span>

        <FaLock className={cx(
          'absolute -top-1 -right-1 -rotate-6 text-primary-text',
          { ['hidden']: !navItem.locked, },
        )} />
      </div>
    </Link>
  );
};


export const Sidebar: React.FC<SidebarProps> = ({ navItems, expanded }: SidebarProps) => {

  return (
    <div className={cx(
      "text-primary-text flex h-screen flex-col fixed bg-layer--2",
      expanded ? "w-full" : "w-1"
    )}>
      <div className="p-4 relative">
        <span>ZOO</span>
        {/* <FaChevronCircleRight className="absolute -bottom-2 -right-2 text-layer--4" /> */}
      </div>
      <ul className="flex flex-col gap-4 mt-4">
        {navItems.map((navItem: NavItem, index: number) => {
          return (
            <li key={index} className="w-fit mx-auto">
              {generateNavItem(navItem)}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

Sidebar.defaultProps = {
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
