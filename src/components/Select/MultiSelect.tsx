'use client';
import type { Dispatch, SetStateAction } from 'react';
import DropDownItemsWrapper from './DropDownItemsWrapper';
import SelectTrigger from './SelectTrigger';
import type {
  CommonSelectProps,
  DropDownDataType,
  MenuSubMenuHandlerProps,
  ObjectType,
} from './select.types';

export type MultiSelectProps<
  TData extends ObjectType,
  TOption extends DropDownDataType<TData>,
> = CommonSelectProps<TData, TOption> & {
  multiple: true;
  values: TOption[];
  setValues: Dispatch<SetStateAction<TOption[]>>;
};

const MultiSelect = <
  TData extends ObjectType,
  TOption extends DropDownDataType<TData>,
>({
  renderTrigger,
  values,
  getOptionKey,
  ...props
}: MultiSelectProps<TData, TOption> &
  MenuSubMenuHandlerProps<TData, TOption>) => {
  const handleItemClick = (option: TOption) => {
    const isSelected = values.some(
      (value) => getOptionKey(value) === getOptionKey(option),
    );
    if (isSelected) {
      props.setValues(
        values.filter((value) => getOptionKey(value) !== getOptionKey(option)),
      );
      return;
    }
    props.setValues([...values, option]);
  };

  const isSelectedFn = (option: TOption) => {
    return values.some((value) => getOptionKey(value) === getOptionKey(option));
  };

  return (
    <>
      <SelectTrigger renderTrigger={renderTrigger} />
      <DropDownItemsWrapper
        {...props}
        onItemClick={handleItemClick}
        getOptionKey={getOptionKey}
        isSelectedFn={isSelectedFn}
      />
    </>
  );
};

export default MultiSelect;
