import {
  BackgroundStyle,
  CommonStyle,
  ComponentProps,
  Item,
  LayoutConfig,
  Section,
  SectionStyle,
  Shapes
} from "../components/types/common/layout";

export function objDeepFreeze<T extends object, V extends keyof T>(obj: T): T {
  Object.keys(obj).forEach((key) => {
    const objProperty = obj[key as V];
    if (objProperty instanceof Object) {
      objDeepFreeze(objProperty);
    }
  });
  return Object.freeze(obj);
}

export const createSection = ({
                                layout,
                                style,
                                backgroundStyle,
                              }: {
  layout: LayoutConfig;
  style?: SectionStyle;
  backgroundStyle?: BackgroundStyle;
}): Section => {
  return {
    sectionKey: crypto.randomUUID(),
    layout,
    style,
    backgroundStyle,
    title: "",
    items: [],
  };
};


export const createItem = ({
                             type,
                             commonStyle = {},
                             componentProps,
                           }: {
  type: Shapes;
  commonStyle?: CommonStyle;
  componentProps?: Partial<ComponentProps>;
}): Item => {
  const id = crypto.randomUUID();

  // 기본 props 설정
  let finalProps: ComponentProps;

  switch (type) {
    case "text":
      finalProps = {
        text: "",
        textStyle: {
          size: "16px",
          color: "#000",
          align: "left",
          bold: false,
        },
        ...(componentProps as Partial<ComponentProps>),
      };
      break;

    case "img":
      finalProps = {
        url: "",
        imageStyle: {
          borderRadius: 0,
          borderColor: "#ccc",
          borderWidth: 0,
          borderStyle: "none",
        },
        ...(componentProps as Partial<ComponentProps>),
      };
      break;

    case "card":
      finalProps = {
        title: "제목",
        body: "내용",
        imageUrl: "",
        actions: [],
        ...(componentProps as Partial<ComponentProps>),
      };
      break;

    default:
      finalProps = componentProps as ComponentProps;
      break;
  }

  return {
    id,
    type: type,
    commonStyle,
    componentProps: finalProps,
  };
};
