import React, { ReactChildren, useState } from 'react';
import cx from 'classnames';
import Image from 'next/image';
import { FaBars, FaChevronRight } from 'react-icons/fa';

import { NavLink } from '../../components/NavLink';
import type { NavLinkProps } from '../../components/NavLink';
import { WalletButton } from '../../components/WalletButton';

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
  const toggleNav = () => setNavOpen((prevNavOpen) => !prevNavOpen);
  const onNav = () => {
    if (window.innerWidth < 960) {
      toggleNav();
    }
  };

  const ICON_SIZE = '30';

  return (
    <>
      <div
        className={cx(
          'fixed top-0 left-0',
          'bg-layer--1 flex overflow-clip transition-transform',
          'tablet:w-screen tablet:translate-x-0',
          navOpen ? 'translate-x-0' : 'translate-x-[-85vw]'
        )}
      >
        {/* Navigation */}
        <div
          className={cx(
            'h-screen w-[85vw] flex-none p-4 pr-0',
            'tablet:p-0 tablet:w-fit'
          )}
        >
          <div
            className={cx(
              'text-primary-text bg-layer--2 border-layer--3 relative flex h-full w-full flex-col rounded-lg border-2 border-solid',
              'tablet:rounded-none tablet:border-0 tablet:border-r-2 transition-all'
            )}
          >
            {/* Navigation Container */}
            <div className="border-layer--3 relative border-b-2 p-3 text-center">
              {/* Close Menu Button */}
              <button
                className="tablet:hidden absolute top-4 right-4"
                onClick={toggleNav}
              >
                <FaChevronRight size={ICON_SIZE} />
              </button>

              {/* ZOO Logo */}
              <div className="relative mx-auto block h-16 w-20">
                <Image
                  src="https://cdn.discordapp.com/attachments/948678454176514108/1004786166148636853/Asset_10.4xe.png"
                  layout="fill"
                  alt="Zoo Logo"
                  objectFit="contain"
                />
              </div>

              {/* Show Labels Button */}
              <button
                className={cx(
                  'tablet:flex absolute -bottom-3 -right-3 hidden h-6 w-6 transition-all',
                  'bg-layer--3 border-layer--4 text-secondary-text items-center justify-center rounded-full border-2',
                  { 'rotate-180': navOpen }
                )}
                onClick={toggleNav}
              >
                <FaChevronRight size="15" className="ml-1" />
              </button>
            </div>

            {/* Navigation Links */}
            <ul className="flex flex-grow flex-col gap-4 overflow-auto p-4">
              {navLinkProps.map((navLinkProps: NavLinkProps, index: number) => (
                <li key={index} className="w-full" onClick={onNav}>
                  <NavLink {...navLinkProps} showLabel={navOpen} />
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Page Container */}
        <div className="tablet:w-100 tablet:flex-initial flex h-screen w-screen flex-none flex-col gap-4 py-4">
          {/* Header Bar */}
          <div className="w-100 text-primary-text flex items-center gap-4 rounded-lg px-4">
            <div className="tablet:hidden flex-none">
              <button onClick={toggleNav}>
                <FaBars size={ICON_SIZE} />
              </button>
            </div>
            <div className="flex-grow"></div>
            <div className="flex-none">
              <WalletButton
                connected={false}
                walletAddress=""
                keeperBalance="0"
                zooBalance="0"
              />
            </div>
          </div>

          {/* Page Content */}
          <div className="w-100 h-100 text-primary-text flex flex-grow flex-col gap-4 overflow-auto px-4">
            {children}
          </div>
        </div>
      </div>
    </>
  );
};
