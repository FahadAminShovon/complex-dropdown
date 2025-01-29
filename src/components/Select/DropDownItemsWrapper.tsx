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
} & MenuSubMenuHandlerProps<TData, TOption>;

const DropDownItems = <
  TData extends ObjectType,
  TOption extends DropDownDataType<TData>,
>({
  options,
  getOptionKey,
  onItemClick: handleItemClick,
  isSelectedFn,
  onSubMenuContainerClick,
  renderItem,
}: DropDownItemProps<TData, TOption>) => {
  const { menu } = useDropDownContext();
  return (
    <>
      {options.map((option) => {
        const isOptionSelected = isSelectedFn(option);
        return (
          <DropdownMenuPrimitive.Item
            key={getOptionKey(option)}
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
    </>
  );
};

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

  const itemCount = Array.isArray(groupedOptions)
    ? groupedOptions.length
    : Object.keys(groupedOptions).reduce((acc, group) => {
        return acc + groupedOptions[group].length;
      }, 0) + Object.keys(groupedOptions).length;

  const rowVirtualizer = useVirtualizer({
    count: itemCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35,
  });

  const _items = rowVirtualizer.getVirtualItems();

  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        sideOffset={5}
        onPointerDownOutside={(e) => {
          e.preventDefault();
          closeDropDown();
        }}
      >
        {props.search && (
          <DropdownMenuPrimitive.Item asChild>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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
        <div className="bg-red-300 h-[400px] overflow-auto" ref={parentRef}>
          <div
            className="w-full relative"
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
            }}
          >
            {Array.isArray(groupedOptions) ? (
              <DropDownItems
                onSubMenuContainerClick={onSubMenuContainerClick}
                options={groupedOptions}
                getOptionKey={getOptionKey}
                onItemClick={handleItemClick}
                isSelectedFn={isSelectedFn}
                onGoBackClick={onGoBackClick}
                renderItem={renderItem}
              />
            ) : (
              Object.entries(groupedOptions).map(([group, options]) => (
                <React.Fragment key={group}>
                  {group && (
                    <DropdownMenuPrimitive.Label asChild={!!renderGroupText}>
                      {renderGroupText?.(group) ?? group}
                    </DropdownMenuPrimitive.Label>
                  )}
                  <DropDownItems
                    onSubMenuContainerClick={onSubMenuContainerClick}
                    key={group}
                    options={options}
                    getOptionKey={getOptionKey}
                    onItemClick={handleItemClick}
                    isSelectedFn={isSelectedFn}
                    onGoBackClick={onGoBackClick}
                    renderItem={renderItem}
                  />
                </React.Fragment>
              ))
            )}
          </div>
        </div>

        <DropdownMenuPrimitive.Arrow />
      </DropdownMenuPrimitive.Content>
    </DropdownMenuPrimitive.Portal>
  );
};

export default DropDownItemsWrapper;
