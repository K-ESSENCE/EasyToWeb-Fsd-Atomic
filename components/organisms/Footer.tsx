import Text from '../atoms/Text';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center justify-between sm:flex-row">
          <Text variant="footer">
            © 2025 Easy Web Builder. All rights reserved.
          </Text>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <Text href="#" variant="footer">이용약관</Text>
            <Text href="#" variant="footer">개인정보처리방침</Text>
            <Text href="#" variant="footer">고객지원</Text>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
