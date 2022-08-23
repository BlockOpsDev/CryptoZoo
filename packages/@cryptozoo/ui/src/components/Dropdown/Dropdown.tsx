import React, { ReactChild, useState } from 'react';
import cx from 'classnames';
import { FaChevronRight } from 'react-icons/fa';

export interface DropdownProps {
  listContent: ReactChild,
}

export const Dropdown: React.FC<DropdownProps> = ({ listContent }: DropdownProps) => {
  const [open, setOpen] = useState(false);
  const toggleOpen = () => setOpen(prevOpen => !prevOpen);

  return (
    <div className="text-primary-text">
      <button onClick={toggleOpen} className="">
        <div className="flex gap-2 items-center">
          <span>Dropdown</span>
          <FaChevronRight className={cx('rotate-90 transition-transform', { '-rotate-90': open })} />
        </div>
      </button>
      <div className={cx({'hidden': !open})}>
        {listContent || 'List Content'}
      </div>
    </div>
  );
};

Dropdown.defaultProps = {
  listContent: (
    <ul>
      <li>Item 1</li>
      <li>Item 2</li>
    </ul>
  )
}
