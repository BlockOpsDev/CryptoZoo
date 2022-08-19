import React from 'react';
import cx from 'classnames';

export type Option = {
  title: string;
  value: string | number | readonly string[] | undefined;
}

export interface DropdownProps {
  options: Option[];
  className?: string;
  layer: 1 | 2 | 3 | 4;
}

export const Dropdown: React.FC<DropdownProps> = ({ layer, options, className: _className }: DropdownProps) => {
  const bgClass = {
    1: 'bg-layer--1',
    2: 'bg-layer--2',
    3: 'bg-layer--3',
    4: 'bg-layer--4',
  }[layer]

  const dropdownRef = React.useRef<null|HTMLSelectElement>(null);

  const openDropdown = () => {
    console.log(dropdownRef.current)
    if (dropdownRef.current !== null)
      dropdownRef.current.click();
  }

  return (
    <div className="relative">
      <label htmlFor="dropdown" onClick={openDropdown}>label</label>
      <select ref={dropdownRef} id='dropdown' className={cx('rounded-md p-2 appearance-none', bgClass, _className)}>
        {options.map((option, index) => (
          <option value={option.value} key={index}>{option.title}</option>
        ))}
      </select>
    </div>
  );
};
