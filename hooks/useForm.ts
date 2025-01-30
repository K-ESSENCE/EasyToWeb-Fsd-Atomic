import { useState } from 'react';

interface FormState {
  email: string;
  password: string;
  confirmPassword: string;
  verificationCode: string;
}

interface FormErrors {
  email: string;
  password: string;
  confirmPassword: string;
  verificationCode: string;
}

export const useForm = () => {
  const [formData, setFormData] = useState<FormState>({
    email: '',
    password: '',
    confirmPassword: '',
    verificationCode: '',
  });

  const [errors, setErrors] = useState<FormErrors>({
    email: '',
    password: '',
    confirmPassword: '',
    verificationCode: '',
  });

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleChange = (name: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Validate fields
    switch (name) {
      case 'email':
        if (!value) {
          setErrors(prev => ({ ...prev, email: '이메일을 입력해주세요.' }));
        } else if (!validateEmail(value)) {
          setErrors(prev => ({ ...prev, email: '올바른 이메일 주소를 입력해주세요.' }));
        } else {
          setErrors(prev => ({ ...prev, email: '' }));
        }
        break;

      case 'password':
        if (!validatePassword(value)) {
          setErrors(prev => ({ ...prev, password: '비밀번호는 8자 이상이어야 하며, 영문, 숫자, 특수문자를 포함해야 합니다.' }));
        } else {
          setErrors(prev => ({ ...prev, password: '' }));
        }
        // Also validate confirm password if it exists
        if (formData.confirmPassword) {
          setErrors(prev => ({
            ...prev,
            confirmPassword: value !== formData.confirmPassword ? '비밀번호가 일치하지 않습니다.' : ''
          }));
        }
        break;

      case 'confirmPassword':
        setErrors(prev => ({
          ...prev,
          confirmPassword: value !== formData.password ? '비밀번호가 일치하지 않습니다.' : ''
        }));
        break;
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',  
      verificationCode: '',
    });
    setErrors({
      email: '',
      password: '',
      confirmPassword: '',
      verificationCode: '',
    });
  };

  return {
    formData,
    errors,
    handleChange,
    resetForm,
  };
};
