// 섹션
export interface Section {
  sectionKey: string;
  title?: string;
  layout: LayoutConfig; // 배치 정보
  style?: SectionStyle; // 섹션 자체 스타일
  backgroundStyle?: BackgroundStyle; // 배경 스타일
  items: Item[]; // 내부 아이템 배열
}

export interface ItemBase<T extends Shapes = Shapes> {
  id: string;
  type: T;
  commonStyle?: CommonStyle;
  componentProps: ShapeComponentPropsMap[T];
}

// 아이템
export type Item = {
  id: string;
  type: Shapes;
  commonStyle?: CommonStyle;
  componentProps: ShapeComponentPropsMap[Shapes];
};

export type Shapes = "text" | "img" | "card" | "video" | "button";

export interface CommonStyle {
  width?: string;
  height?: string;
  margin?: string;
  padding?: string;
  backgroundColor?: string;
  borderRadius?: string;
}

export interface ShapeComponentPropsMap {
  text: TextProps;
  img: ImageProps;
  card: CardProps;
  video: ImageProps;
  button: TextProps;
}

export type ComponentProps = ShapeComponentPropsMap[Shapes];

export interface TextProps {
  text: string;
  textStyle?: TextStyle;
}

export interface ImageProps {
  url: string;
  imageStyle?: ImageStyle;
}

export interface CardProps {
  title: string;
  body: string;
  imageUrl?: string;
  actions?: string[];
  cardStyle?: CardStyle;
}

// layout 구성 (섹션 배치)
export interface LayoutConfig {
  type: "grid" | "flex" | "absolute";
  columns?: number; // grid일 때 사용
  gap?: number; // 간격 px
  height?: string; // 섹션 높이
  align?: "left" | "center" | "right"; // 전체 아이템 정렬
  justifyContent?: string; // flex 조정용
  alignItems?: string; // flex 조정용
}

// 섹션 스타일
export interface SectionStyle {
  padding?: string;
  margin?: string;
  borderRadius?: string;
}

// 섹션 배경
export interface BackgroundStyle {
  backgroundColor?: string;
  backgroundImage?: string; // URL or base64
  backgroundSize?: "cover" | "contain";
  backgroundPosition?: string; // "center", "top left"
  backgroundRepeat?: "no-repeat" | "repeat" | "repeat-x" | "repeat-y";
}

// 텍스트 스타일
export interface TextStyle {
  size?: string; // "16px"
  color?: string; // "#333"
  bold?: boolean;
  align?: "left" | "center" | "right";
  lineHeight?: string; // "1.5"
  letterSpacing?: string; // "0.5px"
  fontFamily?: string; // "Pretendard", "Arial"
  italic?: boolean;
  underline?: boolean;
}

// 이미지 스타일
export interface ImageStyle {
  borderColor?: string;
  borderWidth?: number;
  borderStyle?: string;
  borderRadius?: number;
  boxShadow?: string;
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
  aspectRatio?: string;
  opacity?: number;
}

export interface CardStyle {
  width: string;
  height: string;
  borderRadius: number | null;
}

export const createDefaultSection = (): Section => ({
  sectionKey: crypto.randomUUID(),
  title: "새 섹션",
  layout: {
    type: "grid",
    columns: 3,
    gap: 16,
    height: "auto",
    align: "center",
  },
  style: {
    padding: "16px",
    margin: "0 auto",
    borderRadius: "8px",
  },
  backgroundStyle: {
    backgroundColor: "#ffffff",
  },
  items: [],
});

export const createDefaultTextItem = (): Item => ({
  id: crypto.randomUUID(),
  type: "text",
  commonStyle: {
    width: "100%",
    height: "auto",
    margin: "0",
    padding: "8px",
  },
  componentProps: {
    text: "기본 텍스트",
    textStyle: {
      size: "16px",
      color: "#333",
      bold: false,
      align: "left",
      lineHeight: "1.5",
      letterSpacing: "0px",
    },
  },
});

export const createDefaultImageItem = (): Item => ({
  id: crypto.randomUUID(),
  type: "img",
  commonStyle: {
    backgroundColor: "#f0f0f0",
    width: "100%",
    height: "200px",
    margin: "0",
    padding: "0",
  },
  componentProps: {
    url: "",
    imageStyle: {
      borderColor: "#ccc",
      borderWidth: 1,
      borderStyle: "solid",
      borderRadius: 8,
    },
  },
});
