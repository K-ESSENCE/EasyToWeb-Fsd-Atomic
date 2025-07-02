import { getShapeStyleValues } from '../../utils/utils';
import { Shapes, TextStyleI } from '../types/common/layout';

interface DefaultProps {
  type: Shapes;
  titleStyle?: TextStyleI;
  describe?: string;
}

const MockCard = ({ type, titleStyle, describe }: DefaultProps) => {
  const shapeStyleValues = getShapeStyleValues(type, 'mock');

  const splitedDescribe = describe
    ?.split('<br/>')
    .map((line, idx) => (
      <p 
        key={idx}
        className="font-[350] text-[6px] leading-[10.14px] text-center"
      >
        {line}
      </p>
    ));

  return (
    <div 
      className="flex flex-col gap-[6px] text-center"
      style={{ width: shapeStyleValues.width }}
    >
      <div
        className="bg-[#f3f3f3]"
        style={{
          width: shapeStyleValues?.width,
          height: shapeStyleValues?.height,
          borderRadius: `${shapeStyleValues.borderRadius}%`,
        }}
      />
      <h1 
        className={`mb-[5px] text-xs ${titleStyle?.bold ? 'font-bold' : 'font-normal'}`}
        style={{ color: titleStyle?.color || 'black' }}
      >
        {titleStyle?.text}
      </h1>
      <div>{describe && splitedDescribe}</div>
    </div>
  );
};

export default MockCard;
