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
import type { SearchByFn } from './Select/select.types';

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
> = DistributedOmit<
  SelectProps<TData, TOption>,
  'renderItem' | 'searchBy' | 'search'
> & {
  renderItem?: SelectProps<TData, TOption>['renderItem'];
  selectLabelFn: SelectLabelFn<TData, TOption>;
  renderMenuText?: RenderMenuTextFn<TData, TOption>;
  placeholder?: string;
  containerClassName?: string;
  selectWidth?: `[--select-width:${string}]`;
  clearable?: boolean;
  label?: React.ReactNode | string;
} & (
    | {
        search: true;
        searchBy?: SearchByFn<TOption>;
      }
    | { search?: false | never }
  );
const StyledLabel = ({ label }: { label?: React.ReactNode }) => {
  if (typeof label === 'string') {
    return (
      <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </span>
    );
  }
  return label;
};

/**
 * A styled wrapper for the Select component that provides a consistent UI with additional features
 * like clearable selections and custom styling options.
 *
 * @example
 * // Basic single select with custom styling
 * const [value, setValue] = useState<Option | null>(null);
 *
 * <SelectWrapper
 *   options={options}
 *   value={value}
 *   setValue={setValue}
 *   getOptionKey={(option) => option.id}
 *   selectLabelFn={(option) => option.label}
 *   placeholder="Choose an option..."
 *   clearable
 *   label="Select Item"
 *   containerClassName="max-w-md"
 * />
 *
 * @example
 * // Multi-select with groups and custom width
 * const [values, setValues] = useState<Option[]>([]);
 *
 * <SelectWrapper
 *   multiple
 *   options={options}
 *   values={values}
 *   setValues={setValues}
 *   getOptionKey={(option) => option.id}
 *   selectLabelFn={(option) => option.label}
 *   groupBy={(option) => option.category}
 *   search
 *   searchBy={({ option, search }) =>
 *     option.label.toLowerCase().includes(search.toLowerCase())
 *   }
 *   selectWidth="[--select-width:400px]"
 *   renderMenuText={(menu) => menu?.label || 'Main Menu'}
 * />
 *
 * @template TData - Base object type for the options
 * @template TOption - Extended option type that can include menu/submenu structure
 *
 * @param props - Component props that extend the base Select props
 * @param props.selectLabelFn - Function to render the label for each option
 * @param props.renderMenuText - Optional function to render custom menu header text
 * @param props.placeholder - Placeholder text when no option is selected
 * @param props.containerClassName - Additional classes for the select container
 * @param props.selectWidth - Custom width using CSS variable (format: [--select-width:value])
 * @param props.clearable - Enable option to clear selection
 * @param props.label - Label text or node to display above the select
 * @param props.optionsContainerClassName - Custom classes for the options dropdown container
 * @param props.searchInputClassName - Custom classes for the search input
 *
 * @returns A styled Select component with enhanced functionality
 */
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
  clearable,
  label,
  ...props
}: SelectWrapperProps<TData, TOption>) => {
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (props.multiple) {
      props.setValues([]);
    } else {
      props.setValue(null);
    }
  };

  const searchProps = props.search
    ? {
        searchBy:
          props.searchBy ??
          (({ search, option }) => {
            const searchString = search.toLowerCase();
            return (
              selectLabelFn(option)
                ?.toString()
                .toLowerCase()
                .includes(searchString) ||
              option?.subMenu?.some((subItem) => {
                const subItemString = selectLabelFn(subItem as any)
                  ?.toString()
                  .toLowerCase();
                return subItemString?.includes(searchString);
              }) ||
              false
            );
          }),
        search: true as const,
      }
    : { search: false as const };

  return (
    <Select
      label={<StyledLabel label={label} />}
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
                `${baseClasses} gap-2`,
                containerClassName,
                selectWidth,
                '[width:var(--select-width)]',
              )}
            >
              <div className="flex flex-wrap gap-2">
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
              </div>

              <div className="ml-auto flex items-center">
                {clearable && selectedValues.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="mr-2 focus:outline-none text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
              </div>
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
            <div className="ml-auto flex items-center">
              {clearable && selectedValue && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="mr-2 focus:outline-none text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
            </div>
          </div>
        );
      }}
      renderItem={(args) => {
        if (args.type === 'option') {
          const {
            option,
            isSelected,
            isMenu,
            isAllSubmenuSelected,
            isPartiallySubmenuSelected,
            isDisabled,
          } = args;
          return (
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
                  'opacity-50 cursor-not-allowed hover:bg-transparent dark:hover:bg-transparent':
                    isDisabled,
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
          );
        }
        if (args.type === 'selectAll') {
          return (
            <div
              className={cn(
                'group px-4 py-2 cursor-pointer transition-colors duration-200 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between',
                {
                  'text-teal-600 dark:text-teal-400': args.isSelected,
                },
              )}
            >
              <span className="font-medium">Select All</span>
              {args.isSelected && (
                <Check className="h-4 w-4 text-teal-600 dark:text-teal-400" />
              )}
            </div>
          );
        }
        if (args.type === 'clearAll') {
          return (
            <div className="group px-4 py-2 cursor-pointer transition-colors duration-200 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between">
              <span className="font-medium">Clear All</span>
              {!args.isNoItemSelected && (
                <X className="h-4 w-4 text-red-600 dark:text-red-400" />
              )}
            </div>
          );
        }
      }}
      renderGroupText={(group) => (
        <div className="px-4 py-2 mt-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-semibold text-sm uppercase tracking-wide">
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
        'w-full px-4 py-2 border-b border-t z-10 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:border-transparent',
        searchInputClassName,
      )}
      {...props}
      {...searchProps}
    />
  );
};

export default SelectWrapper;
