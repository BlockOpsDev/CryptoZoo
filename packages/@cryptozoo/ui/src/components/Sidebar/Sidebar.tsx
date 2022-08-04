import React from "react";
import Link from "next/link";
import Image from "next/image";

import cx from "classnames";

// import logo from "../../static/images/logo.png";

import {
  AiFillHome,
  AiOutlineSwap,
  AiFillHeart,
  AiFillTrophy,
} from "react-icons/ai";
import { IoStorefront, IoGameController } from "react-icons/io5";
import { FaLink, FaDiscord, FaLock } from "react-icons/fa";

const ICON_SIZE = "30";

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
      <div className="flex items-center gap-2 cursor-pointer">
        <div className={cx(
          "p-2 bg-layer--3 rounded-md flex justify-center items-center relative gap-x-2 grow-0",
          navItem.locked ? "text-secondary-text" : "text-primary-text",
        )}>
          {iconMap[navItem.iconKey]}
          <FaLock className={cx(
            "absolute -top-1 -right-1 -rotate-6 text-secondary-text",
            { ["hidden"]: !navItem.locked, },
          )} />
        </div>
        <span className={cx(
          navItem.locked ? "text-secondary-text" : "text-primary-text",
        )}>
          {navItem.title}
        </span>
      </div>
    </Link>
  );
};



/**
 * @returns Sidebar Element
 */
export const Sidebar: React.FC<SidebarProps> = ({ navItems }: SidebarProps) => {
  return (
    <div className={cx(
      "text-primary-text h-full w-full flex flex-col bg-layer--2 rounded-lg",
    )}>
      <div className="p-4">
        <Image src="/logo.png" alt="ZOO Logo" layout="fill" />
        {/* <Image src={logo} alt="ZOO Logo" layout="fill" /> */}
        <img src="/logo.png" alt="ZOO Logo" className="max-h-8"/>

        {/* <FaChevronCircleRight className="absolute -bottom-2 -right-2 text-layer--4" /> */}
      </div>
      <ul className="flex flex-col gap-4 p-4">
        {navItems.map((navItem: NavItem, index: number) => {
          return (
            <li key={index} className="w-full">
              {generateNavItem(navItem)}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
