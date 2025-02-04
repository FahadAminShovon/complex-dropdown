// import type { SelectTriggerProps } from './SelectTrigger';

export type SearchByFn<T extends ObjectType> = (obj: {
  option: T;
  index: number;
  search: string;
}) => boolean;

type GroupByFn<T extends ObjectType> = (option: T) => string;

export type DropDownItemsWrapperProps<
  TData extends ObjectType,
  TOption extends DropDownDataType<TData>,
> = {
  options: TOption[];
  getOptionKey: (option: TOption | null) => string;
  groupBy?: GroupByFn<TOption>;
  renderMenu?: (menu: TOption | null) => React.ReactNode;
  renderGroupText?: (group: string) => React.ReactNode;
  renderItem: (_obj: {
    option: TOption;
    isSelected: boolean;
  }) => React.ReactNode;
  virtualize?: boolean;
  optionsContainerClassName?: string;
  searchInputClassName?: string;
} & (
  | {
      search: true;
      searchBy: SearchByFn<TOption>;
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
  };

export type ObjectType = Record<string, any>;
export type DropDownDataType<T extends ObjectType> = {
  menu?: T | null;
  subMenu?: T[] | null;
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
