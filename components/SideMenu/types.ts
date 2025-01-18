export type MenuType = 'settings' | 'sections';

export interface SideMenuProps {
  isOpen: boolean;
  onClose: (value: boolean) => void;
}

export interface Section {
  sectionKey: string;
  title: string;
}

export interface SectionItemProps {
  sectionId: string;
  isSelected: boolean;
  index: number;
  onSelect: (id: string) => void;
}

export interface MenuHeaderProps {
  title: string;
  onClose: () => void;
}
