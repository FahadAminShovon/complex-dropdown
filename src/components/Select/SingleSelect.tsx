'use client';
import type { Dispatch, SetStateAction } from 'react';
import DropDownItemsWrapper from './DropDownItemsWrapper';
import SelectTrigger from './SelectTrigger';
import type { CommonSelectProps, ObjectType } from './select.types';

export type SingleSelectProps<T extends ObjectType> = CommonSelectProps<T> & {
  multiple?: false | never;
  value: T;
  setValue: Dispatch<SetStateAction<T>>;
};

const SingleSelect = <T extends ObjectType>({
  renderTrigger,
  value,
  getOptionKey,
  ...props
}: SingleSelectProps<T>) => {
  const isSelectedFn = (option: T) => {
    return getOptionKey(option) === getOptionKey(value);
  };
  return (
    <>
      <SelectTrigger renderTrigger={renderTrigger} />
      <DropDownItemsWrapper
        {...props}
        onItemClick={props.setValue}
        getOptionKey={getOptionKey}
        isSelectedFn={isSelectedFn}
      />
    </>
  );
};

export default SingleSelect;
