import CardFrame from "../Cards/CardFrame";
import { SectionData } from "../types/common/layoutStyle";

interface DefaultProps {
  // isResponsive: boolean;
  sectionData: SectionData;
  selctedItemkey: string | null;
  imageUrlsMap?: any; // Y.Map<any> 타입
}

const EditableSection = ({
  // isResponsive,
  sectionData,
  selctedItemkey,
  imageUrlsMap,
}: DefaultProps) => {
  return (
    <section
      className={`
        flex items-center justify-center gap-5  transition-all duration-400
w-full      `}
    >
      {sectionData.layoutValues &&
        sectionData.layoutValues.map((layout) => {
          return (
            <CardFrame
              selctedItemkey={selctedItemkey}
              itemKey={layout.id}
              key={layout.id}
              titleStyle={{ text: "임시" }}
              shapeType={layout.layoutName}
              imageUrlsMap={imageUrlsMap}
            ></CardFrame>
          );
        })}
    </section>
  );
};

export default EditableSection;
