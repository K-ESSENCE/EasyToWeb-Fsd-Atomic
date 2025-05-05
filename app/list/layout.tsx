import AuthGuard from "../../components/AuthGuard";

const ListLayout = ({ children }: { children: React.ReactNode }) => {
  return <AuthGuard>{children}</AuthGuard>;
};

export default ListLayout;
