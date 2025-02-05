'use client';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { Command } from 'cmdk';
import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import { useDropDownContext } from './DropDownContextProvider';
import NonVirtualDropdownItems from './NonVirtualDropdownItems';
import VirtualDropdownItems from './VirtualDropdownItems';
import type {
  DropDownDataType,
  DropDownItemProps,
  DropDownItemsWrapperProps,
  ObjectType,
  SearchByFn,
} from './select.types';

const DropDownItemsWrapper = <
  TData extends ObjectType,
  TOption extends DropDownDataType<TData>,
>({
  options,
  getOptionKey,
  onItemClick: handleItemClick,
  isSelectedFn,
  onSubMenuContainerClick,
  onGoBackClick,
  renderMenu,
  renderItem,
  renderGroupText,
  virtualize,
  optionsContainerClassName,
  searchInputClassName,
  align = 'center',
  ...props
}: DropDownItemsWrapperProps<TData, TOption> &
  Pick<
    DropDownItemProps<TData, TOption>,
    'onItemClick' | 'isSelectedFn' | 'onSubMenuContainerClick' | 'onGoBackClick'
  >) => {
  const [search, setSearch] = useState('');
  const { menu, isOpen } = useDropDownContext();
  const deferredSearch = useDeferredValue(search);
  const { closeDropDown } = useDropDownContext();

  const searchFnRef = useRef<SearchByFn<TOption> | null>(null);

  // doesn't expect searchBy function to be memoized
  useEffect(() => {
    if (props.search) {
      searchFnRef.current = props.searchBy;
    } else {
      searchFnRef.current = null;
    }
  });

  const filteredOptions = useMemo(() => {
    if (!props.search) return options;
    if (!deferredSearch) return options;

    return options.filter((option, index) => {
      if (searchFnRef.current) {
        return searchFnRef.current({ option, index, search: deferredSearch });
      }
      return false;
    });
  }, [deferredSearch, options, props.search]);

  const groupedOptions = useMemo(() => {
    const groupByFn = props.groupBy;
    if (!groupByFn) return filteredOptions;
    return filteredOptions.reduce(
      (acc, option) => {
        const group = groupByFn(option);
        acc[group] = [...(acc[group] || []), option];
        return acc;
      },
      {} as Record<string, TOption[]>,
    );
  }, [filteredOptions, props.groupBy]);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      // focus the input after the dropdown is open
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  }, [isOpen]);

  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        sideOffset={align === 'center' ? 5 : 2}
        onPointerDownOutside={(e) => {
          e.preventDefault();
          closeDropDown();
        }}
        className={optionsContainerClassName}
        align={align}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <Command>
          <Command.List>
            {props.search && (
              <Command.Input
                value={search}
                onValueChange={setSearch}
                className={searchInputClassName}
                autoFocus
              />
            )}
            {menu && (
              <Command.Item asChild onSelect={onGoBackClick}>
                {renderMenu ? (
                  renderMenu(menu as TOption)
                ) : (
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-semibold text-sm uppercase tracking-wide block w-full text-left"
                  >
                    &larr; back
                  </button>
                )}
              </Command.Item>
            )}
            {virtualize && (
              <VirtualDropdownItems
                groupedOptions={groupedOptions}
                renderItem={renderItem}
                isSelectedFn={isSelectedFn}
                onSubMenuContainerClick={onSubMenuContainerClick}
                onItemClick={handleItemClick}
                renderGroupText={renderGroupText}
              />
            )}
            {!virtualize && (
              <NonVirtualDropdownItems
                groupedOptions={groupedOptions}
                onSubMenuContainerClick={onSubMenuContainerClick}
                onItemClick={handleItemClick}
                isSelectedFn={isSelectedFn}
                renderItem={renderItem}
                getOptionKey={getOptionKey}
                renderGroupText={renderGroupText}
              />
            )}
            {align === 'center' && (
              <PopoverPrimitive.Arrow className="fill-white dark:fill-gray-800 stroke-gray-200 dark:stroke-gray-700" />
            )}
          </Command.List>
        </Command>
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  );
};

export default DropDownItemsWrapper;
