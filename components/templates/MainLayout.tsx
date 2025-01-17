'use client'

import { useSelector } from "react-redux";
import { RootState } from "../../store/configureStore";
import Navbar from "../organisms/Navbar";
import Footer from "../organisms/Footer";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const settingsSidebar = useSelector((state: RootState) => state.settings.isOpen);
  const sectionsSidebar = useSelector((state: RootState) => state.sections.isOpen);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar settingsSidebar={settingsSidebar} sectionsSidebar={sectionsSidebar} />
      <main className="flex-1 flex items-center pt-16">{children}</main>
      <Footer settingsSidebar={settingsSidebar} sectionsSidebar={sectionsSidebar} />
    </div>
  );
};

export default MainLayout;
