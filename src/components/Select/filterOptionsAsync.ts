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
  await new Promise((resolve) => setTimeout(resolve, 100));

  if (!search) return options;

  return matchSorter(options, search, {
    keys: searchKeys,
  });
}
