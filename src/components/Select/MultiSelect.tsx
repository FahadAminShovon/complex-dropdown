'use client';
import type { Dispatch, SetStateAction } from 'react';
import DropDownItemsWrapper from './DropDownItemsWrapper';
import SelectTrigger from './SelectTrigger';
import type { CommonSelectProps, ObjectType } from './select.types';

export type MultiSelectProps<T extends ObjectType> = CommonSelectProps<T> & {
  multiple: true;
  values: T[];
  setValues: Dispatch<SetStateAction<T[]>>;
};

const MultiSelect = <T extends ObjectType>({
  renderTrigger,
  values,
  getOptionKey,
  ...props
}: MultiSelectProps<T>) => {
  const handleItemClick = (option: T) => {
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

  const isSelectedFn = (option: T) => {
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
