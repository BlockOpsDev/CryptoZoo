import React, { ReactChild } from 'react';
import cx from 'classnames';

export interface CardProps {
  title?: string;
  layer: number;
  children: ReactChild;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  layer,
  className: _className,
}: CardProps) => {
  const layerClasses: {
    [layer: number]: string;
  } = {
    1: 'bg-layer--1 border-layer--2',
    2: 'bg-layer--2 border-layer--3',
    3: 'bg-layer--3 border-layer--4',
    4: 'bg-layer--4 border-layer--5',
  };

  return (
    <div
      className={cx(
        'rounded-lg border-2 border-solid drop-shadow',
        _className,
        layerClasses[layer]
      )}
    >
      {children || <span>Card Content</span>}
    </div>
  );
};

Card.defaultProps = {
  layer: 2,
};
