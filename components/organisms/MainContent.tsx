import { ResponsiveState, SectionData } from '../types/common/layoutStyle';
import AddSectionButton from '../atoms/AddSectionButton';
import EmptyFrame from '../EmptyFrame';
import SectionFrame from '../SectionLayout/SectionFrame';

interface MainContentProps {
  layoutDatas: SectionData[];
  selectedItemKey: string | null;
  nowSectionKey: string | null;
  settingsSidebar: boolean;
  sectionsSidebar: boolean;
  responsiveStyle: ResponsiveState;
  onAddFirstSection: () => void;
}

const MainContent = ({ 
  layoutDatas, 
  selectedItemKey,
  nowSectionKey,
  settingsSidebar,
  sectionsSidebar,
  responsiveStyle,
  onAddFirstSection
}: MainContentProps) => (
  <div 
    className="flex flex-col gap-5 transition-all duration-200 px-8 py-6"
    style={{ 
      width: settingsSidebar && sectionsSidebar ? 'calc(100% - 560px)' :
             settingsSidebar ? 'calc(100% - 280px)' :
             sectionsSidebar ? 'calc(100% - 280px)' :
             responsiveStyle.width,
      marginLeft: sectionsSidebar ? '280px' : '0px',
      marginRight: settingsSidebar ? '280px' : '0px'
    }}
  >
    {layoutDatas.length === 0 && (
      <AddSectionButton onClick={onAddFirstSection} isResponsive={responsiveStyle.isReponsive} />
    )}

    {layoutDatas.map((section, key) => (
      <EmptyFrame key={key} isEmpty={section.layoutValues.length === 0}>
        <SectionFrame
          selectedItemKey={selectedItemKey}
          selectedSectionkey={nowSectionKey}
          shapeType="defaultSection"
          sectionKey={section.sectionKey}
          isSideOpen={settingsSidebar}
          isResponsive={responsiveStyle.isReponsive}
          sectionData={section}
        />
      </EmptyFrame>
    ))}
  </div>
);

export default MainContent;
