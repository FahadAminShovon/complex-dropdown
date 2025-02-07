'use client';
import {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { useDropDownContext } from './DropDownContextProvider';
import DropDownItemsWrapper from './DropDownItemsWrapper';
import SelectTrigger from './SelectTrigger';
import type {
  AllowSelectAllProps,
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
} & Pick<AllowSelectAllProps, 'allowSelectAll'>;

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
  const { menu } = useDropDownContext();
  const getOptionKeyFnRef = useRef<typeof getOptionKey | null>(getOptionKey);

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

  useEffect(() => {
    getOptionKeyFnRef.current = getOptionKey;
  });

  const isAllSelected = useMemo(() => {
    const getOptionKeyFn = getOptionKeyFnRef.current;
    if (!getOptionKeyFn) {
      return false;
    }
    if (values.length === 0) {
      return false;
    }
    if (!menu) {
      // if it's on parent menu, check if all options are selected
      return (
        values.length ===
        props.options.flatMap((option) => option.subMenu).length
      );
    }
    // if it's on submenu, check if all options on that submenu are selected
    const optionKeysSet = new Set(props.options.map(getOptionKeyFn));
    console.log('optionsKeySet', optionKeysSet);
    return (
      values.filter((value) => optionKeysSet.has(getOptionKeyFn(value)))
        .length === optionKeysSet.size
    );
  }, [menu, values, props.options]);

  const isNoItemSelected = useMemo(() => {
    const getOptionKeyFn = getOptionKeyFnRef.current;
    if (!getOptionKeyFn) {
      return false;
    }
    if (!menu) {
      // if it's on parent menu, check if no options are selected
      return values.length === 0;
    }
    // if it's on submenu, check if no options on that submenu are selected

    const optionKeysSet = new Set(props.options.map(getOptionKeyFn));
    return (
      values.filter((value) => !optionKeysSet.has(getOptionKeyFn(value)))
        .length === values.length
    );
  }, [menu, values, props.options]);

  const handleClearAll = () => {
    // if it's on parent menu, clear all
    if (!menu) {
      props.setValues([]);
      return;
    }
    // if it's on submenu, clear all options on that submenu
    const optionKeysSet = new Set(props.options.map(getOptionKey));
    const updatedValues = values.filter((value) => {
      return !optionKeysSet.has(getOptionKey(value));
    });
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
          allowSelectAll={props.allowSelectAll}
          onClearAll={handleClearAll}
          onSelectAll={handleSelectAll}
          isAllSelected={isAllSelected}
          isNoItemSelected={isNoItemSelected}
        />
      )}
    </>
  );
};

export default MultiSelect;
