import React, { ReactChildren } from 'react';

export interface CardProps {
  title?: string;
  layer: number;
  children: ReactChildren;
}

export const Card: React.FC<CardProps> = ({ children }: CardProps) => {
  return (
    <div className="text-primary-text border-layer--4 bg-layer--2 relative flex flex-col gap-2 rounded-lg border-2 border-solid p-2 drop-shadow-md">
      <div className="">{children}</div>
    </div>
  );
};
