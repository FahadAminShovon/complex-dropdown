'use client';
import SelectWrapper from '@/components/SelectWrapper';
import { useState } from 'react';

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
    category: 'category 2',
  },
];

// const dummyData: OptionType[] = Array.from({ length: 1000 }, (_, index) => ({
//   // repeat the label randomly
//   label: `label ${index + 1}`.repeat(Math.floor(Math.random() * 10) + 1),
//   value: `value ${index + 1}`,
//   category: `category ${index % 3}`,
//   subMenu: Array.from({ length: 10 }, (_, index) => ({
//     label: `sub label ${index + 1}`,
//     value: `sub value ${index + 1}`,
//     category: `sub category ${index % 3}`,
//   })),
// }));

export default function Home() {
  const [value, setValue] = useState({} as OptionType);
  const [values, setValues] = useState<OptionType[]>([]);

  return (
    <div className="container mx-auto my-10 flex flex-col gap-40">
      <SelectWrapper
        triggerClassName="w-[400px]"
        options={dummyData}
        // multiple={false}
        value={value}
        setValue={setValue}
        getOptionKey={(option) => option.value}
        // search={true}
        // searchBy={({ option, search }) => option.label.includes(search)}
        // groupBy={(option) => option.category ?? ''}
        selectLabelFn={(option) => option.label}
        // renderMenuText={(menu) => <div>&larr; {menu?.label}</div>}
      />

      <SelectWrapper
        virtualize
        triggerClassName="w-[400px]"
        options={dummyData}
        multiple={true}
        values={values}
        // search={true}
        // searchBy={({ option, search }) => option.label.includes(search)}
        setValues={setValues}
        getOptionKey={(option) => option.value}
        // groupBy={(option) => option.category ?? ''}
        selectLabelFn={(option) => option.label}
        // renderMenuText={(menu) => <div>&larr; {menu?.label}</div>}
      />
    </div>
  );
}
