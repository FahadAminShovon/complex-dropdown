'use client';
import type { Dispatch, SetStateAction } from 'react';
import { useDropDownContext } from './DropDownContextProvider';
import DropDownItemsWrapper from './DropDownItemsWrapper';
import SelectTrigger from './SelectTrigger';
import type {
  CommonSelectProps,
  DropDownDataType,
  MenuSubMenuHandlerProps,
  ObjectType,
} from './select.types';

export type SingleSelectRenderTriggerProps<
  TData extends ObjectType,
  TOption extends DropDownDataType<TData>,
> = (_args: {
  selectedValue: TOption;
}) => React.ReactNode;

export type SingleSelectProps<
  TData extends ObjectType,
  TOption extends DropDownDataType<TData>,
> = CommonSelectProps<TData, TOption> & {
  multiple?: false | never;
  value: TOption;
  setValue: Dispatch<SetStateAction<TOption>>;
  renderTrigger?: SingleSelectRenderTriggerProps<TData, TOption>;
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
  const { closeDropDown } = useDropDownContext();
  const { isOpen } = useDropDownContext();
  return (
    <>
      <SelectTrigger
        renderTrigger={renderTrigger?.({
          selectedValue: value,
        })}
      />
      {isOpen && (
        <DropDownItemsWrapper
          {...props}
          onItemClick={(...args) => {
            props.setValue(...args);
            closeDropDown();
          }}
          getOptionKey={getOptionKey}
          isSelectedFn={isSelectedFn}
        />
      )}
    </>
  );
};

export default SingleSelect;
