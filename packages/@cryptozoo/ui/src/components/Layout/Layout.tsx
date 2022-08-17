import React, { ReactChildren, useState } from 'react';
import cx from 'classnames';
import type { NavLinkProps } from '../NavLink';

import { NavLink } from '../NavLink';

import { AiOutlineMenu, AiOutlineRight } from 'react-icons/ai';
const ICON_SIZE = '30';

export interface LayoutProps {
  children: ReactChildren;
  navLinkProps: NavLinkProps[];
}

/**
 * @returns Layout Element
 */
export const Layout: React.FC<LayoutProps> = ({
  navLinkProps,
  children,
}: LayoutProps) => {
  const [navOpen, setNavOpen] = useState(false);
  const toggleNav = () => setNavOpen(!navOpen);

  return (
    <div>
      <div
        className={cx(
          'bg-layer--1 fixed top-0 left-0 flex overflow-clip transition-transform',
          'tablet:w-screen tablet:translate-x-0',
          ( navOpen ? 'translate-x-0' : '-translate-x-screen' ),
        )}
      >

        {/* Navigation */}
        <div className="h-screen w-screen flex-none p-4 tablet:p-0 tablet:w-fit">
          <div className={cx(
            "text-primary-text bg-layer--2 border-2 border-solid border-layer--3 relative flex h-full w-full flex-col rounded-lg",
            "tablet:rounded-none tablet:border-0 tablet:border-r-2 transition-all",
          )}>
            <div className="p-4 border-b-2 border-layer--3 text-center relative">
              <span className="text-4xl">ZOO</span>
              {/* <Image src="https://via.placeholder.com/100x100" alt="ZOO Logo" layout="fill" /> */}
              {/* <FaChevronCircleRight className="absolute -bottom-2 -right-2 text-layer--4" /> */}

              {/* Show Labels Button */}
              <button className={cx(
                  "absolute -bottom-3 -right-3 hidden tablet:flex w-6 h-6 transition-all",
                  "bg-layer--3 border-layer--4 border-2 rounded-full justify-center items-center text-secondary-text",
                  { 'rotate-180': navOpen }
                )}
                onClick={toggleNav}
              >
                <AiOutlineRight size="15" />
              </button>

            </div>

            {/* Navigation Links */}
            <ul className="flex-grow flex flex-col gap-4 overflow-scroll p-4">
              {navLinkProps.map((navLinkProps: NavLinkProps, index: number) => (
                <li key={index} className="w-full" onClick={toggleNav}>
                  <NavLink {...navLinkProps} showLabel={navOpen} />
                </li>
              ))}
            </ul>

            {/* Close Menu Button */}
            <button className="absolute top-4 right-4 tablet:hidden" onClick={toggleNav}>
              <AiOutlineRight size={ICON_SIZE} />
            </button>

          </div>
        </div>

        {/* Page Container */}
        <div className="flex h-screen w-screen flex-none flex-col gap-4 p-4 tablet:p-6 tablet:w-100 tablet:flex-initial">

          {/* Header Bar */}
          <div className="w-100 text-primary-text flex items-center gap-4 rounded-lg">
            <div className="flex-none tablet:hidden">
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
          <div className="flex-grow w-100 h-100 text-primary-text flex flex-col gap-4 overflow-y-scroll">
            <h1 className="text-4xl">Page Content</h1>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
