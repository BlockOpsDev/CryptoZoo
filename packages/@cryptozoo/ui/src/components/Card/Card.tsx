import React, { ReactChildren } from 'react';

export interface CardProps {
  title?: string;
  layer: number;
  children: ReactChildren;
}

export const Card: React.FC<CardProps> = ({
  children,
}: CardProps) => {
  return (
    <div className="text-primary-text flex flex-col p-2 gap-2 rounded-lg border-solid border-2 border-layer--4 bg-layer--2 relative drop-shadow-md">
      <div className="">{children}</div>
    </div>
  );
};
