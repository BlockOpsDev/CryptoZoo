import React, { ReactChild } from 'react';
import cx from 'classnames';

export interface SkeletonProps {
  shapeClasses: string;
  loading: boolean;
  children: ReactChild;
}

export const Skeleton: React.FC<SkeletonProps> = ({ children, shapeClasses: classes, loading }: SkeletonProps) => {
  return (
    <>
      <div className={cx(
        "animate-pulse bg-secondary-text rounded-full " + classes,
        { 'hidden': !loading }
      )}>
      </div>

      <div className={cx({ 'hidden': loading })}>
        {children}
      </div>
    </>
  );
};