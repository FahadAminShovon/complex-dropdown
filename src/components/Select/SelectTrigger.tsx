'use client';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import type React from 'react';

export type SelectTriggerProps = {
  renderTrigger?: React.ReactNode;
};

const SelectTrigger = ({ renderTrigger }: SelectTriggerProps) => {
  return (
    <DropdownMenuPrimitive.Trigger className="cursor-pointer border border-gray-300 rounded-md px-3 py-2">
      {renderTrigger ?? <span>SelectTrigger</span>}
    </DropdownMenuPrimitive.Trigger>
  );
};

export default SelectTrigger;
