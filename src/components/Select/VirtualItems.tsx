import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { useVirtualizer } from '@tanstack/react-virtual';
import React, { useMemo } from 'react';
import { useDropDownContext } from './DropDownContextProvider';
import type {
  DropDownDataType,
  DropDownItemProps,
  DropDownItemsWrapperProps,
  ObjectType,
} from './select.types';

type VirtualItemsProps<
  TData extends ObjectType,
  TOption extends DropDownDataType<TData>,
> = {
  groupedOptions: TOption[] | Record<string, TOption[]>;
} & Pick<
  DropDownItemProps<TData, TOption>,
  'renderItem' | 'isSelectedFn' | 'onSubMenuContainerClick' | 'onItemClick'
> &
  Pick<DropDownItemsWrapperProps<TData, TOption>, 'renderGroupText'>;

const dropdownItemCommonClassName = 'absolute top-0 left-0 right-0 w-full';

const VirtualItems = <
  TData extends ObjectType,
  TOption extends DropDownDataType<TData>,
>({
  groupedOptions,
  renderItem,
  isSelectedFn,
  onSubMenuContainerClick,
  renderGroupText,
  onItemClick: handleItemClick,
}: VirtualItemsProps<TData, TOption>) => {
  const { menu } = useDropDownContext();
  const parentRef = React.useRef<HTMLDivElement>(null);
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
  );
};

export default VirtualItems;
