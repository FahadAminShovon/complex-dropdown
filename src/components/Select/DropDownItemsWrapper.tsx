'use client';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
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
              className="w-full"
            />
          </DropdownMenuPrimitive.Item>
        )}
        {menu && (
          <DropdownMenuPrimitive.Item asChild onClick={onGoBackClick}>
            {renderMenu ? (
              renderMenu(menu as TOption)
            ) : (
              <button type="button" className="block">
                &larr; back
              </button>
            )}
          </DropdownMenuPrimitive.Item>
        )}
        {virtualize && (
          <VirtualDropdownItems
            groupedOptions={groupedOptions}
            renderItem={renderItem}
            isSelectedFn={isSelectedFn}
            onSubMenuContainerClick={onSubMenuContainerClick}
            onItemClick={handleItemClick}
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
          />
        )}
        <DropdownMenuPrimitive.Arrow />
      </DropdownMenuPrimitive.Content>
    </DropdownMenuPrimitive.Portal>
  );
};

export default DropDownItemsWrapper;
