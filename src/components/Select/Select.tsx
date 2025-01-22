import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import type { MultiSelectProps } from './MultiSelect';
import MultiSelect from './MultiSelect';
import type { SingleSelectProps } from './SingleSelect';
import SingleSelect from './SingleSelect';
import type { CommonSelectProps, ObjectType } from './select.types';

type SelectProps<T extends ObjectType> = CommonSelectProps<T> &
  (SingleSelectProps<T> | MultiSelectProps<T>);

const Select = <T extends ObjectType>(props: SelectProps<T>) => {
  return (
    <DropdownMenuPrimitive.Root>
      {props.multiple && <MultiSelect {...props} />}
      {!props.multiple && <SingleSelect {...props} />}
    </DropdownMenuPrimitive.Root>
  );
};

export default Select;
