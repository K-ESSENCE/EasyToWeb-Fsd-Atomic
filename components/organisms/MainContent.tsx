import { SectionData } from "../types/common/layoutStyle";
import SectionFrame from "../SectionLayout/SectionFrame";

interface MainContentProps {
  layoutDatas: SectionData[];
  selectedItemKey: string | null;
  nowSectionKey: string | null;
  imageUrlsMap?: any; // Y.Map<any> 타입
}

const MainContent = ({
  layoutDatas,
  selectedItemKey,
  nowSectionKey,
  imageUrlsMap,
}: MainContentProps) => (
  <div className="flex-col gap-5 transition-all duration-200 px-8 py-6 min-h-screen overflow-y-auto  mb-[80px]">
    {layoutDatas.map((section, key) => (
      <SectionFrame
        key={key}
        isEmpty={section.layoutValues.length === 0}
        selctedItemkey={selectedItemKey}
        selectedSectionkey={nowSectionKey}
        shapeType="defaultSection"
        sectionKey={section.sectionKey}
        sectionData={section}
        imageUrlsMap={imageUrlsMap}
      ></SectionFrame>
    ))}
  </div>
);

export default MainContent;
