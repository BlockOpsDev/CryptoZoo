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
import type { IconType } from 'react-icons'

export interface NavLinkProps {
  title: string;
  to: string;
  iconKey: string;
  locked: boolean;
  showLabel?: boolean;
}

export const iconMap: {
  [key: string]: (IconType);
} = {
  home: AiFillHome,
  swap: AiOutlineSwap,
  store: IoStorefront,
  heart: AiFillHeart,
  trophy: AiFillTrophy,
  game: IoGameController,
  link: FaLink,
  discord: FaDiscord,
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
          {iconMap[iconKey]({ size: '30' })}
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
