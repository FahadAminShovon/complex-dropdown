import { useVirtualizer } from '@tanstack/react-virtual';
import React, { useMemo } from 'react';
import { DropDownItem } from './DropdownItem';
import DropdownLabel from './DropdownLabel';
import type {
  DropDownDataType,
  ObjectType,
  VirtualItemsProps,
} from './select.types';

const dropdownItemCommonClassName = 'absolute top-0 left-0 right-0 w-full';
export const itemsWrapperClassName =
  'max-h-[440px] min-h-[320px] overflow-auto min-w-60';

const VirtualDropdownItems = <
  TData extends ObjectType,
  TOption extends DropDownDataType<TData>,
>({
  groupedOptions,
  renderItem,
  isSelectedFn,
  renderGroupText,
  ...props
}: VirtualItemsProps<TData, TOption>) => {
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
    <div className={itemsWrapperClassName} ref={parentRef}>
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
              <DropdownLabel
                key={virtualItem.key}
                fRef={rowVirtualizer.measureElement}
                // we know that the label is a string because we are using the groupBy function
                label={option.label as string}
                dataIndex={virtualItem.index}
                renderGroupText={renderGroupText}
                className={dropdownItemCommonClassName}
                style={{
                  transform: `translateY(${
                    virtualItem.start - rowVirtualizer.options.scrollMargin
                  }px)`,
                }}
              />
            );
          }
          const isOptionSelected = isSelectedFn(option);
          return (
            <DropDownItem
              fRef={rowVirtualizer.measureElement}
              key={virtualItem.key}
              dataIndex={virtualItem.index}
              className={dropdownItemCommonClassName}
              isOptionSelected={isOptionSelected}
              option={option}
              renderItem={renderItem}
              style={{
                transform: `translateY(${
                  virtualItem.start - rowVirtualizer.options.scrollMargin
                }px)`,
              }}
              {...props}
            />
          );
        })}
      </div>
    </div>
  );
};

export default VirtualDropdownItems;
