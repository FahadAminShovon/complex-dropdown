import { createContext, useContext, useId } from 'react';
import type { ObjectType } from './select.types';

type DropDownContextType = {
  menu: ObjectType | null;
  subMenu: ObjectType[];
  isOpen: boolean;
  openDropDown: () => void;
  closeDropDown: () => void;
  toggleDropDown: () => void;
  triggerId: string;
};

const DropDownContext = createContext<DropDownContextType | null>(null);

export const DropDownContextProvider = ({
  children,
  isOpen,
  openDropDown,
  closeDropDown,
  ...props
}: {
  children: React.ReactNode;
} & Omit<DropDownContextType, 'toggleDropDown' | 'triggerId'>) => {
  const triggerId = useId();
  const toggleDropDown = () => {
    if (isOpen) {
      closeDropDown();
    } else {
      openDropDown();
    }
  };
  return (
    <DropDownContext.Provider
      value={{
        ...props,
        toggleDropDown,
        isOpen,
        openDropDown,
        closeDropDown,
        triggerId,
      }}
    >
      {children}
    </DropDownContext.Provider>
  );
};

export const useDropDownContext = () => {
  const context = useContext(DropDownContext);
  if (!context) {
    throw new Error(
      'useDropDownContext must be used within a DropDownContextProvider',
    );
  }
  return context;
};
