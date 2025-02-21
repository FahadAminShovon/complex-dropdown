'use server';

import { matchSorter } from 'match-sorter';
import type { DropDownDataType, ObjectType } from './select.types';

export async function getFilterOptionsAsync<
  TData extends ObjectType,
  TOption extends DropDownDataType<TData>,
>(
  options: TOption[],
  search: string,
  searchKeys: string[],
): Promise<TOption[]> {
  // Simulate server delay

  if (!search) return options;

  return matchSorter(options, search, {
    keys: searchKeys,
  });
}
