import Input from '../atoms/Input';
import Text from '../atoms/Text';

interface FormFieldProps {
  label: string;
  type: string;
  placeholder?: string;
}

const FormField: React.FC<FormFieldProps> = ({ label, type, placeholder }) => {
  return (
    <div className=' flex items-center gap-4' >
      <Text variant=" w-20 form-label">{label}</Text>
      <Input className=' flex-1' type={type} placeholder={placeholder} />
    </div>
  );
};

export default FormField;
