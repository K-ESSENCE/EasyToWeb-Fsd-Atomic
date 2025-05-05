import NavItem from "../molecules/NavItem";
import Link from "next/link";

interface NavbarProps {
  settingsSidebar: boolean;
  sectionsSidebar: boolean;
}

const Navbar: React.FC<NavbarProps> = ({
  settingsSidebar,
  sectionsSidebar,
}) => {
  return (
    <nav
      className="fixed top-0 z-10 bg-white shadow-sm transition-all duration-200"
      style={{
        width:
          settingsSidebar && sectionsSidebar
            ? "calc(100% - 560px)"
            : settingsSidebar
              ? "calc(100% - 280px)"
              : sectionsSidebar
                ? "calc(100% - 280px)"
                : "100%",
        marginLeft: sectionsSidebar ? "280px" : "0px",
        marginRight: settingsSidebar ? "280px" : "0px",
      }}
    >
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <img
                className="h-8 w-auto"
                src="https://ai-public.creatie.ai/gen_page/logo_placeholder.png"
                alt="Easy Web Builder"
              />
              <span className="ml-2 text-xl font-bold text-gray-900">
                Easy Web Builder
              </span>
            </Link>
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
