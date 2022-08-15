import React, { useState } from 'react';
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
  navOpen: boolean;
  navItems: NavItem[];
}

/**
 * @returns Layout Element
 */
export const Layout: React.FC<LayoutProps> = ({ navItems }: LayoutProps) => {
  const [navOpen, setNavOpen] = useState(false);

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
                  <li key={index} className="w-full">
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
              onClick={() => setNavOpen(false)}
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
              <button onClick={() => setNavOpen(true)}>
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
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla
              doloribus id ad reiciendis! Tempore libero corrupti reprehenderit
              dolorum. Quia, maxime delectus veritatis obcaecati quos voluptatum
              deleniti atque sit explicabo ab, illo dolorum? Culpa ratione ullam
              cum repellat minus, quaerat non maiores beatae quod quis omnis
              aperiam voluptatibus nesciunt dicta velit laudantium. Provident
              facilis libero error blanditiis. Sint, laudantium maiores! Itaque,
              labore error obcaecati hic accusamus consectetur cupiditate quod
              adipisci est enim exercitationem nulla maiores culpa mollitia
              quasi soluta porro! Error quis velit at voluptate corporis aliquam
              inventore est, dolores saepe magni maiores soluta quidem aut,
              voluptatem magnam accusantium qui. Rerum repudiandae velit nam,
              omnis, perspiciatis beatae laborum dolore ab quam molestiae
              voluptates laboriosam, consectetur laudantium odit modi ea
              nesciunt. Nobis maxime cumque aspernatur et labore natus commodi
              dolores enim voluptatibus sit? Numquam repudiandae sint,
              laudantium facilis tempore itaque corrupti quae, doloremque nihil
              ut voluptatibus minus nesciunt! Quis vel distinctio in maiores
              quisquam corporis alias harum voluptatum vero, sint deleniti
              beatae at excepturi dolor earum reprehenderit itaque unde
              laudantium officiis! Minus ducimus saepe rem facilis nam dolorum
              consequuntur eligendi, aliquam officia iste deleniti quidem fuga,
              ut, voluptas reiciendis omnis suscipit ipsum modi repellendus
              dignissimos. Mollitia dignissimos itaque alias a. Minus dolorum
              nostrum, modi, tempora deserunt libero nihil ipsam aperiam
              consequatur et, odio alias molestias eos enim porro est! Eaque
              illum corrupti consequatur sapiente, maxime eius nostrum omnis a
              beatae reiciendis sequi modi, rerum aspernatur, quas dolorum
              minus. Iste voluptate tenetur nesciunt impedit perspiciatis, quis
              magni accusantium adipisci odio? Aspernatur explicabo hic
              asperiores quibusdam earum fuga fugiat aperiam ducimus quam
              laborum at distinctio repellendus beatae, impedit molestias!
              Voluptatibus nesciunt fuga veniam consectetur nihil voluptas
              quibusdam quas ut sit facere, totam eaque porro! Accusantium
              perspiciatis, dolorem delectus autem iste officia reiciendis!
              Aliquid delectus iste architecto, minima quisquam facere quo quia,
              eos alias error molestias optio quae molestiae tempora corporis
              cumque deleniti facilis asperiores ipsam animi nihil in nesciunt!
              Repellendus molestiae placeat hic amet dicta autem! Cum blanditiis
              nesciunt, vel aperiam similique error eveniet perspiciatis ut
              consequuntur quasi maxime explicabo, ipsa saepe quae? Hic
              molestiae nesciunt non commodi tempora itaque eaque culpa quam
              quis distinctio qui aspernatur officiis nulla explicabo tempore,
              minus in recusandae, sit neque quia eveniet? Nostrum nemo eaque
              dolores. Aut numquam assumenda dolore fugiat sit cupiditate, vel
              nostrum magnam. Nobis illum enim tempora tenetur similique sequi
              veritatis molestias mollitia consequuntur iste adipisci quia, qui
              veniam libero est. Ipsam, aspernatur officia nostrum aliquam
              deleniti delectus, quae autem expedita ea, placeat obcaecati
              voluptatem. Obcaecati, deserunt debitis. Quaerat assumenda iure
              accusantium ex repellendus eos cupiditate impedit eligendi. Sunt
              dolorum aut impedit placeat consequatur harum numquam, corrupti ad
              ex commodi nemo, culpa voluptatem magni rerum, nisi voluptas
              inventore iusto repellat? Voluptatum, laboriosam? Illo sequi
              consectetur numquam dolores itaque nam perspiciatis voluptatem
              illum, eum omnis, placeat totam rem quis? Officiis, facilis iusto
              non voluptatibus ratione aperiam reprehenderit eligendi inventore
              blanditiis nihil id natus praesentium excepturi esse aliquid
              similique est, atque eveniet. Sapiente quaerat ab inventore
              magnam, aliquid quam magni animi, voluptatem esse, dicta porro
              cumque facilis.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
