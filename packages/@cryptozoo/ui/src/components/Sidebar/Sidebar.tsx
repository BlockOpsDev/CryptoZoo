import React from 'react';
import Link from 'next/link'


export interface NavItem {
    title: string,
    to: string,
    locked: boolean,
}

export interface SidebarProps {
  navItems: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({ navItems }: SidebarProps) => {
  return <div className="text-primary-text h-screen fixed top-0 left-0 max-w-screen flex flex-col divide-y-2 divide-layer--3">
    <div className="p-4">ZOO</div>
    <nav className="flex flex-col gap-4">
      <ul>
        {navItems.map((navItem: NavItem, index: number) => {
          return <li key={index}>
            <Link href={navItem.to}>{navItem.title}</Link>
          </li>
        })}
      </ul>
    </nav>
  </div>;
};

Sidebar.defaultProps = {
  navItems: [
    { title: 'Home', to: '#', locked: false },
    { title: 'ZooSwap', to: '#', locked: false },
    { title: 'Marketplace', to: '#', locked: true },
    { title: 'Breeding/Hatching', to: '#', locked: true },
    { title: 'Rewards', to: '#', locked: true },
    { title: 'Games', to: '#', locked: true },
    { title: 'Links/Resources', to: '#', locked: true },
    { title: 'Discord', to: '#', locked: true }
  ]
}
