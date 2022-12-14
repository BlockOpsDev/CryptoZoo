import React from 'react';
import Image from 'next/image';
import { Card } from '../Card';

export type Token = {
  name: string;
  symbol: string;
  imageSrc: string;
  address: string;
};

export interface TokenSelectorProps {
  tokens: Token[];
  onTokenSelected: (token: Token) => void;
}

export const TokenSelector: React.FC<TokenSelectorProps> = ({
  tokens,
  onTokenSelected,
}: TokenSelectorProps) => {
  return (
    <Card layer={3} className="text-primary-text h-full p-2">
      <div className="flex h-full flex-col gap-2">
        <h1>Select a token</h1>

        <input
          type="text"
          name=""
          id=""
          className="input"
          placeholder="Search name or paste address"
        />

        <Card layer={4} className="flex-grow overflow-auto">
          <div className="flex flex-col">
            {tokens.map((token, index) => (
              <div
                className="hover:bg-layer--5 flex cursor-pointer items-center gap-4 py-2 px-4"
                key={index}
                onClick={() => onTokenSelected(token)}
              >
                <div className="relative h-8 w-8 overflow-clip rounded-full">
                  <Image
                    src={token.imageSrc}
                    layout="fill"
                    alt={token.name + ' Logo'}
                    objectFit="contain"
                  />
                </div>
                <div>
                  <p className="block leading-tight">{token.symbol}</p>
                  <p className="text-secondary-text text-xs">{token.name}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </Card>
  );
};
