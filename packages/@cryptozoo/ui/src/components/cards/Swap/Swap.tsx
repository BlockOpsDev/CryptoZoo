import React, { useState } from "react";
import { AiOutlineSwap } from 'react-icons/ai';
import { FaCogs, FaTimes } from "react-icons/fa";
import Popup from "reactjs-popup";

import type { Token } from "../../components/TokenSelector";
import { Card } from "../../components/Card";
import { TokenSelector } from "../../components/TokenSelector";
import { SwapSettings } from "../../components/SwapSettings";

export interface SwapProps {
  props?: object;
}

export const Swap: React.FC<SwapProps> = (_: SwapProps) => {
  const [tokenSelectOpen, setTokenSelectOpen] = useState(false);

  const closeTokenSelection = () => setTokenSelectOpen(false);

  const tokenSelected = (token: Token) => {
    console.log("token selected:", token);
    closeTokenSelection();
  }

  const tokenSelectPopup = (
    <Popup
      open={tokenSelectOpen}
      modal
      closeOnDocumentClick
      closeOnEscape
      onClose={closeTokenSelection}
    >
      <div className="max-w-[95vw] h-[95vh] w-[500px] relative">
        <button className="absolute top-2 right-2 z-10 text-secondary-text" onClick={closeTokenSelection}>
          <FaTimes size={20} />
        </button>

        <TokenSelector
          tokens={[{
            name: "Ether",
            symbol: "ETH",
            address: "none",
            imageSrc: "https://via.placeholder.com/50x50"
          }]}
          onTokenSelected={tokenSelected}
        />
      </div>
    </Popup>
  );

  const settingsPopup = (
    <Popup
      // open={settingsOpen}
      // trigger={settingsButton}
      trigger={
        <button className="absolute top-2 right-2 text-secondary-text">
          <FaCogs size={24} />
        </button>
      }
      position="bottom right"
      arrow={false}
      closeOnDocumentClick
      closeOnEscape
      offsetY={5}
    >
      <Card layer={4} className="p-2 max-w-[80vw]">
        <SwapSettings props={{}} />
      </Card>
    </Popup>
  );

  return (
    <>
      {tokenSelectPopup}

      <Card layer={2} className="w-full font-chakra text-primary-text p-4 relative">
        <div className="flex flex-col gap-4 justify-center items-center">

          {settingsPopup}

          <h1 className="text-4xl">
            <strong className="flex gap-2 items-center">
              Token
              <AiOutlineSwap size={30} />
              Swap
            </strong>
          </h1>

          <div className="flex flex-col gap-1 w-full items-center">
            <Card layer={3} className="w-full p-4 pb-6">
              <div className="flex flex-col gap-2">
                <div className="flex gap-2 items-center justify-center flex-wrap">
                  <button className="rounded-full bg-secondary px-4 py-1 w-full tablet:w-fit" onClick={() => setTokenSelectOpen(true)}>Select Token</button>
                  <span className="hover:underline cursor-pointer text-secondary-text">Max</span>
                  <input type="text" className="flex-grow tablet rounded-md bg-secondary border-2 border-[transparent] focus:border-secondary-text text-right px-4 py-1 outline-none appearance-none" placeholder="0.00" />
                </div>

                <span className="text-right text-secondary-text">
                  ~ $123,456.00
                </span>
              </div>
            </Card>
            
            <div className="relative">
              <div className="w-10 h-10 bg-layer--4 flex items-center justify-center rounded-full drop-shadow-sm z-10 absolute -translate-x-1/2 -translate-y-1/2">
                <AiOutlineSwap size={24} />
              </div>
            </div>

            <Card layer={3} className="w-full p-4 pt-6">
              <div className="flex flex-col gap-2">
                <div className="flex gap-2 items-center justify-center flex-wrap">
                  <button className="rounded-full bg-secondary px-4 py-1 w-full tablet:w-fit" onClick={() => setTokenSelectOpen(true)}>Select Token</button>
                  <span className="hover:underline cursor-pointer text-secondary-text">Max</span>
                  <input type="text" className="flex-grow rounded-md bg-secondary border-2 border-[transparent] focus:border-secondary-text text-right px-4 py-1 outline-none appearance-none" placeholder="0.00" />
                </div>

                <span className="text-right text-secondary-text">
                  ~ $123,456.00
                </span>
              </div>
            </Card>
          </div>

          <div className="flex flex-col w-full">
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
              <span className="text-secondary-text">Lorem, ipsum. ($1.00)</span>
            </div>
          </div>

          <button className="bg-primary rounded-full px-4 py-1 text-2xl min-w-[50%]">
            Swap
          </button>

        </div>
      </Card>
    </>
  );
};
