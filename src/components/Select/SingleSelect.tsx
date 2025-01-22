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

export type SingleSelectProps<
  TData extends ObjectType,
  TOption extends DropDownDataType<TData>,
> = CommonSelectProps<TData, TOption> & {
  multiple?: false | never;
  value: TOption;
  setValue: Dispatch<SetStateAction<TOption>>;
};

const SingleSelect = <
  TData extends ObjectType,
  TOption extends DropDownDataType<TData>,
>({
  renderTrigger,
  value,
  getOptionKey,
  ...props
}: SingleSelectProps<TData, TOption> &
  MenuSubMenuHandlerProps<TData, TOption>) => {
  const isSelectedFn = (option: TOption) => {
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
