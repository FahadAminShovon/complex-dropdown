'use client';
import { Select } from '@/components/Select';
import { useState } from 'react';

type OptionType = {
  label: string;
  value: string;
  category?: string;
  subMenu?: OptionType[];
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
        category: 'category k',
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
];

export default function Home() {
  const [value, setValue] = useState({} as OptionType);
  const [values, setValues] = useState<OptionType[]>([]);

  return (
    <div className="container mx-auto my-10 flex flex-col gap-40">
      <div>
        <div>{JSON.stringify(value)}</div>
        <Select
          options={dummyData}
          multiple={false}
          value={value}
          setValue={setValue}
          getOptionKey={(option) => option.value}
          search={true}
          searchBy={({ option, search }) => option.label.includes(search)}
          groupBy={(option) => option.category ?? ''}
        />
      </div>
      <div>
        <div>{JSON.stringify(values)}</div>
        <Select
          options={dummyData}
          multiple={true}
          values={values}
          setValues={setValues}
          getOptionKey={(option) => option.value}
          groupBy={(option) => option.category ?? ''}
        />
      </div>
    </div>
  );
}
