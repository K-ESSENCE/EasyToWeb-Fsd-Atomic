import CardFrame from '../Cards/CardFrame';
import { SectionData } from '../types/common/layoutStyle';

interface DefaultProps {
  isSideOpen: boolean;
  isResponsive: boolean;
  sectionData: SectionData;
  selctedItemkey: string | null;
}

const EditableSection = ({
  isSideOpen,
  isResponsive,
  sectionData,
  selctedItemkey,
}: DefaultProps) => {
  return (
    <section
      className={`
        flex items-center justify-center gap-5 min-w-[300px] transition-all duration-400
        ${isSideOpen ? 'w-[calc(100%-413px)]' : 'w-full'}
        ${isResponsive ? 'w-full h-full min-h-[1080px] flex-col' : 'h-[380px] min-h-[380px]'}
        md:flex-col md:h-full
        sm:flex-col sm:h-full
      `}
    >
      {sectionData.layoutValues &&
        sectionData.layoutValues.map((layout) => {
          return (
            <CardFrame
              selctedItemkey={selctedItemkey}
              itemKey={layout.id}
              key={layout.id}
              titleStyle={{ text: '임시' }}
              shapeType={layout.layoutName}
            ></CardFrame>
          );
        })}
    </section>
  );
};

export default EditableSection;
