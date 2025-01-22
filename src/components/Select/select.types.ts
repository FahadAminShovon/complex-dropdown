import type { DropDownItemsWrapperProps } from './DropDownItemsWrapper';
import type { SelectTriggerProps } from './SelectTrigger';

export type ObjectType = Record<string, any>;

export type CommonSelectProps<T extends ObjectType> = SelectTriggerProps &
  DropDownItemsWrapperProps<T>;
