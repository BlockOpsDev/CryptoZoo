import React from 'react';
import Link from 'next/link';
import cx from 'classnames';

// Icons
import {
  AiFillHome,
  AiOutlineSwap,
  AiFillHeart,
  AiFillTrophy,
} from 'react-icons/ai';
import { IoStorefront, IoGameController } from 'react-icons/io5';
import { FaLink, FaDiscord, FaLock } from 'react-icons/fa';
const ICON_SIZE = '30';

export interface NavLinkProps {
  title: string;
  to: string;
  iconKey: string;
  locked: boolean;
  showLabel?: boolean;
}

export const iconMap: {
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

export const NavLink: React.FC<NavLinkProps> = ({
  title,
  to,
  iconKey,
  locked,
  showLabel,
}: NavLinkProps) => {
  return (
    <Link href={to}>
      <div className={cx(
        "flex cursor-pointer items-center gap-2",
        { 'justify-center': !showLabel },
      )}>
        <div
          className={cx(
            'bg-layer--3 relative flex grow-0 items-center justify-center gap-x-2 rounded-md p-2',
            locked ? 'text-secondary-text' : 'text-primary-text'
          )}
        >
          {iconMap[iconKey]}
          <FaLock
            className={cx(
              'text-secondary-text absolute -top-1 -right-1 -rotate-6',
              { ['hidden']: !locked }
            )}
          />
        </div>
        <span
          className={cx(
            locked ? 'text-secondary-text' : 'text-primary-text',
            { 'hidden': !showLabel },
          )}
        >
          {title}
        </span>
      </div>
    </Link>
  );
};

NavLink.defaultProps = {
  showLabel: true
}
