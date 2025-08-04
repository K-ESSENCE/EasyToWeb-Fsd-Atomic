"use client";


interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {

  return (
    <div className="min-h-screen flex flex-col">
      <main>{children}</main>
    </div>
  );
};

export default MainLayout;
