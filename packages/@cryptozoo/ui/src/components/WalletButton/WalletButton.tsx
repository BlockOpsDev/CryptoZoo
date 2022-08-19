import React from 'react';
import { FaWallet } from 'react-icons/fa';
import cx from 'classnames';
import { Button } from '../Button';
import { shortAddress } from '../../lib';

import Variants from 'tailwind-config/variants';

export interface WalletButtonProps {
  keeperBalance: string;
  zooBalance: string;
  walletAddress: string;
  connected: boolean;
}

export const WalletButton: React.FC<WalletButtonProps> = ({ keeperBalance, zooBalance, walletAddress, connected }: WalletButtonProps) => {
  return (
    <div className='drop-shadow'>
      <div className={cx({ 'hidden': connected })}>
        <Button loading={false} onClick={() => { console.log("connect wallet") }} variant={Variants.Primary}>
          <div className="flex gap-1 items-center">
            <FaWallet className='mr-2' />
            <span>Connect</span>
          </div>
        </Button>
      </div>

      <div className={cx(
        "flex bg-layer--3 rounded-lg text-secondary-text w-fit",
        { 'hidden': !connected },
      )}>
        <div className="flex flex-col justify-end p-2 text-xs text-right">
          <span>{keeperBalance} <strong>$KPR</strong></span>
          <span>{zooBalance} <strong>$ZOO</strong></span>
        </div>

        <div className="bg-layer--2 py-2 px-4 rounded-lg">
          <div className="flex items-center justify-center h-full">
            <FaWallet className='mr-2' />
            {shortAddress(walletAddress)}
          </div>
        </div>
      </div>
    </div>
  );
};

WalletButton.defaultProps = {
  connected: true,
  keeperBalance: "123,456,789.45",
  zooBalance: "123,456,789.45",
  walletAddress: "0x2d4c407bbe49438ed859fe965b140dcf1aab71a9",
}
