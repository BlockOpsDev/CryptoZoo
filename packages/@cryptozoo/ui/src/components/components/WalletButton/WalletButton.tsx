import React, { useState } from 'react';
import cx from 'classnames';
import Popup from 'reactjs-popup';
import { ethers } from 'ethers';
import Variants from 'tailwind-config/variants';
import { FaWallet, FaTimes } from 'react-icons/fa';

import { shortAddress } from '../../../lib';
import { Button } from '../../inputs/Button';
import { Card } from '../../components/Card';

export interface WalletButtonProps {
  keeperBalance: string;
  zooBalance: string;
  walletAddress: string;
  connected: boolean;
}


declare global {
  interface Window {
    ethereum: object;
  }
}


export const WalletButton: React.FC<WalletButtonProps> = ({ keeperBalance, zooBalance, walletAddress, connected }: WalletButtonProps) => {
  const [connectOpen, setConnectOpen] = useState(false);
  const closeConnect = () => setConnectOpen(false);

  const connectMetaMask = async () => {
    if (!window.ethereum) {
      throw new Error("Metamask Not Available");
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    console.log(provider);
  }

  const connectPopup = (
    <Popup
      open={connectOpen}
      modal
      closeOnDocumentClick={false}
      onClose={closeConnect}
      position="top center"
      overlayStyle={{
        backgroundColor: "rgba(0,0,0,0.8)"
      }}
    >
      <div className="max-w-[95vw] w-[400px] relative text-primary-text">
        <button className="absolute top-2 right-2 z-10 text-secondary-text" onClick={closeConnect}>
          <FaTimes size={20} />
        </button>

        <Card layer={4} className="p-4 pt-8 w-full">
          <div className="flex flex-col gap-4">
            <button className="button bg-primary" onClick={connectMetaMask}>Metamask</button>
            <button className="button bg-primary">WalletConnect</button>
          </div>
        </Card>
      </div>
    </Popup>
  );


  return (
    <>
      {connectPopup}

      <div className='drop-shadow'>
        <div className={cx({ 'hidden': connected })}>
          <Button loading={false} onClick={() => setConnectOpen(true)} variant={Variants.Primary}>
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
    </>
  );
};
