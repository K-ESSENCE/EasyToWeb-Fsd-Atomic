import { objDeepFreeze } from './utils';

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
}

export const MAX_LAYOUT_VALUE = 6;

export const RESPONSIVE_VALUES = Object.freeze({
  DESKTOP: '1980px',
  TABLET: '768px',
  MOBILE: '480px',
});

const SHAPE_SIZES_OBJ: CardConstantI = {
  RECT: {
    NORMAL: {
      width: '230px',
      height: '182px',
      borderRadius: null,
    },
    BIG: { width: '360px', height: '270px', borderRadius: null },
    SMALL: { width: '157px', height: '157px', borderRadius: null },
  },
  ROUND: { width: '157px', height: '157px', borderRadius: 100 },
  SECTION: {
    width: '100vw',
    height: '160px',
    borderRadius: null,
  },
};

const MOCK_SHAPE_SIZES_OBJ: CardConstantI = {
  RECT: {
    NORMAL: {
      width: '72px',
      height: '68px',
      borderRadius: null,
    },
    BIG: { width: '124px', height: '66px', borderRadius: null },
    SMALL: { width: '157px', height: '58px', borderRadius: null },
  },
  ROUND: { width: '85px', height: '85px', borderRadius: 100 },
  SECTION: {
    width: '100vw',
    height: '160px',
    borderRadius: null,
  },
};

export const SHAPE_SIZES = objDeepFreeze(SHAPE_SIZES_OBJ);

export const MOCK_SHAPE_SIZES = objDeepFreeze(MOCK_SHAPE_SIZES_OBJ);
