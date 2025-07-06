import { BlockDesingI } from "./LayoutModal";
import MockCard from "../Cards/MockCard";
import { Shapes } from "../types/common/layout";

const LayoutItemContainer = ({
  layoutItem,
  onClick,
}: {
  layoutItem: BlockDesingI;
  onClick: (blockDesignType: Shapes) => void;
}) => {
  const { title, describe, blockDesignType } = layoutItem;

  return (
    <div className="cursor-pointer flex items-center justify-center w-[300px] h-[152px] rounded-[10px] bg-white">
      <div onClick={() => onClick(blockDesignType)}>
        <MockCard
          titleStyle={{
            color: title?.color,
            bold: title?.bold,
          }}
          type={blockDesignType}
          describe={describe}
        ></MockCard>
      </div>
    </div>
  );
};

export default LayoutItemContainer;
