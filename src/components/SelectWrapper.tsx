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
        <div className="cursor-pointer border border-gray-300 rounded-md px-3 py-2 w-fit">
          <span>Select</span>
        </div>
      }
      renderItem={({ option, isSelected }) => (
        <div
          className={cn('text-black', {
            'bg-teal-700': isSelected,
          })}
        >
          {selectLabelFn(option)}
        </div>
      )}
      renderGroupText={(group) => <div className="p-2 bg-red-200">{group}</div>}
      renderMenu={
        renderMenuText
          ? (menu) => (
              <div className="bg-gray-500">
                <span>{renderMenuText(menu)}</span>
              </div>
            )
          : undefined
      }
      optionsContainerClassName="bg-gray-500 w-[200px]"
      searchInputClassName="bg-white text-black"
      {...props}
    />
  );
};

export default SelectWrapper;
