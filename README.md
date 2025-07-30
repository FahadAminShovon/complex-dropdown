# Complex Dropdown Component

A highly flexible and feature-rich dropdown/select component built with React, Next.js, and TypeScript. This component supports advanced features like virtualization, search, grouping, sub-menus, and both single and multi-select modes.

## Features

- ✨ **Single & Multi-select** - Support for both selection modes
- 🔍 **Search Functionality** - Real-time search with customizable keys and async support
- ⚡ **Virtualization** - Efficient rendering for large datasets using TanStack Virtual
- 📁 **Grouping/Categories** - Organize options into collapsible groups
- 🏗️ **Sub-menus** - Nested option support with menu navigation
- 🚫 **Disabled Options** - Individual option disable state
- 🗑️ **Clearable** - Clear single or all selected values
- 🎯 **Select All** - Bulk selection for multi-select mode
- 🎨 **Customizable Styling** - Full control over appearance and layout
- 🌙 **Dark Mode** - Built-in dark theme support
- ⌨️ **Keyboard Navigation** - Full accessibility support
- 🔧 **TypeScript** - Complete type safety and IntelliSense
- ⏰ **Debounced Search** - Configurable search debouncing
- 📏 **Custom Width** - Flexible sizing options

## Quick Start

### Installation

```bash
pnpm install
# or
npm install
# or
yarn install
```

### Development

```bash
pnpm dev
# or
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to see the demo.

## Usage Examples

### Basic Single Select

```tsx
import { useState } from 'react';
import SelectWrapper from '@/components/SelectWrapper';

type OptionType = {
  label: string;
  value: string;
  category?: string;
};

const options: OptionType[] = [
  { label: 'Option 1', value: 'value1', category: 'Category A' },
  { label: 'Option 2', value: 'value2', category: 'Category A' },
  { label: 'Option 3', value: 'value3', category: 'Category B' },
];

function MyComponent() {
  const [value, setValue] = useState<OptionType | null>(null);

  return (
    <SelectWrapper
      options={options}
      value={value}
      setValue={setValue}
      getOptionKey={(option) => option?.value ?? ''}
      selectLabelFn={(option) => option?.label}
      label="Single Select"
      search
      searchKeys={['label']}
      clearable
    />
  );
}
```

### Multi-Select with Search

```tsx
import { useState } from 'react';
import SelectWrapper from '@/components/SelectWrapper';

function MultiSelectExample() {
  const [values, setValues] = useState<OptionType[]>([]);

  return (
    <SelectWrapper
      options={options}
      multiple={true}
      values={values}
      setValues={setValues}
      getOptionKey={(option) => option?.value ?? ''}
      selectLabelFn={(option) => option?.label}
      label="Multi Select"
      search
      searchKeys={['label']}
      allowSelectAll
      clearable
    />
  );
}
```

### Advanced Features

```tsx
<SelectWrapper
  options={options}
  value={value}
  setValue={setValue}
  getOptionKey={(option) => option?.value ?? ''}
  selectLabelFn={(option) => option?.label}
  
  // Search with async support
  search
  searchKeys={['label', 'category']}
  asyncSearch
  debounceTime={300}
  
  // Grouping
  groupBy={(option) => option.category ?? ''}
  
  // Sub-menus
  renderMenuText={(menu) => menu?.label ?? 'Main Menu'}
  
  // Virtualization for large datasets
  virtualize
  
  // Styling
  selectWidth="[--select-width:400px]"
  align="start"
  clearable
/>
```

### Complex Data with Sub-menus

```tsx
type ComplexOptionType = {
  label: string;
  value: string;
  category?: string;
  subMenu?: ComplexOptionType[];
  disabled?: boolean;
};

const complexData: ComplexOptionType[] = [
  {
    label: 'Parent Item',
    value: 'parent1',
    category: 'Main',
    subMenu: [
      { label: 'Sub Item 1', value: 'sub1', category: 'Sub Category' },
      { label: 'Sub Item 2', value: 'sub2', category: 'Sub Category', disabled: true },
    ],
  },
  {
    label: 'Regular Item',
    value: 'regular1',
    category: 'Main',
  },
];
```

## Component Props

### Core Props

| Prop | Type | Description |
|------|------|-------------|
| `options` | `TOption[]` | Array of options to display |
| `value` / `values` | `TOption \| null` / `TOption[]` | Selected value(s) |
| `setValue` / `setValues` | Function | Value setter function(s) |
| `getOptionKey` | `(option: TOption) => string` | Unique key extractor |
| `selectLabelFn` | `(option: TOption) => ReactNode` | Label renderer function |
| `multiple` | `boolean` | Enable multi-select mode |

### Search Props

| Prop | Type | Description |
|------|------|-------------|
| `search` | `boolean` | Enable search functionality |
| `searchKeys` | `string[]` | Object keys to search in |
| `asyncSearch` | `boolean` | Enable async search |
| `debounceTime` | `number` | Search debounce delay (ms) |

### Layout Props

| Prop | Type | Description |
|------|------|-------------|
| `groupBy` | `(option: TOption) => string` | Grouping function |
| `virtualize` | `boolean` | Enable virtualization |
| `selectWidth` | `string` | Custom width CSS variable |
| `align` | `string` | Dropdown alignment |
| `clearable` | `boolean` | Show clear button |
| `allowSelectAll` | `boolean` | Show select all option |

### Styling Props

| Prop | Type | Description |
|------|------|-------------|
| `label` | `ReactNode` | Component label |
| `placeholder` | `string` | Placeholder text |
| `containerClassName` | `string` | Container CSS classes |
| `optionsContainerClassName` | `string` | Dropdown CSS classes |

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Virtualization**: TanStack Virtual
- **Accessibility**: Radix UI Popover
- **Search**: match-sorter
- **Utils**: clsx, tailwind-merge, use-debounce

## Architecture

The component is built with a modular architecture:

- `SelectWrapper.tsx` - Styled wrapper with UI components
- `Select/` - Core select logic and functionality
- `DropdownItem.tsx` - Individual option rendering
- `VirtualDropdownItems.tsx` - Virtualized list implementation
- `filterOptions.ts` - Search and filtering logic

## Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Lint code
pnpm lint
```

## License

MIT
