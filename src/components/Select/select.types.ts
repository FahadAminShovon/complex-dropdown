import type { PopoverContentProps } from '@radix-ui/react-popover';
import type { Paths } from 'type-fest';

type GroupByFn<T extends ObjectType> = (option: T) => string;

type RenderItemType<
  TData extends ObjectType,
  TOption extends DropDownDataType<TData>,
> = (
  _obj:
    | {
        type: 'option';
        option: TOption;
        isSelected: boolean;
        isMenu: boolean;
        isAllSubmenuSelected: boolean;
        isPartiallySubmenuSelected: boolean;
        isDisabled: boolean;
      }
    | {
        type: 'selectAll';
        isSelected: boolean;
      }
    | {
        type: 'clearAll';
        isNoItemSelected: boolean;
      },
) => React.ReactNode;

export type DropDownItemsWrapperProps<
  TData extends ObjectType,
  TOption extends DropDownDataType<TData>,
> = {
  options: TOption[];
  getOptionKey: (option: TOption | null) => string;
  groupBy?: GroupByFn<TOption>;
  renderMenu?: (menu: TOption | null) => React.ReactNode;
  renderGroupText?: (group: string) => React.ReactNode;
  renderItem: RenderItemType<TData, TOption>;
  virtualize?: boolean;
  optionsContainerClassName?: string;
  searchInputClassName?: string;
} & Pick<PopoverContentProps, 'align'> &
  (
    | {
        search: true;
        searchKeys: Paths<Omit<TOption, 'menu' | 'subMenu'>>[];
        searchSubMenuKeys: Paths<Omit<TOption, 'menu' | 'subMenu'>>[];
        asyncSearch?: boolean;
        debounceTime?: number;
      }
    | {
        search?: false | never;
      }
  );

export type DropDownItemProps<
  TData extends ObjectType,
  TOption extends DropDownDataType<TData>,
> = Pick<
  DropDownItemsWrapperProps<TData, TOption>,
  'options' | 'getOptionKey' | 'renderItem'
> & {
  onItemClick: (option: TOption) => void;
  isSelectedFn: (option: TOption) => boolean;
} & MenuSubMenuHandlerProps<TData, TOption> & {
    fRef?: React.Ref<HTMLDivElement>;
  } & (
    | {
        allowSelectAll?: false | never;
      }
    | {
        allowSelectAll: true;
        onClearAll: () => void;
        onSelectAll: () => void;
      }
  );

export type ObjectType = Record<string, unknown>;
export type DropDownDataType<T extends ObjectType> = {
  menu?: T | null;
  subMenu?: T[] | null;
  disabled?: boolean;
} & T;

export type MenuSubMenuHandlerProps<
  TData extends ObjectType,
  TOption extends DropDownDataType<TData>,
> = {
  onSubMenuContainerClick: (_obj: {
    subMenu: TOption[];
    menu: TOption;
  }) => void;
  onGoBackClick: () => void;
};

export type CommonSelectProps<
  TData extends ObjectType,
  TOption extends DropDownDataType<TData>,
> = DropDownItemsWrapperProps<TData, TOption>;

export type VirtualItemsProps<
  TData extends ObjectType,
  TOption extends DropDownDataType<TData>,
> = {
  groupedOptions: TOption[] | Record<string, TOption[]>;
} & Pick<
  DropDownItemProps<TData, TOption>,
  'renderItem' | 'isSelectedFn' | 'onSubMenuContainerClick' | 'onItemClick'
> &
  Pick<DropDownItemsWrapperProps<TData, TOption>, 'renderGroupText'>;

export type NonVirtualItemsProps<
  TData extends ObjectType,
  TOption extends DropDownDataType<TData>,
> = Pick<
  VirtualItemsProps<TData, TOption>,
  | 'groupedOptions'
  | 'onSubMenuContainerClick'
  | 'onItemClick'
  | 'isSelectedFn'
  | 'renderItem'
  | 'renderGroupText'
> &
  Pick<DropDownItemsWrapperProps<TData, TOption>, 'getOptionKey'>;

export type SelectPropsAllowed = {
  allowSelectAll?: boolean;
};

export type SelectPropsNotAllowed = {
  allowSelectAll?: false | never;
};

export type AllowSelectAllProps =
  | ({
      onSelectAll: () => void;
      onClearAll: () => void;
      isAllSelected: boolean;
      isNoItemSelected: boolean;
    } & SelectPropsAllowed)
  | SelectPropsNotAllowed;
