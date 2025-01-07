import NavItem from '../molecules/NavItem';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <a href="/" className="flex-shrink-0 flex items-center">
              <img
                className="h-8 w-auto"
                src="https://ai-public.creatie.ai/gen_page/logo_placeholder.png"
                alt="Easy Web Builder"
              />
              <span className="ml-2 text-xl font-bold text-gray-900">
                Easy Web Builder
              </span>
            </a>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-8">
            <NavItem href="#" label="서비스 소개" />
            <NavItem href="#" label="기능" />
            <NavItem href="#" label="디자인 가이드" />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
