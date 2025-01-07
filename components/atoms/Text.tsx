
interface TextProps {
  children: React.ReactNode;
  href?: string;
  variant?: string;
}

const Text: React.FC<TextProps> = ({ children, href, variant }) => {
  if (href) {
    return (
      <a href={href} className={`text-${variant} hover:text-custom`}>
        {children}
      </a>
    );
  }
  return <span className={`text-${variant}`}>{children}</span>;
};

export default Text;
