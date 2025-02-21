import { matchSorter } from 'match-sorter';
import type { DropDownDataType, ObjectType } from './select.types';

export function getFilterOptions<
  TData extends ObjectType,
  TOption extends DropDownDataType<TData>,
>(options: TOption[], search: string, searchKeys: string[]): TOption[] {
  if (!search) return options;

  return matchSorter(options, search, {
    keys: searchKeys,
  });
}
