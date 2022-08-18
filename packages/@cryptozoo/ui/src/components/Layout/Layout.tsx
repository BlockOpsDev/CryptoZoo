import React, { ReactChildren, useState } from 'react';
import cx from 'classnames';
import { FaBars, FaChevronRight } from 'react-icons/fa';
import { NavLink } from '../NavLink';
import type { NavLinkProps } from '../NavLink';
import { WalletButton } from '../WalletButton';
import Image from 'next/image'


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
  const toggleNav = () => setNavOpen(prevNavOpen => !prevNavOpen);
  const onNav = () => {
    console.log(window.innerWidth)
    if (window.innerWidth < 960) {
      toggleNav();
    }
  }

  const ICON_SIZE = '30';

  return (
    <div>
      <div
        className={cx(
          'fixed top-0 left-0',
          'flex overflow-clip transition-transform bg-layer--1',
          'tablet:w-screen tablet:translate-x-0',
          ( navOpen ? 'translate-x-0' : 'translate-x-[-85vw]' ),
        )}
      >

        {/* Navigation */}
        <div className={cx(
          'h-screen w-[85vw] flex-none p-4',
          'tablet:p-0 tablet:w-fit',
        )}>
          <div className={cx(
            "text-primary-text bg-layer--2 border-2 border-solid border-layer--3 relative flex h-full w-full flex-col rounded-lg",
            "tablet:rounded-none tablet:border-0 tablet:border-r-2 transition-all",
          )}>
            <div className="p-3 border-b-2 border-layer--3 text-center relative">
              <div className="h-16 w-20 mx-auto block relative">
                <Image src="https://cdn.discordapp.com/attachments/948678454176514108/1004786166148636853/Asset_10.4xe.png" layout='fill' alt='Zoo Logo' objectFit='contain' />
              </div>

              {/* Show Labels Button */}
              <button className={cx(
                  "absolute -bottom-3 -right-3 hidden tablet:flex w-6 h-6 transition-all",
                  "bg-layer--3 border-layer--4 border-2 rounded-full justify-center items-center text-secondary-text",
                  { 'rotate-180': navOpen }
                )}
                onClick={toggleNav}
              >
                <FaChevronRight size="15" className='ml-1' />
              </button>

            </div>

            {/* Navigation Links */}
            <ul className="flex-grow flex flex-col gap-4 overflow-auto p-4">
              {navLinkProps.map((navLinkProps: NavLinkProps, index: number) => (
                <li key={index} className="w-full" onClick={onNav}>
                  <NavLink {...navLinkProps} showLabel={navOpen} />
                </li>
              ))}
            </ul>

            {/* Close Menu Button */}
            <button className="absolute top-4 right-4 tablet:hidden" onClick={toggleNav}>
              <FaChevronRight size={ICON_SIZE} />
            </button>

          </div>
        </div>

        {/* Page Container */}
        <div className="flex h-screen w-screen flex-none flex-col gap-4 p-4 tablet:w-100 tablet:flex-initial">

          {/* Header Bar */}
          <div className="w-100 text-primary-text flex items-center gap-4 rounded-lg">
            <div className="flex-none tablet:hidden">
              <button onClick={toggleNav}>
                <FaBars size={ICON_SIZE} />
              </button>
            </div>
            <div className="flex-grow"></div>
            <div className="flex-none">
              <WalletButton connected={true} />
            </div>
          </div>

          {/* Page Content */}
          <div className="flex-grow w-100 h-100 text-primary-text flex flex-col gap-4 p-2 tablet:p-4 overflow-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
