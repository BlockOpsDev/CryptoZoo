import React, { ReactChild, useState } from 'react';
import cx from 'classnames';
import { FaChevronRight } from 'react-icons/fa';

export interface DropdownProps {
  dropdownContent: ReactChild,
}

export const Dropdown: React.FC<DropdownProps> = ({ dropdownContent }: DropdownProps) => {
  const [open, setOpen] = useState(false);
  const toggleOpen = () => setOpen(prevOpen => !prevOpen);

  return (
    <div className="text-primary-text">
      <button onClick={toggleOpen} className="bg-secondary rounded-md py-1 px-3">
        <div className="flex gap-2 items-center">
          <span>Dropdown</span>
          <FaChevronRight className={cx('rotate-90 transition-transform', { '-rotate-90': open })} />
        </div>
      </button>
      <div className={cx(' bg-layer--5 rounded-md max-w-[50vw]', {'hidden': !open})}>
        {dropdownContent || 'List Content'}
      </div>
    </div>
  );
};

Dropdown.defaultProps = {
  dropdownContent: (
    <ul>
      <li>Item 1</li>
      <li>Item 2</li>
    </ul>
  )
}
