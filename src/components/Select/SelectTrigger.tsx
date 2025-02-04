'use client';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import type React from 'react';
import { cn } from '../../../lib/utils';
import { useDropDownContext } from './DropDownContextProvider';

export type SelectTriggerProps = {
  renderTrigger?: React.ReactNode;
};

const SelectTrigger = ({ renderTrigger }: SelectTriggerProps) => {
  const { toggleDropDown } = useDropDownContext();
  return (
    <DropdownMenuPrimitive.Trigger
      className={cn({
        'cursor-pointer border border-gray-300 rounded-md px-3 py-2':
          !renderTrigger,
      })}
      onClick={toggleDropDown}
      asChild={!!renderTrigger}
    >
      {renderTrigger ?? <span>SelectTrigger</span>}
    </DropdownMenuPrimitive.Trigger>
  );
};

export default SelectTrigger;
