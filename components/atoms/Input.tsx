
interface InputProps {
  type: string;
  placeholder?: string;
  className?: string;
}

const Input: React.FC<InputProps> = ({ type, placeholder, className }) => {
  return (
    <input type={type} placeholder={placeholder} className={`rounded-lg border-gray-300 shadow-sm ${className}`} />
  );
};

export default Input;
