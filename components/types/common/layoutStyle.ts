// 전체 데이터 구조

export interface LayoutData {
  layoutId: string;
  sectionValues: SectionData[];
}

export interface SectionData {
  sectionKey: string;
  layoutValues: LayoutItemValues[];
  title?: string; // 섹션 제목 추가
}

export interface LayoutItemValues {
  id: string;
  layoutName: Shapes;

  imgValue?: string;
  textValue?: string;
  titleValue?: string;
  descriptionValue?: string;
}

// Shapes는 추가 가능

export type Shapes =
  | "rectNormal"
  | "rectBig"
  | "rectSmall"
  | "round"
  | "defaultSection"
  | "text"
  | "img";

// Editable interface

export interface TextStyleI {
  text: string;

  size?: string;
  color?: string;
  bold?: boolean;
}

// Responsive

export type ResponsiveCondition = "mobile" | "desktop" | "tablet";

export interface ResponsiveState {
  width: string;
  isReponsive: boolean;
  state: ResponsiveCondition;
}
