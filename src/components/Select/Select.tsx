'use client';
import * as PopoverPrimitive from '@radix-ui/react-popover';

import { useEffect, useState } from 'react';
import { DropDownContextProvider } from './DropDownContextProvider';
import type { MultiSelectProps } from './MultiSelect';
import MultiSelect from './MultiSelect';
import type { SingleSelectProps } from './SingleSelect';
import SingleSelect from './SingleSelect';
import type {
  CommonSelectProps,
  DropDownDataType,
  MenuSubMenuHandlerProps,
  ObjectType,
} from './select.types';

export type SelectProps<
  TData extends ObjectType,
  TOption extends DropDownDataType<TData>,
> = CommonSelectProps<TData, TOption> &
  (SingleSelectProps<TData, TOption> | MultiSelectProps<TData, TOption>) & {
    label?: React.ReactNode;
  };

const Select = <
  TData extends ObjectType,
  TOption extends DropDownDataType<TData>,
>({
  options,
  label,
  ...props
}: SelectProps<TData, TOption>) => {
  const [selectedOptions, setSelectedOptions] = useState<{
    menu: TOption | null;
    subMenu: TOption[];
  }>({
    menu: null,
    subMenu: options,
  });
  const [isOpen, setIsOpen] = useState(false);
  const openDropDown = () => setIsOpen(true);
  const closeDropDown = () => setIsOpen(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedOptions({
        menu: null,
        subMenu: options,
      });
    }
  }, [isOpen, options]);

  const onSubMenuContainerClick: MenuSubMenuHandlerProps<
    TData,
    TOption
  >['onSubMenuContainerClick'] = ({ menu, subMenu }) => {
    setSelectedOptions({
      menu,
      subMenu,
    });
  };

  const onGoBackClick: MenuSubMenuHandlerProps<
    TData,
    TOption
  >['onGoBackClick'] = () => {
    setSelectedOptions({
      menu: null,
      subMenu: options,
    });
  };

  return (
    <DropDownContextProvider
      menu={selectedOptions.menu}
      subMenu={selectedOptions.subMenu}
      isOpen={isOpen}
      openDropDown={openDropDown}
      closeDropDown={closeDropDown}
    >
      <div className="w-full space-y-1">
        {label}
        <PopoverPrimitive.Root open={isOpen}>
          {props.multiple && (
            <MultiSelect
              {...props}
              // current options
              options={selectedOptions.subMenu}
              // all options
              allOptions={options}
              onSubMenuContainerClick={onSubMenuContainerClick}
              onGoBackClick={onGoBackClick}
            />
          )}
          {!props.multiple && (
            <SingleSelect
              {...props}
              options={selectedOptions.subMenu}
              onSubMenuContainerClick={onSubMenuContainerClick}
              onGoBackClick={onGoBackClick}
            />
          )}
        </PopoverPrimitive.Root>
      </div>
    </DropDownContextProvider>
  );
};

export default Select;
