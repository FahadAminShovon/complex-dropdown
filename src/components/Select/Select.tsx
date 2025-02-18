'use client';
import * as PopoverPrimitive from '@radix-ui/react-popover';

import { useState } from 'react';
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

/**
 * A flexible select component that supports both single and multi-select functionality with optional grouping,
 * virtualization, and nested menu structures.
 *
 * @example
 * // Basic single select
 * const [value, setValue] = useState<Option | null>(null);
 *
 * <Select
 *   options={options}
 *   value={value}
 *   setValue={setValue}
 *   getOptionKey={(option) => option.id}
 *   renderItem={({ option, isSelected }) => (
 *     <div className={isSelected ? 'selected' : ''}>
 *       {option.label}
 *     </div>
 *   )}
 * />
 *
 * @example
 * // Multi-select with groups and search
 * const [values, setValues] = useState<Option[]>([]);
 *
 * <Select
 *   multiple
 *   options={options}
 *   values={values}
 *   setValues={setValues}
 *   getOptionKey={(option) => option.id}
 *   groupBy={(option) => option.category}
 *   search
 *   searchBy={({ option, search }) =>
 *     option.label.toLowerCase().includes(search.toLowerCase())
 *   }
 *   renderItem={({ option, isSelected }) => (
 *     <div className={isSelected ? 'selected' : ''}>
 *       {option.label}
 *     </div>
 *   )}
 *   renderGroupText={(group) => (
 *     <div className="group-header">{group}</div>
 *   )}
 * />
 *
 * @template TData - Base object type for the options
 * @template TOption - Extended option type that can include menu/submenu structure
 *
 * @param props - Component props
 * @param props.options - Array of options to display in the select
 * @param props.getOptionKey - Function to get a unique key for each option
 * @param props.renderItem - Function to render each option item
 * @param props.label - Optional label for the select
 * @param props.multiple - Enable multi-select mode
 * @param props.value - Selected value (for single select)
 * @param props.values - Selected values (for multi select)
 * @param props.setValue - Callback to update selected value (single select)
 * @param props.setValues - Callback to update selected values (multi select)
 * @param props.groupBy - Optional function to group options
 * @param props.renderGroupText - Optional function to render group headers
 * @param props.search - Enable search functionality
 * @param props.searchBy - Function to determine search matches
 * @param props.virtualize - Enable virtual scrolling for large lists
 * @param props.renderMenu - Optional function to render custom menu UI
 * @param props.align - Popover alignment ('start' | 'center' | 'end')
 * @param props.allowSelectAll - Enable select all functionality (multi-select only)
 * @param props.optionsContainerClassName - Custom class for the options container
 * @param props.searchInputClassName - Custom class for the search input
 *
 * @returns A Select component instance
 */
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
  const openDropDown = () => {
    setIsOpen(true);
    setSelectedOptions({
      menu: null,
      subMenu: options,
    });
  };
  const closeDropDown = () => {
    setIsOpen(false);
    setSelectedOptions({
      menu: null,
      subMenu: options,
    });
  };

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
