import Text from '../atoms/Text';

interface FooterProps {
  settingsSidebar: boolean;
  sectionsSidebar: boolean;
}

const Footer = ({ settingsSidebar, sectionsSidebar }: FooterProps) => {
  return (
    <footer 
      className="fixed bottom-0 z-10 bg-white shadow-sm transition-all duration-200"
      style={{ 
        width: settingsSidebar && sectionsSidebar ? 'calc(100% - 560px)' :
               settingsSidebar ? 'calc(100% - 280px)' :
               sectionsSidebar ? 'calc(100% - 280px)' :
               '100%',
        marginLeft: sectionsSidebar ? '280px' : '0px',
        marginRight: settingsSidebar ? '280px' : '0px'
      }}
    >
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col items-center justify-between sm:flex-row">
          <Text variant="footer">
            &copy; 2025 Easy Web Builder. All rights reserved.
          </Text>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <Text href="#" variant="footer">이용약관</Text>
            <Text href="#" variant="footer">개인정보처리방침</Text>
            <Text href="#" variant="footer">문의하기</Text>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
