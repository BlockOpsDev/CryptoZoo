import React from 'react';

export interface SwapSettingsProps {
  props: object;
}

export const SwapSettings: React.FC<SwapSettingsProps> = (
  _: SwapSettingsProps
) => {
  return (
    <div className="text-primary-text flex flex-col gap-2">
      <h1 className="text-2xl">Transaction Settings</h1>
      <p>Slippage</p>
      <div className="flex items-center gap-2">
        <button className="button bg-secondary">Auto</button>
        <div className="flex-grow"></div>
        <input
          type="text"
          name=""
          id=""
          className="input max-w-[50%] text-right"
          placeholder="0.50"
        />
        <span>%</span>
      </div>
      <p>Transaction deadline</p>
      <div className="flex items-center gap-2">
        <input
          type="text"
          name=""
          id=""
          className="input max-w-[50%]"
          placeholder="30"
        />
        <span>minutes</span>
      </div>
    </div>
  );
};
