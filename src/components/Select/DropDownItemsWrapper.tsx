'use client';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import React from 'react';
import { cn } from '../../../lib/utils';
import type { ObjectType } from './select.types';

type SearchByFn<T extends ObjectType> = (obj: {
  option: T;
  index: number;
  search: string;
}) => boolean;

type GroupByFn<T extends ObjectType> = (option: T) => string;
export type DropDownItemsWrapperProps<T extends ObjectType> = {
  options: T[];
  getOptionKey: (option: T) => string;
  groupBy?: GroupByFn<T>;
} & (
  | {
      search: true;
      searchBy: SearchByFn<T>;
    }
  | {
      search?: false | never;
    }
);

type DropDownItemProps<T extends ObjectType> = Pick<
  DropDownItemsWrapperProps<T>,
  'options' | 'getOptionKey'
> & { onItemClick: (option: T) => void; isSelectedFn: (option: T) => boolean };

const DropDownItems = <T extends ObjectType>({
  options,
  getOptionKey,
  onItemClick: handleItemClick,
  isSelectedFn,
}: DropDownItemProps<T>) => {
  return (
    <>
      {options.map((option) => {
        const isOptionSelected = isSelectedFn(option);
        return (
          <DropdownMenuPrimitive.Item
            key={getOptionKey(option)}
            onClick={() => {
              handleItemClick(option);
            }}
            asChild
          >
            <div className={cn({ 'bg-green-200': isOptionSelected })}>
              {JSON.stringify(option)}
            </div>
          </DropdownMenuPrimitive.Item>
        );
      })}
    </>
  );
};

const DropDownItemsWrapper = <T extends ObjectType>({
  options,
  getOptionKey,
  onItemClick: handleItemClick,
  isSelectedFn,
  ...props
}: DropDownItemsWrapperProps<T> &
  Pick<DropDownItemProps<T>, 'onItemClick' | 'isSelectedFn'>) => {
  const [search, setSearch] = useState('');

  const deferredSearch = useDeferredValue(search);

  const searchFnRef = useRef<SearchByFn<T> | null>(null);

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
      {} as Record<string, T[]>,
    );
  }, [filteredOptions, props.groupBy]);

  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content sideOffset={5}>
        {props.search && (
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        )}
        {Array.isArray(groupedOptions) ? (
          <DropDownItems
            options={groupedOptions}
            getOptionKey={getOptionKey}
            onItemClick={handleItemClick}
            isSelectedFn={isSelectedFn}
          />
        ) : (
          Object.entries(groupedOptions).map(([group, options]) => (
            <React.Fragment key={group}>
              {group && (
                <DropdownMenuPrimitive.Label>
                  {group}
                </DropdownMenuPrimitive.Label>
              )}
              <DropDownItems
                key={group}
                options={options}
                getOptionKey={getOptionKey}
                onItemClick={handleItemClick}
                isSelectedFn={isSelectedFn}
              />
            </React.Fragment>
          ))
        )}

        <DropdownMenuPrimitive.Arrow />
      </DropdownMenuPrimitive.Content>
    </DropdownMenuPrimitive.Portal>
  );
};

export default DropDownItemsWrapper;
