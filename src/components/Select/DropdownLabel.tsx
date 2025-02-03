import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import type { DropDownItemsWrapperProps } from './select.types';

type DropdownLabelProps = {
  className?: string;
  dataIndex?: number;
  style?: React.CSSProperties;
  fRef?: React.Ref<HTMLDivElement>;
  label: string;
  renderGroupText?: (group: string) => React.ReactNode;
} & Pick<DropDownItemsWrapperProps<any, any>, 'renderGroupText'>;

export const DropdownLabel = ({
  className,
  dataIndex,
  style,
  fRef,
  label,
  renderGroupText,
}: DropdownLabelProps) => {
  return (
    <DropdownMenuPrimitive.Label
      asChild={!!renderGroupText}
      data-index={dataIndex}
      ref={fRef}
      className={className}
      style={style}
    >
      {renderGroupText?.(label) ?? label}
    </DropdownMenuPrimitive.Label>
  );
};

export default DropdownLabel;
