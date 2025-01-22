'use client';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { useState } from 'react';
import type { MultiSelectProps } from './MultiSelect';
import MultiSelect from './MultiSelect';
import type { SingleSelectProps } from './SingleSelect';
import SingleSelect from './SingleSelect';
import type {
  CommonSelectProps,
  DropDownDataType,
  ObjectType,
} from './select.types';

type SelectProps<
  TData extends ObjectType,
  TOption extends DropDownDataType<TData>,
> = CommonSelectProps<TData, TOption> &
  (SingleSelectProps<TData, TOption> | MultiSelectProps<TData, TOption>);

const Select = <
  TData extends ObjectType,
  TOption extends DropDownDataType<TData>,
>({
  options,
  ...props
}: SelectProps<TData, TOption>) => {
  const [selectedOptions, setSelectedOptions] = useState<{
    menu: TOption | null;
    subMenu: TOption[];
  }>({
    menu: null,
    subMenu: options,
  });

  const onSubMenuContainerClick = (option: TOption) => {
    console.log('option', option);
  };

  const onGoBackClick = () => {
    console.log('onGoBackClick');
  };
  return (
    <DropdownMenuPrimitive.Root>
      {props.multiple && (
        <MultiSelect
          {...props}
          options={selectedOptions.subMenu}
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
    </DropdownMenuPrimitive.Root>
  );
};

export default Select;
