import React, { useState } from 'react';
import { AiOutlineSwap } from 'react-icons/ai';
import { FaCogs, FaTimes } from 'react-icons/fa';
import Popup from 'reactjs-popup';

import type { Token } from '../../components/TokenSelector';
import { Card } from '../../components/Card';
import { TokenSelector } from '../../components/TokenSelector';
import { SwapSettings } from '../../components/SwapSettings';

export interface SwapProps {
  props?: object;
}

export const Swap: React.FC<SwapProps> = (_: SwapProps) => {
  const [tokenSelectOpen, setTokenSelectOpen] = useState(false);
  const [txnSettingsOpen, setTxnSettingsOpen] = useState(false);

  const closeTokenSelection = () => setTokenSelectOpen(false);
  const closeTxnSettings = () => setTxnSettingsOpen(false);

  const tokenSelected = (token: Token) => {
    console.log('token selected:', token);
    closeTokenSelection();
  };

  const tokenSelectPopup = (
    <Popup
      open={tokenSelectOpen}
      modal
      closeOnDocumentClick={false}
      onClose={closeTokenSelection}
      overlayStyle={{
        backgroundColor: 'rgba(0,0,0,0.8)',
      }}
    >
      <div className="relative h-[95vh] w-[400px] max-w-[95vw]">
        <button
          className="text-secondary-text absolute top-2 right-2 z-10"
          onClick={closeTokenSelection}
        >
          <FaTimes size={20} />
        </button>

        <TokenSelector
          tokens={[
            {
              name: 'Ether',
              symbol: 'ETH',
              address: 'none',
              imageSrc: 'https://via.placeholder.com/50x50',
            },
          ]}
          onTokenSelected={tokenSelected}
        />
      </div>
    </Popup>
  );

  const txnSettingsPopup = (
    <Popup
      open={txnSettingsOpen}
      modal
      closeOnDocumentClick={false}
      onClose={closeTxnSettings}
      position="top center"
      overlayStyle={{
        backgroundColor: 'rgba(0,0,0,0.8)',
      }}
    >
      <div className="relative w-[400px] max-w-[95vw]">
        <button
          className="text-secondary-text absolute top-2 right-2 z-10"
          onClick={closeTxnSettings}
        >
          <FaTimes size={20} />
        </button>

        <Card layer={4} className="w-full p-4">
          <SwapSettings props={{}} />
        </Card>
      </div>
    </Popup>
  );

  return (
    <>
      {tokenSelectPopup}
      {txnSettingsPopup}

      <Card
        layer={2}
        className="font-chakra text-primary-text relative w-full p-4"
      >
        <div className="flex flex-col items-center justify-center gap-4">
          <button
            className="text-secondary-text absolute top-2 right-2"
            onClick={() => setTxnSettingsOpen(true)}
          >
            <FaCogs size={24} />
          </button>

          <h1 className="text-4xl">
            <strong className="flex items-center gap-2">
              Token
              <AiOutlineSwap size={30} />
              Swap
            </strong>
          </h1>

          <div className="flex w-full flex-col items-center gap-1">
            <Card layer={3} className="w-full p-4 pb-6">
              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <button
                    className="bg-secondary w-full rounded-full px-4 py-1"
                    onClick={() => setTokenSelectOpen(true)}
                  >
                    Select Token
                  </button>
                  <span className="text-secondary-text cursor-pointer hover:underline">
                    Max
                  </span>
                  <input
                    type="text"
                    className="tablet bg-secondary focus:border-secondary-text flex-grow appearance-none rounded-md border-2 border-[transparent] px-4 py-1 text-right outline-none"
                    placeholder="0.00"
                  />
                </div>

                <span className="text-secondary-text text-right">
                  ~ $123,456.00
                </span>
              </div>
            </Card>

            <div className="relative">
              <div className="bg-layer--4 absolute z-10 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full drop-shadow-sm">
                <AiOutlineSwap size={24} />
              </div>
            </div>

            <Card layer={3} className="w-full p-4 pt-6">
              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <button
                    className="bg-secondary w-full rounded-full px-4 py-1"
                    onClick={() => setTokenSelectOpen(true)}
                  >
                    Select Token
                  </button>
                  <span className="text-secondary-text cursor-pointer hover:underline">
                    Max
                  </span>
                  <input
                    type="text"
                    className="bg-secondary focus:border-secondary-text flex-grow appearance-none rounded-md border-2 border-[transparent] px-4 py-1 text-right outline-none"
                    placeholder="0.00"
                  />
                </div>

                <span className="text-secondary-text text-right">
                  ~ $123,456.00
                </span>
              </div>
            </Card>
          </div>

          <div className="flex w-full flex-col">
            <div className="flex justify-between">
              <span>Token 1 Price</span>
              <span className="text-secondary-text">X T1 ($1.00)</span>
            </div>
            <div className="flex justify-between">
              <span>Token 2 Price</span>
              <span className="text-secondary-text">Y T2 ($1.00)</span>
            </div>
            <div className="flex justify-between">
              <span>T1/T2</span>
              <span className="text-secondary-text">($1.00)</span>
            </div>
            <div className="flex justify-between">
              <span>Fees</span>
              <span className="text-secondary-text">Lorem ($1.00)</span>
            </div>
          </div>

          <button className="bg-primary min-w-[50%] rounded-full px-4 py-1 text-2xl">
            Swap
          </button>
        </div>
      </Card>
    </>
  );
};
