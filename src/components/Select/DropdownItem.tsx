import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { useDropDownContext } from './DropDownContextProvider';
import type { DropDownItemProps } from './select.types';
import type { DropDownDataType, ObjectType } from './select.types';

export const DropDownItem = <
  TData extends ObjectType,
  TOption extends DropDownDataType<TData>,
>({
  onSubMenuContainerClick,
  onItemClick: handleItemClick,
  renderItem,
  isOptionSelected,
  option,
  fRef,
  dataIndex,
  ...props
}: Pick<
  DropDownItemProps<TData, TOption>,
  'onSubMenuContainerClick' | 'onItemClick' | 'renderItem'
> & {
  isOptionSelected: boolean;
} & {
  option: DropDownItemProps<TData, TOption>['options'][number];
  fRef?: React.Ref<HTMLDivElement>;
  className?: string;
  dataIndex?: number;
  style?: React.CSSProperties;
}) => {
  const { menu } = useDropDownContext();
  return (
    <DropdownMenuPrimitive.Item
      ref={fRef}
      data-index={dataIndex}
      onClick={() => {
        if (option.subMenu) {
          onSubMenuContainerClick({
            menu: option,
            subMenu: option.subMenu as any,
          });
          return;
        }
        handleItemClick({ ...option, menu });
      }}
      asChild
      {...props}
    >
      {renderItem({ option, isSelected: isOptionSelected })}
    </DropdownMenuPrimitive.Item>
  );
};
