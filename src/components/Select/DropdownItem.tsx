import { Command } from 'cmdk';
import { useDropDownContext } from './DropDownContextProvider';
import type {
  DropDownDataType,
  DropDownItemProps,
  ObjectType,
} from './select.types';

export const DropDownItem = <
  TData extends ObjectType,
  TOption extends DropDownDataType<TData>,
>({
  onSubMenuContainerClick,
  onItemClick: handleItemClick,
  renderItem,
  option,
  fRef,
  dataIndex,
  isSelectedFn,
  ...props
}: Pick<
  DropDownItemProps<TData, TOption>,
  'onSubMenuContainerClick' | 'onItemClick' | 'renderItem' | 'isSelectedFn'
> & {
  option: DropDownItemProps<TData, TOption>['options'][number];
  fRef?: React.Ref<HTMLDivElement>;
  className?: string;
  dataIndex?: number;
  style?: React.CSSProperties;
}) => {
  const { menu } = useDropDownContext();
  const isMenu = option.subMenu != null && option.subMenu.length > 0;
  const isOptionSelected = isMenu ? false : isSelectedFn(option);

  const isAllSubmenuSelected = isMenu
    ? (option.subMenu?.every((subMenu) => isSelectedFn(subMenu as any)) ??
      false)
    : isOptionSelected;
  const isPartiallySubmenuSelected = isMenu
    ? (option.subMenu?.some((subMenu) => isSelectedFn(subMenu as any)) ?? false)
    : false;
  return (
    <Command.Item
      ref={fRef}
      data-index={dataIndex}
      onSelect={() => {
        if (option.disabled) return;
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
      {renderItem({
        type: 'option',
        option,
        isSelected: isOptionSelected,
        isMenu,
        isAllSubmenuSelected,
        isPartiallySubmenuSelected,
        isDisabled: Boolean(option.disabled),
      })}
    </Command.Item>
  );
};
