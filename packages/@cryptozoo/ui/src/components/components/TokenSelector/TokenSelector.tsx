import React from 'react';
import Image from 'next/image'
import { Card } from '../Card';

export type Token = {
  name: string;
  symbol: string;
  imageSrc: string;
  address: string;
}

export interface TokenSelectorProps {
  tokens: Token[];
}

export const TokenSelector: React.FC<TokenSelectorProps> = ({ tokens }: TokenSelectorProps) => {
  return (
    <Card layer={3} className="p-2 text-primary-text h-full">
      <div className="flex flex-col gap-2 h-full">
        <h1>Select a token</h1>

        <input type="text" name="" id="" className="input" placeholder="Search name or paste address" />

        <Card layer={4} className="flex-grow overflow-auto">
          <div className="flex flex-col">

            {tokens.map((token, index) => (
              <div className="flex items-center gap-4 py-2 px-4 cursor-pointer hover:bg-layer--5" key={index}>
                <div className="w-8 h-8 relative rounded-full overflow-clip">
                  <Image src={token.imageSrc} layout='fill' alt={token.name + ' Logo'} objectFit='contain' />
                </div>
                <div>
                  <p className='block leading-tight'>
                    {token.symbol}
                  </p>
                  <p className="text-secondary-text text-xs">
                    {token.name}
                  </p>
                </div>
              </div>
            ))}

          </div>
        </Card>
      </div>
    </Card>
  );
};

TokenSelector.defaultProps = {
  tokens: [
  {
    name: "Ether",
    symbol: "ETH",
    address: "none",
    imageSrc: "https://via.placeholder.com/50x50"
  }, {
    name: "Ether",
    symbol: "ETH",
    address: "none",
    imageSrc: "https://via.placeholder.com/50x50"
  }, {
    name: "Ether",
    symbol: "ETH",
    address: "none",
    imageSrc: "https://via.placeholder.com/50x50"
  }, {
    name: "Ether",
    symbol: "ETH",
    address: "none",
    imageSrc: "https://via.placeholder.com/50x50"
  }, {
    name: "Ether",
    symbol: "ETH",
    address: "none",
    imageSrc: "https://via.placeholder.com/50x50"
  }, {
    name: "Ether",
    symbol: "ETH",
    address: "none",
    imageSrc: "https://via.placeholder.com/50x50"
  }, {
    name: "Ether",
    symbol: "ETH",
    address: "none",
    imageSrc: "https://via.placeholder.com/50x50"
  }, {
    name: "Ether",
    symbol: "ETH",
    address: "none",
    imageSrc: "https://via.placeholder.com/50x50"
  }, {
    name: "Ether",
    symbol: "ETH",
    address: "none",
    imageSrc: "https://via.placeholder.com/50x50"
  }, {
    name: "Ether",
    symbol: "ETH",
    address: "none",
    imageSrc: "https://via.placeholder.com/50x50"
  }, {
    name: "Ether",
    symbol: "ETH",
    address: "none",
    imageSrc: "https://via.placeholder.com/50x50"
  }, {
    name: "Ether",
    symbol: "ETH",
    address: "none",
    imageSrc: "https://via.placeholder.com/50x50"
  }, {
    name: "Ether",
    symbol: "ETH",
    address: "none",
    imageSrc: "https://via.placeholder.com/50x50"
  }, {
    name: "Ether",
    symbol: "ETH",
    address: "none",
    imageSrc: "https://via.placeholder.com/50x50"
  }, {
    name: "Ether",
    symbol: "ETH",
    address: "none",
    imageSrc: "https://via.placeholder.com/50x50"
  }
]
}
