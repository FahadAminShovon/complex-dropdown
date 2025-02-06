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
  MenuSubMenuHandlerProps<TData, TOption> & {
    allOptions: TOption[];
  }) => {
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

  // TODO: add ui for select all
  const handleSelectAll = () => {
    const allOptions = props.options.flatMap((option) => {
      if (option.subMenu) {
        return option.subMenu.map((subOption) =>
          getOptionKey(subOption as any),
        );
      }
      return getOptionKey(option as any);
    });

    const allOptionsSet = new Set(allOptions);

    // add all selected values to the set
    for (const value of values) {
      allOptionsSet.add(getOptionKey(value as any));
    }

    // filter the options to only include the ones that are in the set
    const updatedValues = props.allOptions
      .flatMap((option) => {
        if (option.subMenu) {
          return option.subMenu
            .filter((subOption) =>
              allOptionsSet.has(getOptionKey(subOption as any)),
            )
            .map((subOption) => ({
              ...subOption,
              menu: option,
            }));
        }
        if (allOptionsSet.has(getOptionKey(option as any))) {
          return option;
        }
        return null;
      })
      .filter(Boolean) as TOption[];

    props.setValues(updatedValues);
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
