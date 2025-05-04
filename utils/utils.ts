import { Shapes } from "../components/types/common/layoutStyle";
import { MOCK_SHAPE_SIZES, SHAPE_SIZES } from "./constants";

export function objDeepFreeze<T extends object, V extends keyof T>(obj: T): T {
  Object.keys(obj).forEach((key) => {
    const objProperty = obj[key as V];
    if (objProperty instanceof Object) {
      objDeepFreeze(objProperty);
    }
  });
  return Object.freeze(obj);
}

export function getShapeStyleValues(
  shapeType: Shapes,
  condition: "dynamic" | "mock"
) {
  const targetObj = condition === "mock" ? MOCK_SHAPE_SIZES : SHAPE_SIZES;

  switch (shapeType) {
    case "rectNormal":
      return targetObj.RECT.NORMAL;

    case "rectBig":
      return targetObj.RECT.BIG;

    case "rectSmall":
      return targetObj.RECT.SMALL;

    case "round":
      return targetObj.ROUND;

    case "defaultSection":
      return targetObj.SECTION;

    case "text":
      return targetObj.TEXT;

    case "img":
      return targetObj.IMG;

    default:
      const invalid: never = shapeType;
      throw new Error(`유효하지 않은 type: ${invalid}`);
  }
}
