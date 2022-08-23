import React from "react";
import { Card } from "../Card";
import { Dropdown } from "../Dropdown";

import { AiOutlineSwap } from 'react-icons/ai';

export interface SwapProps {
  props?: object;
}

export const Swap: React.FC<SwapProps> = (_: SwapProps) => {
  return (
    <Card layer={2} className="w-full h-full relative font-chakra text-primary-text">
      <div className="relative flex flex-col gap-2 justify-center items-center">
        <h1 className="text-4xl">
          <strong>Token Swap</strong>
        </h1>

        <p className="text-secondary-text">Trade tokens in an instant</p>

        <div className="flex flex-col gap-1 relative w-full items-center">
          <Card layer={3} className="w-full">
            <Dropdown
              listContent={<span>test</span>}
            ></Dropdown>
          </Card>
          
          <div className="relative">
            <div className="w-8 h-8 bg-layer--4 flex items-center justify-center rounded-full drop-shadow-sm z-10 absolute -translate-x-1/2 -translate-y-1/2">
              <AiOutlineSwap size={24} />
            </div>
          </div>

          <Card layer={3} className="w-full">
            output
          </Card>
        </div>

      </div>
    </Card>
  );
};
