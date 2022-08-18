import React from "react";
import { Card } from "../Card";

export interface SwapProps {
  props?: object;
}

export const Swap: React.FC<SwapProps> = (_: SwapProps) => {
  return (
    <Card layer={2} className="w-full h-full">
      <div className="relative flex flex-col gap-2">
        <h1 className="text-4xl font-chakra">Token Swap</h1>
      </div>
    </Card>
  );
};
