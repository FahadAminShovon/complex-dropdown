'use client';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import React from 'react';
import { useDropDownContext } from './DropDownContextProvider';
import type {
  DropDownDataType,
  MenuSubMenuHandlerProps,
  ObjectType,
} from './select.types';

type SearchByFn<T extends ObjectType> = (obj: {
  option: T;
  index: number;
  search: string;
}) => boolean;

type GroupByFn<T extends ObjectType> = (option: T) => string;
export type DropDownItemsWrapperProps<
  TData extends ObjectType,
  TOption extends DropDownDataType<TData>,
> = {
  options: TOption[];
  getOptionKey: (option: TOption) => string;
  groupBy?: GroupByFn<TOption>;
  renderMenu: (menu: TOption | null) => React.ReactNode;
  renderGroupText?: (group: string) => React.ReactNode;
  renderItem: (_obj: {
    option: TOption;
    isSelected: boolean;
  }) => React.ReactNode;
} & (
  | {
      search: true;
      searchBy: SearchByFn<TOption>;
    }
  | {
      search?: false | never;
    }
);

type DropDownItemProps<
  TData extends ObjectType,
  TOption extends DropDownDataType<TData>,
> = Pick<
  DropDownItemsWrapperProps<TData, TOption>,
  'options' | 'getOptionKey' | 'renderItem'
> & {
  onItemClick: (option: TOption) => void;
  isSelectedFn: (option: TOption) => boolean;
} & MenuSubMenuHandlerProps<TData, TOption> & {
    fRef?: React.Ref<HTMLDivElement>;
  };

const dropdownItemCommonClassName = 'absolute top-0 left-0 right-0 w-full';

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
  ...props
}: DropDownItemsWrapperProps<TData, TOption> &
  Pick<
    DropDownItemProps<TData, TOption>,
    'onItemClick' | 'isSelectedFn' | 'onSubMenuContainerClick' | 'onGoBackClick'
  >) => {
  const [search, setSearch] = useState('');
  const { menu } = useDropDownContext();
  const deferredSearch = useDeferredValue(search);
  const { closeDropDown } = useDropDownContext();
  const parentRef = React.useRef<HTMLDivElement>(null);
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

  const groupIndexes = useMemo(() => {
    const groupIndexSet = new Set<number>();
    if (Array.isArray(groupedOptions)) {
      return groupIndexSet;
    }

    let counter = 0;
    for (const group of Object.keys(groupedOptions)) {
      groupIndexSet.add(counter);
      // +1 for the group label
      counter += groupedOptions[group].length + 1;
    }

    return groupIndexSet;
  }, [groupedOptions]);

  const flatOptions = useMemo(() => {
    if (Array.isArray(groupedOptions)) {
      return groupedOptions;
    }

    const flatOptions = [];
    for (const group of Object.keys(groupedOptions)) {
      flatOptions.push({ label: group, value: group });
      flatOptions.push(...groupedOptions[group]);
    }

    return flatOptions as TOption[];
  }, [groupedOptions]);

  const rowVirtualizer = useVirtualizer({
    count: flatOptions.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35,
  });

  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        sideOffset={5}
        onPointerDownOutside={(e) => {
          e.preventDefault();
          closeDropDown();
        }}
        className="rounded-sm overflow-clip shadow-sm"
      >
        {props.search && (
          <DropdownMenuPrimitive.Item asChild>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full"
            />
          </DropdownMenuPrimitive.Item>
        )}
        {menu && (
          <DropdownMenuPrimitive.Item asChild>
            <button onClick={onGoBackClick} type="button" className="block">
              {renderMenu(menu as TOption)}
            </button>
          </DropdownMenuPrimitive.Item>
        )}
        {/* The scrollable element for your list */}
        <div
          className="bg-red-300 h-[400px] overflow-auto min-w-40"
          ref={parentRef}
        >
          {/* The large inner element to hold all of the items */}
          <div
            className="w-full relative"
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
            }}
          >
            {/* Only the visible items in the virtualizer, manually positioned to be in view */}
            {rowVirtualizer.getVirtualItems().map((virtualItem) => {
              const option = flatOptions[virtualItem.index];
              if (groupIndexes.has(virtualItem.index)) {
                return (
                  <DropdownMenuPrimitive.Label
                    asChild={!!renderGroupText}
                    key={virtualItem.key}
                    data-index={virtualItem.index}
                    ref={rowVirtualizer.measureElement}
                    className={dropdownItemCommonClassName}
                    style={{
                      transform: `translateY(${
                        virtualItem.start - rowVirtualizer.options.scrollMargin
                      }px)`,
                    }}
                  >
                    {renderGroupText?.(option.label) ?? option.label}
                  </DropdownMenuPrimitive.Label>
                );
              }

              const isOptionSelected = isSelectedFn(option);
              return (
                <DropdownMenuPrimitive.Item
                  ref={rowVirtualizer.measureElement}
                  key={virtualItem.key}
                  data-index={virtualItem.index}
                  className={dropdownItemCommonClassName}
                  style={{
                    transform: `translateY(${
                      virtualItem.start - rowVirtualizer.options.scrollMargin
                    }px)`,
                  }}
                  onClick={() => {
                    if (option.subMenu) {
                      onSubMenuContainerClick({
                        menu: option,
                        subMenu: option.subMenu as any,
                      });
                      return;
                    }
                    handleItemClick({ ...option, menu });
                  }}
                  asChild
                >
                  {renderItem({ option, isSelected: isOptionSelected })}
                </DropdownMenuPrimitive.Item>
              );
            })}
          </div>
        </div>

        <DropdownMenuPrimitive.Arrow />
      </DropdownMenuPrimitive.Content>
    </DropdownMenuPrimitive.Portal>
  );
};

export default DropDownItemsWrapper;
