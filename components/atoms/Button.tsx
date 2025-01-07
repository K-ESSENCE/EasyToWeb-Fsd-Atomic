
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ children, onClick, className }) => {
  return (
    <button onClick={onClick} className={`py-2 px-4 font-medium ${className}`}>
      {children}
    </button>
  );
};

export default Button;
