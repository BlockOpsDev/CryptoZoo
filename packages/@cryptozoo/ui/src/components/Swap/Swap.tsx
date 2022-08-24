import React from "react";
import { Card } from "../Card";
import { Dropdown } from "../Dropdown";

import { AiOutlineSwap } from 'react-icons/ai';

export interface SwapProps {
  props?: object;
}

export const Swap: React.FC<SwapProps> = (_: SwapProps) => {
  return (
    <Card layer={2} className="w-full h-full font-chakra text-primary-text">
      <div className="flex flex-col gap-2 justify-center items-center">
        <h1 className="text-4xl">
          <strong>Token Swap</strong>
        </h1>

        <p className="text-secondary-text">Trade tokens in an instant</p>

        <div className="flex flex-col gap-1 w-full items-center">
          <Card layer={3} className="w-full">
            <Dropdown
              dropdownContent={<span>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Animi dicta beatae natus ab quod nobis, illo ipsa repellat earum consequatur perspiciatis harum officiis, aspernatur, reprehenderit voluptatibus quam cupiditate. Maiores autem ipsa itaque quis. Facilis ullam quo natus adipisci sit, unde doloremque aspernatur est rerum, sequi tenetur quae corrupti magnam veniam?</span>}
            ></Dropdown>
          </Card>
          
          <div className="relative">
            <div className="w-10 h-10 bg-layer--4 flex items-center justify-center rounded-full drop-shadow-sm z-10 absolute -translate-x-1/2 -translate-y-1/2">
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
