/* eslint-disable no-debugger */

import React, { useState } from 'react';
import cx from 'classnames';
import Popup from 'reactjs-popup';
import { ethers } from 'ethers';
import Variants from 'tailwind-config/variants';
import { FaWallet, FaTimes } from 'react-icons/fa';

import { shortAddress, humanizeEther } from '../../../lib';
import { Button } from '../../inputs/Button';
import { Card } from '../../components/Card';
import { useEthersContext } from '@cryptozoo/ethers-context';

declare global {
  interface Window {
    ethereum?: ethers.providers.ExternalProvider;
  }
}

export const WalletButton: React.FC = () => {
  const [connectOpen, setConnectOpen] = useState(false);
  const closeConnect = () => setConnectOpen(false);
  const { provider, setProvider } = useEthersContext();

  const [accounts, setAccounts] = useState([]);
  const [kprBalance, setKprBalance] = useState('0');
  const [zooBalance, setZooBalance] = useState('0');

  React.useEffect(() => {
    if (provider === undefined) {
      return;
    }
    const _provider = provider.provider as ethers.providers.Provider;

    _provider.on('accountsChanged', setAccounts);

    // TODO: Fetch Balances
    setKprBalance(
      humanizeEther(ethers.BigNumber.from('10000000000000000000000'))
    );
    setZooBalance(
      humanizeEther(ethers.BigNumber.from('12000000000000000000000'))
    );
  }, [provider]);

  const connectMetaMask = async () => {
    if (window.ethereum === undefined) {
      throw new Error('Metamask Not Available');
    }
    const _provider = new ethers.providers.Web3Provider(window.ethereum);
    try {
      const _accounts = await _provider.send('eth_requestAccounts', []);
      setAccounts(_accounts);
      setProvider(_provider);
      closeConnect();
    } catch (e) {
      console.warn(e);
    }
  };

  const connectPopup = (
    <Popup
      open={connectOpen}
      modal
      closeOnDocumentClick={false}
      onClose={closeConnect}
      position="top center"
      overlayStyle={{
        backgroundColor: 'rgba(0,0,0,0.8)',
      }}
    >
      <div className="text-primary-text font-chakra relative w-[250px] max-w-[95vw]">
        <Card layer={4} className="w-full p-4 pt-8">
          <div className="flex flex-col gap-4">
            <button className="button bg-primary" onClick={connectMetaMask}>
              Metamask
            </button>
            <button className="button bg-primary">WalletConnect</button>
            <button
              className="button border-error flex items-center justify-center gap-2 border-2"
              onClick={closeConnect}
            >
              <FaTimes />
              <span>Cancel</span>
            </button>
          </div>
        </Card>
      </div>
    </Popup>
  );

  return (
    <div className="font-chakra drop-shadow">
      {connectPopup}

      <div className={cx({ hidden: accounts.length })}>
        <Button
          loading={false}
          onClick={() => setConnectOpen(true)}
          variant={Variants.Primary}
        >
          <div className="flex items-center gap-1">
            <FaWallet className="mr-2" />
            <span>Connect</span>
          </div>
        </Button>
      </div>

      <div
        className={cx('bg-layer--3 text-secondary-text flex w-fit rounded-lg', {
          hidden: !accounts.length,
        })}
      >
        <div className="flex flex-col justify-end p-2 text-right text-xs">
          <span>
            {kprBalance} <strong>$KPR</strong>
          </span>
          <span>
            {zooBalance} <strong>$ZOO</strong>
          </span>
        </div>

        <div className="bg-layer--2 rounded-lg py-2 px-4">
          <div className="flex h-full items-center justify-center">
            <FaWallet className="mr-2" />
            {accounts.length ? shortAddress(accounts[0]) : ''}
          </div>
        </div>
      </div>
    </div>
  );
};
