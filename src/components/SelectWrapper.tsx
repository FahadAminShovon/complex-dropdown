import type React from 'react';
import { cn } from '../../lib/utils';
import { Select } from './Select';
import type { DropDownDataType, ObjectType } from './Select';
import type { SelectProps } from './Select/Select';

type SelectWrapperProps<
  TData extends ObjectType,
  TOption extends DropDownDataType<TData>,
> = SelectProps<TData, TOption>;

type SelectLabelFn<
  TData extends ObjectType,
  TOption extends DropDownDataType<TData>,
> = (option: TOption) => string;

type RenderMenuTextFn<
  TData extends ObjectType,
  TOption extends DropDownDataType<TData>,
> = (menu: TOption | null) => React.ReactNode;

const SelectWrapper = <
  TData extends ObjectType,
  TOption extends DropDownDataType<TData>,
>({
  selectLabelFn,
  renderMenuText,
  ...props
}: SelectWrapperProps<TData, TOption> & {
  selectLabelFn: SelectLabelFn<TData, TOption>;
  renderMenuText?: RenderMenuTextFn<TData, TOption>;
}) => {
  return (
    <Select
      renderTrigger={
        <div className="cursor-pointer border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 w-fit bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 shadow-sm">
          <span className="text-gray-700 dark:text-gray-200 font-medium">
            Select
          </span>
        </div>
      }
      renderItem={({ option, isSelected }) => (
        <div
          className={cn(
            'px-4 py-2 cursor-pointer transition-colors duration-200 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700',
            {
              'bg-teal-600 text-white': isSelected,
            },
          )}
        >
          {selectLabelFn(option)}
        </div>
      )}
      renderGroupText={(group) => (
        <div className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-semibold text-sm uppercase tracking-wide">
          {group}
        </div>
      )}
      renderMenu={
        renderMenuText
          ? (menu) => (
              <div className="bg-white dark:bg-gray-800 p-2 text-gray-600 dark:text-gray-300">
                <span>{renderMenuText(menu)}</span>
              </div>
            )
          : undefined
      }
      optionsContainerClassName="bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 w-[200px] max-h-60 overflow-y-auto"
      searchInputClassName="w-full px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:border-transparent"
      {...props}
    />
  );
};

export default SelectWrapper;
