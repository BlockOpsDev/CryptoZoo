import React from 'react';
import cx from 'classnames';

import { Skeleton } from '../Skeleton';
import Variants from 'tailwind-config/variants';

export interface ButtonProps {
  title: string;
  loading: boolean;
  variant: Variants;
  onClick: () => void;
}

export const variantClasses = {
  [Variants.Primary]: ['bg-primary', 'active:bg-primary--dark'],
  [Variants.Success]: ['bg-success', 'active:bg-success--dark'],
  [Variants.Error]: ['bg-error', 'active:bg-error--dark'],
  [Variants.Warn]: ['bg-warn', 'active:bg-warn--dark'],
};

export const Button: React.FC<ButtonProps> = ({
  title,
  loading,
  variant,
  onClick,
}: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={cx(
        'text-primary-text py-2 px-4 rounded-lg drop-shadow',
        ...variantClasses[variant],
      )}
    >
      <Skeleton shapeClasses="w-14 h-3" loading={loading}>
        <span>{title}</span>
      </Skeleton>
    </button>
  );
};
