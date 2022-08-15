import React, { ReactChildren, useState } from 'react';
import Link from 'next/link';

import cx from 'classnames';

import {
  AiFillHome,
  AiOutlineSwap,
  AiFillHeart,
  AiFillTrophy,
  AiOutlineMenu,
  AiOutlineRight,
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

export interface NavItem {
  title: string;
  to: string;
  iconKey: string;
  locked: boolean;
}

export interface LayoutProps {
  children: ReactChildren;
  navItems: NavItem[];
}

/**
 * @returns Layout Element
 */
export const Layout: React.FC<LayoutProps> = ({ navItems, children }: LayoutProps) => {
  const [navOpen, setNavOpen] = useState(false);
  const toggleNav = () => setNavOpen(!navOpen);

  return (
    <div>
      <div
        className={cx(
          'layout bg-layer--1 fixed top-0 left-0 flex overflow-clip transition-transform',
          { 'nav-open': navOpen }
        )}
      >
        {/* Navigation */}
        <div className="h-screen w-screen flex-none p-4">
          <div className="text-primary-text bg-layer--2 relative flex h-full w-full flex-col rounded-lg">
            <div className="p-4">
              <span className="text-4xl">ZOO</span>
              {/* <Image src="https://via.placeholder.com/100x100" alt="ZOO Logo" layout="fill" /> */}
              {/* <FaChevronCircleRight className="absolute -bottom-2 -right-2 text-layer--4" /> */}
            </div>
            <ul className="flex flex-col gap-4 overflow-scroll p-4">
              {navItems.map((navItem: NavItem, index: number) => {
                return (
                  <li key={index} className="w-full" onClick={toggleNav}>
                    <Link href={navItem.to}>
                      <div className="flex cursor-pointer items-center gap-2">
                        <div
                          className={cx(
                            'bg-layer--3 relative flex grow-0 items-center justify-center gap-x-2 rounded-md p-2',
                            navItem.locked
                              ? 'text-secondary-text'
                              : 'text-primary-text'
                          )}
                        >
                          {iconMap[navItem.iconKey]}
                          <FaLock
                            className={cx(
                              'text-secondary-text absolute -top-1 -right-1 -rotate-6',
                              { ['hidden']: !navItem.locked }
                            )}
                          />
                        </div>
                        <span
                          className={cx(
                            navItem.locked
                              ? 'text-secondary-text'
                              : 'text-primary-text'
                          )}
                        >
                          {navItem.title}
                        </span>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
            {/* Close Menu Button */}
            <button
              className="absolute top-4 right-4"
              onClick={toggleNav}
            >
              <AiOutlineRight size={ICON_SIZE} />
            </button>
          </div>
        </div>

        {/* Page Container */}
        <div className="flex h-screen w-screen flex-none flex-col gap-4 p-4">
          {/* Header Bar */}
          <div className="w-100 text-primary-text bg-layer--2 flex items-center gap-4 rounded-lg p-4">
            <div className="flex-none">
              <button onClick={toggleNav}>
                <AiOutlineMenu size={ICON_SIZE} />
              </button>
            </div>
            <div className="flex-grow"></div>
            <div className="flex-none">
              <button className="bg-primary text-primary-text rounded-lg px-4 py-2">
                Wallet
              </button>
            </div>
          </div>

          {/* Page Content */}
          <div className="w-100 h-100 text-primary-text flex flex-col gap-4 overflow-y-scroll">
            <h1 className="text-4xl">Page Content</h1>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
