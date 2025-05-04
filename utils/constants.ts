import { objDeepFreeze } from "./utils";

export interface CardStyleI {
  width: string;
  height: string;
  borderRadius: number | null;
}

interface CardConstantI {
  RECT: {
    NORMAL: CardStyleI;
    BIG: CardStyleI;
    SMALL: CardStyleI;
  };
  ROUND: CardStyleI;
  SECTION: CardStyleI;
  TEXT: CardStyleI;
  IMG: CardStyleI;
}

export const MAX_LAYOUT_VALUE = 6;

export const RESPONSIVE_VALUES = Object.freeze({
  DESKTOP: "1980px",
  TABLET: "768px",
  MOBILE: "480px",
});

const SHAPE_SIZES_OBJ: CardConstantI = {
  RECT: {
    NORMAL: {
      width: "230px",
      height: "182px",
      borderRadius: null,
    },
    BIG: { width: "360px", height: "270px", borderRadius: null },
    SMALL: { width: "157px", height: "157px", borderRadius: null },
  },
  ROUND: { width: "157px", height: "157px", borderRadius: 100 },
  SECTION: {
    width: "100%",
    height: "160px",
    borderRadius: null,
  },
  TEXT: {
    width: "383px",
    height: "160px",
    borderRadius: null,
  },
  IMG: {
    width: "200px",
    height: "160px",
    borderRadius: null,
  },
};

const MOCK_SHAPE_SIZES_OBJ: CardConstantI = {
  RECT: {
    NORMAL: {
      width: "72px",
      height: "68px",
      borderRadius: null,
    },
    BIG: { width: "120px", height: "90px", borderRadius: null },
    SMALL: { width: "52px", height: "52px", borderRadius: null },
  },
  ROUND: { width: "52px", height: "52px", borderRadius: 100 },
  SECTION: {
    width: "100%",
    height: "160px",
    borderRadius: null,
  },
  TEXT: {
    width: "383px",
    height: "160px",
    borderRadius: null,
  },
  IMG: {
    width: "100%",
    height: "160px",
    borderRadius: null,
  },
};

export const SHAPE_SIZES = objDeepFreeze(SHAPE_SIZES_OBJ);

export const MOCK_SHAPE_SIZES = objDeepFreeze(MOCK_SHAPE_SIZES_OBJ);
