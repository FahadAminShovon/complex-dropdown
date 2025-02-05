import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Circle,
  X,
} from 'lucide-react';
import type React from 'react';
import type { DistributedOmit } from 'type-fest';
import { cn } from '../../lib/utils';
import { Select } from './Select';
import type { DropDownDataType, ObjectType } from './Select';
import type { MultiSelectRenderTriggerProps } from './Select/MultiSelect';
import type { SelectProps } from './Select/Select';
import type { SingleSelectRenderTriggerProps } from './Select/SingleSelect';

type SelectLabelFn<
  TData extends ObjectType,
  TOption extends DropDownDataType<TData>,
> = (option: TOption) => React.ReactNode;

type RenderMenuTextFn<
  TData extends ObjectType,
  TOption extends DropDownDataType<TData>,
> = (menu: TOption | null) => React.ReactNode;

type SelectWrapperProps<
  TData extends ObjectType,
  TOption extends DropDownDataType<TData>,
> = DistributedOmit<SelectProps<TData, TOption>, 'renderItem'> & {
  renderItem?: SelectProps<TData, TOption>['renderItem'];
  selectLabelFn: SelectLabelFn<TData, TOption>;
  renderMenuText?: RenderMenuTextFn<TData, TOption>;
  placeholder?: string;
  containerClassName?: string;
  selectWidth?: `[--select-width:${string}]`;
};

const SelectWrapper = <
  TData extends ObjectType,
  TOption extends DropDownDataType<TData>,
>({
  selectLabelFn,
  renderMenuText,
  optionsContainerClassName,
  searchInputClassName,
  placeholder = 'Select...',
  containerClassName,
  selectWidth,
  ...props
}: SelectWrapperProps<TData, TOption>) => {
  return (
    <Select
      renderTrigger={(args: unknown) => {
        const baseClasses =
          'cursor-pointer border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 w-full min-w-[200px] bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 shadow-sm flex items-center';

        if (props.multiple) {
          const { selectedValues, handleRemove } = args as Parameters<
            MultiSelectRenderTriggerProps<TData, TOption>
          >[0];

          return (
            <div
              className={cn(
                `${baseClasses} flex-wrap gap-2`,
                containerClassName,
                selectWidth,
                '[width:var(--select-width)]',
              )}
            >
              {selectedValues.length > 0 ? (
                selectedValues.map((option) => (
                  <div
                    key={props.getOptionKey(option)}
                    className="bg-teal-100 dark:bg-teal-700 text-teal-800 dark:text-teal-100 rounded-full px-3 py-1 text-sm flex items-center group transition-all duration-200 hover:bg-teal-200 dark:hover:bg-teal-600 hover:shadow-md"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.stopPropagation();
                      }
                    }}
                  >
                    {selectLabelFn(option)}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(option);
                      }}
                      className="ml-2 focus:outline-none opacity-70 group-hover:opacity-100 transition-opacity duration-200"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))
              ) : (
                <span className="text-gray-500 dark:text-gray-400">
                  {placeholder}
                </span>
              )}
              <ChevronDown className="ml-auto h-4 w-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
            </div>
          );
        }
        const { selectedValue } = args as Parameters<
          SingleSelectRenderTriggerProps<TData, TOption>
        >[0];

        return (
          <div
            className={cn(
              baseClasses,
              'justify-between',
              containerClassName,
              selectWidth,
              '[width:var(--select-width)]',
            )}
          >
            <span className="text-gray-700 dark:text-gray-200 font-medium truncate">
              {selectedValue ? selectLabelFn(selectedValue) : placeholder}
            </span>
            <ChevronDown className="ml-2 h-4 w-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
          </div>
        );
      }}
      renderItem={({
        option,
        isSelected,
        isMenu,
        isAllSubmenuSelected,
        isPartiallySubmenuSelected,
      }) => (
        <div
          className={cn(
            'group px-4 py-2 cursor-pointer transition-colors duration-200 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between',
            {
              'text-teal-600 dark:text-teal-400':
                isSelected || isAllSubmenuSelected,
              'font-medium':
                isSelected ||
                isAllSubmenuSelected ||
                isPartiallySubmenuSelected,
            },
          )}
        >
          <span className="truncate">{selectLabelFn(option)}</span>
          <div className="flex items-center ml-2 space-x-2">
            {(isSelected ||
              isAllSubmenuSelected ||
              isPartiallySubmenuSelected) && (
              <span className="flex items-center justify-center w-5 h-5">
                {isMenu ? (
                  isAllSubmenuSelected ? (
                    <Check className="h-4 w-4" />
                  ) : isPartiallySubmenuSelected ? (
                    <Circle className="h-2 w-2 fill-current text-teal-600 dark:text-teal-400" />
                  ) : null
                ) : (
                  <Check className="h-4 w-4" />
                )}
              </span>
            )}
            {isMenu && (
              <ChevronRight className="h-4 w-4 text-gray-600 dark:text-gray-300 flex-shrink-0 transition-all duration-200 ease-in-out transform group-hover:translate-x-1 group-hover:text-gray-900 group-hover:scale-110 dark:group-hover:text-gray-100" />
            )}
          </div>
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
              <div className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-semibold text-sm uppercase tracking-wide w-full text-left flex items-center gap-2 justify-start">
                <ChevronLeft className="h-4 w-4 flex-shrink-0" />
                <span>{renderMenuText(menu)}</span>
              </div>
            )
          : undefined
      }
      optionsContainerClassName={cn(
        'bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 overflow-y-auto w-full',
        selectWidth,
        optionsContainerClassName,
        '[width:var(--select-width)]',
      )}
      searchInputClassName={cn(
        'w-full px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:border-transparent',
        searchInputClassName,
      )}
      {...props}
    />
  );
};

export default SelectWrapper;
