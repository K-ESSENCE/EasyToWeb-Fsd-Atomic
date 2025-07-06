import { Shapes, TextStyle } from "../types/common/layout";

interface DefaultProps {
  type: Shapes;
  titleStyle?: TextStyle;
  describe?: string;
}

const MockCard = ({ type, titleStyle, describe }: DefaultProps) => {
  const shapeStyleValues = {
    width: 100,
    height: 100,
    borderRadius: 10,
  };

  const splitedDescribe = describe?.split("<br/>").map((line, idx) => (
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
        className={`mb-[5px] text-xs ${titleStyle?.bold ? "font-bold" : "font-normal"}`}
        style={{ color: titleStyle?.color || "black" }}
      >
        {type}
      </h1>
      <div>{describe && splitedDescribe}</div>
    </div>
  );
};

export default MockCard;
