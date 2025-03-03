'use client';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { cn } from '../../../lib/utils';
import { useDropDownContext } from './DropDownContextProvider';

export type SelectTriggerProps = {
  renderTrigger: React.ReactNode;
};

const SelectTrigger = ({ renderTrigger }: SelectTriggerProps) => {
  const { toggleDropDown, triggerId } = useDropDownContext();
  return (
    <PopoverPrimitive.Trigger
      className={cn({
        'cursor-pointer border border-gray-300 rounded-md px-3 py-2':
          !renderTrigger,
      })}
      onClick={toggleDropDown}
      asChild={!!renderTrigger}
      data-trigger-id={triggerId}
    >
      {renderTrigger ?? <span>SelectTrigger</span>}
    </PopoverPrimitive.Trigger>
  );
};

export default SelectTrigger;
