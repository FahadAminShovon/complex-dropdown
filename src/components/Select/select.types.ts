import type { DropDownItemsWrapperProps } from './DropDownItemsWrapper';
import type { SelectTriggerProps } from './SelectTrigger';

export type ObjectType = Record<string, any>;
export type DropDownDataType<T extends ObjectType> = {
  menu?: T | null;
  subMenu?: T[] | null;
} & T;

export type MenuSubMenuHandlerProps<
  TData extends ObjectType,
  TOption extends DropDownDataType<TData>,
> = {
  onSubMenuContainerClick: (option: TOption) => void;
  onGoBackClick: () => void;
};

export type CommonSelectProps<
  TData extends ObjectType,
  TOption extends DropDownDataType<TData>,
> = SelectTriggerProps & DropDownItemsWrapperProps<TData, TOption>;
