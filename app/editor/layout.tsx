import AuthGuard from "../../components/AuthGuard";

const EditorLayout = ({ children }: { children: React.ReactNode }) => {
  return <AuthGuard>{children}</AuthGuard>;
};

export default EditorLayout;
