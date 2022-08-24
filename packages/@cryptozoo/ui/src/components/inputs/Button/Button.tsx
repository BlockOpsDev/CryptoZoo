import React, { ReactChild } from 'react';
import cx from 'classnames';

import { Skeleton } from '../../cards/Skeleton';
import Variants from 'tailwind-config/variants';

export interface ButtonProps {
  loading: boolean;
  variant: Variants;
  children: ReactChild;
  onClick: () => void;
}

export const variantClasses = {
  [Variants.Primary]: ['bg-primary', 'active:bg-primary--dark'],
  [Variants.Success]: ['bg-success', 'active:bg-success--dark'],
  [Variants.Error]: ['bg-error', 'active:bg-error--dark'],
  [Variants.Warn]: ['bg-warn', 'active:bg-warn--dark'],
};

export const Button: React.FC<ButtonProps> = ({
  loading,
  variant,
  children,
  onClick,
}: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={cx(
        'text-primary-text rounded-lg py-2 px-4 drop-shadow',
        ...variantClasses[variant]
      )}
    >
      <Skeleton shapeClasses="w-14 h-3" loading={loading}>
        {children || <span>Button</span>}
      </Skeleton>
    </button>
  );
};
