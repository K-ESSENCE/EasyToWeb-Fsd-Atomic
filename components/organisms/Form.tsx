'use client'

import React, { useState } from 'react';
import Button from '../atoms/Button';
import FormField from '../molecules/FormField';
import SocialButton from '../molecules/SocialButton';

const Form = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (!value) {
      setEmailError('이메일을 입력해주세요.');
    } else if (!validateEmail(value)) {
      setEmailError('올바른 이메일 주소를 입력해주세요.');
    } else {
      setEmailError('');
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    if (!validatePassword(value)) {
      setPasswordError('비밀번호는 8자 이상이어야 하며, 영문, 숫자, 특수문자를 포함해야 합니다.');
    } else {
      setPasswordError('');
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmPassword(value);
    if (value !== password) {
      setConfirmPasswordError('비밀번호가 일치하지 않습니다.');
    } else {
      setConfirmPasswordError('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 여기에 회원가입 로직 추가
  };

  const handleVerification = () => {
    // 이메일 인증 로직 추가
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-sm">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{isSignUp ? '회원가입' : '시작하기'}</h2>
        <p className="text-gray-600">{isSignUp ? '간단한 정보를 입력하고 시작하세요' : '계정을 만들고 무료로 시작해보세요'}</p>
      </div>
      {!isSignUp ? (
        <form className="space-y-6">
          <FormField
            label="이메일"
            type="email"
            placeholder="your@email.com"
          />
          <FormField
            label="비밀번호"
            type="password"
            placeholder="••••••••"
          />
          <Button className="w-full !rounded-button bg-custom text-white py-3 px-4 font-medium hover:bg-custom/90" onClick={() => setIsSignUp(true)}>
            회원가입
          </Button>
          <Button className="w-full !rounded-button bg-white text-gray-700 py-3 px-4 font-medium border border-gray-300 hover:bg-gray-50">
            로그인
          </Button>
        </form>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">이메일</label>
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-custom focus:ring-custom focus:invalid:border-red-500 focus:invalid:ring-red-500"
              placeholder="your@email.com"
            />
            {emailError && <p className="mt-2 text-sm text-red-600">{emailError}</p>}
          </div>
          <div className="mt-4">
            <button
              type="button"
              onClick={handleVerification}
              className="mt-2 w-full !rounded-button bg-gray-200 text-gray-700 py-2 px-4 font-medium hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              인증번호 받기
            </button>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-custom focus:ring-custom focus:invalid:border-red-500 focus:invalid:ring-red-500"
              placeholder="••••••••"
            />
            {passwordError && <p className="mt-1 text-sm text-red-600">{passwordError}</p>}
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">비밀번호 확인</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-custom focus:ring-custom focus:invalid:border-red-500 focus:invalid:ring-red-500"
              placeholder="••••••••"
            />
            {confirmPasswordError && <p className="mt-1 text-sm text-red-600">{confirmPasswordError}</p>}
          </div>
          <div className="mt-6">
            <button
              type="submit"
              className="w-full !rounded-button bg-custom text-white py-3 px-4 font-medium hover:bg-custom/90"
            >
              가입하기
            </button>
          </div>
          <p className="mt-4 text-sm text-center text-gray-500">
            이미 계정이 있으신가요?{' '}
            <a href="#" className="text-custom hover:text-custom/90" onClick={(e) => { e.preventDefault(); setIsSignUp(false); }}>
              로그인하기
            </a>
          </p>
        </form>
      )}
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">또는</span>
          </div>
        </div>
        <div className="mt-6 grid gap-4">
          <SocialButton provider="google" />
        </div>
      </div>
    </div>
  );
};

export default Form;
