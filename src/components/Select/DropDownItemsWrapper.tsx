'use client';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { Command } from 'cmdk';
import { useDeferredValue, useEffect, useMemo, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { useDropDownContext } from './DropDownContextProvider';
import NonVirtualDropdownItems from './NonVirtualDropdownItems';
import VirtualDropdownItems from './VirtualDropdownItems';
import { getFilterOptions } from './filterOptions';
import { getFilterOptionsAsync } from './filterOptionsAsync';

import type {
  AllowSelectAllProps,
  DropDownDataType,
  DropDownItemProps,
  DropDownItemsWrapperProps,
  ObjectType,
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
  > &
  AllowSelectAllProps) => {
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState<TOption[]>(options);
  const { menu, triggerId } = useDropDownContext();
  const [debouncedSearch] = useDebounce(
    search,
    props.search ? props.debounceTime || 0 : 0,
  );
  const deferredSearch = useDeferredValue(debouncedSearch);
  const { closeDropDown } = useDropDownContext();

  const searchKeysString = (() => {
    if (props.search) {
      if (!menu) {
        // if parent menu is not present, we need to search the submenu
        return JSON.stringify([
          ...props.searchKeys,
          ...props.searchSubMenuKeys,
        ]);
      }
      return JSON.stringify(props.searchKeys);
    }
    return JSON.stringify([]);
  })();

  const isAsyncSearch = props.search && props.asyncSearch;

  // Handle sync filtering
  useEffect(() => {
    if (!props.search) {
      setFilteredOptions(options);
      return;
    }

    if (isAsyncSearch) {
      // Skip sync filtering if async search is enabled
      return;
    }

    if (!deferredSearch) {
      setFilteredOptions(options);
      return;
    }

    const searchKeys = JSON.parse(searchKeysString);

    const filtered = getFilterOptions(options, deferredSearch, searchKeys);
    setFilteredOptions(filtered);
  }, [deferredSearch, isAsyncSearch, props.search, searchKeysString, options]);

  // Handle async filtering
  useEffect(() => {
    if (!isAsyncSearch) {
      return;
    }

    if (!deferredSearch) {
      setFilteredOptions(options);
      return;
    }

    const searchKeys = JSON.parse(searchKeysString);

    setIsLoading(true);
    getFilterOptionsAsync(options, deferredSearch, searchKeys)
      .then((filtered) => {
        setFilteredOptions(filtered);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [deferredSearch, isAsyncSearch, options, searchKeysString]);

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

  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        sideOffset={align === 'center' ? 5 : 2}
        onPointerDownOutside={(e) => {
          if (e.target instanceof HTMLElement) {
            if (e.target.getAttribute('data-trigger-id') !== triggerId) {
              e.preventDefault();
              closeDropDown();
            }
          }
        }}
        className={optionsContainerClassName}
        align={align}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <Command>
          <Command.List>
            {props.allowSelectAll && (
              <Command.Group>
                <Command.Item
                  asChild
                  onSelect={props.onSelectAll}
                  className="block"
                >
                  {renderItem({
                    type: 'selectAll',
                    isSelected: props.isAllSelected,
                  })}
                </Command.Item>
                <Command.Item
                  asChild
                  onSelect={props.onClearAll}
                  className="block"
                >
                  {renderItem({
                    type: 'clearAll',
                    isNoItemSelected: props.isNoItemSelected,
                  })}
                </Command.Item>
                <Command.Separator />
              </Command.Group>
            )}
            {props.search && (
              <>
                <Command.Item asChild>
                  <div className="relative">
                    <input
                      value={search}
                      onChange={(e) => {
                        e.preventDefault();
                        setSearch(e.target.value);
                      }}
                      className={searchInputClassName}
                      // biome-ignore lint/a11y/noAutofocus: <explanation>
                      autoFocus
                    />
                    {isLoading && (
                      <div className="absolute right-2 top-1/2 -translate-y-1/2">
                        {/* Add your loading spinner here */}
                        Loading...
                      </div>
                    )}
                  </div>
                </Command.Item>
                <Command.Separator />
              </>
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
