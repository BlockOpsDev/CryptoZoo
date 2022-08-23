import React from 'react';
import { Dropdown } from '../Dropdown';

type Option = {
  title: string;
  value: string | boolean | number;
}

export interface SelectProps {
  options: Option[];
}

export const Select: React.FC<SelectProps> = ({ options }: SelectProps) => {
  options;

  const listContent = <ul>
    <li>Test Item</li>
  </ul>

  return (
    <Dropdown listContent={listContent} />
  );
};
