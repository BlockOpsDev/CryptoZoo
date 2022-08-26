import React, { ReactChild, useState } from 'react';
import cx from 'classnames';
import { FaChevronRight } from 'react-icons/fa';
import Popup from 'reactjs-popup';

// For popup behavior see https://react-popup.elazizi.com/component-api

export interface DropdownProps {
  dropdownContent: ReactChild;
}

export const Dropdown: React.FC<DropdownProps> = ({
  dropdownContent,
}: DropdownProps) => {
  const [open, setOpen] = useState(false);

  const triggerButton = (
    <button className="bg-secondary rounded-md py-1 px-3">
      <div className="flex items-center gap-2">
        <span>Dropdown</span>
        <FaChevronRight
          className={cx('rotate-90 transition-transform', {
            '-rotate-90': open,
          })}
        />
      </div>
    </button>
  );

  const dropdownContainer = (
    <div
      className={cx(
        'bg-secondary text-primary-text max-w-[50vw] rounded-md p-2'
      )}
    >
      {dropdownContent || 'List Content'}
    </div>
  );

  return (
    <div className="text-primary-text">
      <Popup
        trigger={triggerButton}
        position="bottom left"
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        arrow={false}
        offsetY={5}
      >
        {dropdownContainer}
      </Popup>
    </div>
  );
};

Dropdown.defaultProps = {
  dropdownContent: (
    <ul>
      <li>Item 1</li>
      <li>Item 2</li>
    </ul>
  ),
};
