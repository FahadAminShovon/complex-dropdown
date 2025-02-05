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

export type MultiSelectRenderTriggerProps<
  TData extends ObjectType,
  TOption extends DropDownDataType<TData>,
> = (_args: {
  selectedValues: TOption[];
  handleRemove: (option: TOption) => void;
}) => React.ReactNode;

export type MultiSelectProps<
  TData extends ObjectType,
  TOption extends DropDownDataType<TData>,
> = CommonSelectProps<TData, TOption> & {
  multiple: true;
  values: TOption[];
  setValues: Dispatch<SetStateAction<TOption[]>>;
  renderTrigger?: MultiSelectRenderTriggerProps<TData, TOption>;
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

  const handleRemove = (option: TOption) => {
    props.setValues(
      values.filter((value) => getOptionKey(value) !== getOptionKey(option)),
    );
  };

  const selectedValuesSet = new Set(values.map(getOptionKey));

  const isSelectedFn = (option: TOption) => {
    return selectedValuesSet.has(getOptionKey(option));
  };

  const { isOpen } = useDropDownContext();

  return (
    <>
      <SelectTrigger
        renderTrigger={renderTrigger?.({
          selectedValues: values,
          handleRemove,
        })}
      />
      {isOpen && (
        <DropDownItemsWrapper
          {...props}
          onItemClick={handleItemClick}
          getOptionKey={getOptionKey}
          isSelectedFn={isSelectedFn}
        />
      )}
    </>
  );
};

export default MultiSelect;
