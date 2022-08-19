import React, { ReactChild, useState } from 'react';
import cx from 'classnames';

export type Option = {
  title: string;
  value: string | number | readonly string[] | undefined;
}

export interface DropdownProps {
  layer: 1 | 2 | 3 | 4;
  children: {
    buttonContent?: ReactChild,
    listContent?: ReactChild,
  }
}

export const Dropdown: React.FC<DropdownProps> = ({ children }: DropdownProps) => {
  const [open, setOpen] = useState(false);
  const toggleOpen = () => setOpen(prevOpen => !prevOpen);

  return (
    <div className="relative text-primary-text">
      <button onClick={toggleOpen}>
        {children.buttonContent || 'Button'}
      </button>
      <div className={cx({'hidden': !open})}>
        {children.listContent || 'List Content'}
      </div>
    </div>
  );
};

Dropdown.defaultProps = {
  layer: 4,
  children: {}
}
