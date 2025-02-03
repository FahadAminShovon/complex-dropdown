'use client';
import { Select } from '@/components/Select';
import { useState } from 'react';
import { cn } from '../../lib/utils';

type OptionType = {
  label: string;
  value: string;
  category?: string;
  subMenu?: OptionType[];
  menu?: OptionType;
};

const dummyData: OptionType[] = [
  {
    label: 'label 1',
    value: 'value 1',
    category: 'category 1',
    subMenu: [
      {
        label: 'sub label 1',
        value: 'sub value 1',
        category: 'category 3',
      },
      {
        label: 'sub label 2',
        value: 'sub value 2',
        category: 'category 3',
      },
      {
        label: 'sub label 2',
        value: 'sub value 3',
        category: 'category 2',
      },
    ],
  },
  {
    label: 'label 2',
    value: 'value 2',
    category: 'category 1',
  },
  {
    label: 'label 3',
    value: 'value 3',
    category: 'category 2',
  },
  {
    label: 'label 4',
    value: 'value 4',
    category: 'category 3',
  },
];

export default function Home() {
  const [value, setValue] = useState({} as OptionType);
  const [values, setValues] = useState<OptionType[]>([]);

  return (
    <div className="container mx-auto my-10 flex flex-col gap-40">
      <div>
        <div className="flex gap-2">
          {value.menu && (
            <div className="text-black bg-gray-200 p-2">{value.menu.label}</div>
          )}

          {value.label && (
            <div className="text-black bg-gray-200 p-2">{value.label}</div>
          )}
        </div>
        <Select
          options={dummyData}
          multiple={false}
          value={value}
          setValue={setValue}
          getOptionKey={(option) => option.value}
          search={true}
          searchBy={({ option, search }) => option.label.includes(search)}
          groupBy={(option) => option.category ?? ''}
          renderMenu={(menu) => <div>&larr;{menu?.label}</div>}
          renderItem={({ option, isSelected }) => (
            <div
              className={cn({
                'text-black bg-teal-700': isSelected,
              })}
            >
              {option.label}
            </div>
          )}
          renderGroupText={(group) => (
            <div className="p-2 bg-gray-800">{group}</div>
          )}
        />
      </div>
      <div>
        <div className="flex gap-2">
          {values.map((value) => {
            return (
              <div key={value.label}>
                {value.label && (
                  <div className="text-black bg-gray-200 p-2">
                    {value.label}
                  </div>
                )}
                {value.menu && (
                  <div className="text-black bg-gray-200 p-2">
                    {value.menu.label}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <Select
          options={dummyData}
          multiple={true}
          values={values}
          setValues={setValues}
          getOptionKey={(option) => option.value}
          groupBy={(option) => option.category ?? ''}
          renderMenu={(menu) => <div>&larr; {menu?.label}</div>}
          renderItem={({ option, isSelected }) => (
            <div
              className={cn({
                'text-black bg-teal-700': isSelected,
              })}
            >
              {option.label}
            </div>
          )}
        />
      </div>
    </div>
  );
}
