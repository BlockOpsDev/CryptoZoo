import React, { ReactChild } from 'react';
import cx from 'classnames';

import { Skeleton } from '../../components/Skeleton';
import Variants from 'tailwind-config/variants';

export interface ButtonProps {
  loading: boolean;
  variant: Variants;
  children: ReactChild;
  onClick: () => void;
}

export const variantClasses = {
  [Variants.Primary]: 'bg-primary active:bg-primary--dark',
  [Variants.Success]: 'bg-success active:bg-success--dark',
  [Variants.Error]: 'bg-error active:bg-error--dark',
  [Variants.Warn]: 'bg-warn active:bg-warn--dark',
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
        'button',
        variantClasses[variant]
      )}
    >
      <Skeleton shapeClasses="w-14 h-3" loading={loading}>
        {children || <span>Button</span>}
      </Skeleton>
    </button>
  );
};
