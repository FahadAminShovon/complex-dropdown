import { createContext, useContext } from 'react';
import type { ObjectType } from './select.types';

type DropDownContextType = {
  menu: ObjectType | null;
  subMenu: ObjectType[];
  isOpen: boolean;
  openDropDown: () => void;
  closeDropDown: () => void;
  toggleDropDown: () => void;
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
} & Omit<DropDownContextType, 'toggleDropDown'>) => {
  const toggleDropDown = () => {
    if (isOpen) {
      closeDropDown();
    } else {
      openDropDown();
    }
  };
  return (
    <DropDownContext.Provider
      value={{ ...props, toggleDropDown, isOpen, openDropDown, closeDropDown }}
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
