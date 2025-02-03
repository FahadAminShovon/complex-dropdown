import React from 'react';
import { DropDownItem } from './DropdownItem';
import DropdownLabel from './DropdownLabel';
import { itemsWrapperClassName } from './VirtualDropdownItems';
import type {
  DropDownDataType,
  DropDownItemProps,
  NonVirtualItemsProps,
  ObjectType,
} from './select.types';

const DropDownItems = <
  TData extends ObjectType,
  TOption extends DropDownDataType<TData>,
>({
  options,
  getOptionKey,
  isSelectedFn,
  ...props
}: Pick<
  DropDownItemProps<TData, TOption>,
  | 'getOptionKey'
  | 'isSelectedFn'
  | 'onSubMenuContainerClick'
  | 'onItemClick'
  | 'options'
  | 'renderItem'
>) => {
  return (
    <>
      {options.map((option) => {
        const isOptionSelected = isSelectedFn(option);
        return (
          <DropDownItem
            key={getOptionKey(option)}
            option={option}
            isOptionSelected={isOptionSelected}
            {...props}
          />
        );
      })}
    </>
  );
};

const NonVirtualDropdownItems = <
  TData extends ObjectType,
  TOption extends DropDownDataType<TData>,
>({
  groupedOptions,
  onSubMenuContainerClick,
  onItemClick: handleItemClick,
  isSelectedFn,
  renderItem,
  renderGroupText,
  getOptionKey,
}: NonVirtualItemsProps<TData, TOption>) => {
  return (
    <div className={itemsWrapperClassName}>
      {Array.isArray(groupedOptions) ? (
        <DropDownItems
          onSubMenuContainerClick={onSubMenuContainerClick}
          options={groupedOptions}
          getOptionKey={getOptionKey}
          onItemClick={handleItemClick}
          isSelectedFn={isSelectedFn}
          renderItem={renderItem}
        />
      ) : (
        Object.entries(groupedOptions).map(([group, options]) => (
          <React.Fragment key={group}>
            {group && (
              <DropdownLabel label={group} renderGroupText={renderGroupText} />
            )}
            <DropDownItems
              onSubMenuContainerClick={onSubMenuContainerClick}
              key={group}
              options={options}
              getOptionKey={getOptionKey}
              onItemClick={handleItemClick}
              isSelectedFn={isSelectedFn}
              renderItem={renderItem}
            />
          </React.Fragment>
        ))
      )}
    </div>
  );
};

export default NonVirtualDropdownItems;
