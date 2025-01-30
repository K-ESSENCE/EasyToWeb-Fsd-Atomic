'use client'

import React, { useState } from 'react';
import Button from '../atoms/Button';
import FormField from '../molecules/FormField';
import SocialButton from '../molecules/SocialButton';
import { useForm } from '../../hooks/useForm';

const Form = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const { formData, errors, handleChange, resetForm } = useForm();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 회원가입 로직 추가
    console.log('Form submitted:', formData);
  };

  const handleVerification = () => {
    // 이메일 인증 로직 추가
    console.log('Verification requested for:', formData.email);
    setShowVerification(true);
  };

  const toggleForm = () => {
    setIsSignUp(prev => !prev);
    resetForm();
  };

  const renderInitialForm = () => (
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
      <Button 
        className="w-full !rounded-button bg-custom text-white py-3 px-4 font-medium hover:bg-custom/90" 
        onClick={toggleForm}
      >
        회원가입
      </Button>
      <Button className="w-full !rounded-button bg-white text-gray-700 py-3 px-4 font-medium border border-gray-300 hover:bg-gray-50">
        로그인
      </Button>
    </form>
  );

  const renderSignUpForm = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">이메일</label>
        <input
          type="email"
          value={formData.email}
          onChange={handleChange('email')}
          className="w-full rounded-lg border-gray-300 shadow-sm focus:border-custom focus:ring-custom peer"
          placeholder="your@email.com"
        />
        <p className="mt-2 hidden peer-invalid:block text-sm text-red-600">올바른 이메일 주소를 입력해주세요.</p>
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
      {showVerification && (
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">인증번호</label>
          <div className="flex gap-2">
            <input
              type="text"
              className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-custom focus:ring-custom"
              placeholder="인증번호 6자리 입력"
              maxLength={6}
              value={formData.verificationCode || ''}
              onChange={handleChange('verificationCode')}
            />
            <button
              type="button"
              className="!rounded-button bg-custom text-white py-2 px-4 font-medium hover:bg-custom/90"
              onClick={() => console.log('Verification code submitted:', formData.verificationCode)}
            >
              확인
            </button>
          </div>
          <p className="mt-2 text-sm text-gray-500">인증번호가 발송되었습니다. (유효시간 3:00)</p>
        </div>
      )}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">비밀번호</label>
        <input
          type="password"
          value={formData.password}
          onChange={handleChange('password')}
          className="w-full rounded-lg border-gray-300 shadow-sm focus:border-custom focus:ring-custom focus:invalid:border-red-500 focus:invalid:ring-red-500"
          placeholder="••••••••"
        />
        {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
      </div>
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">비밀번호 확인</label>
        <input
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange('confirmPassword')}
          className="w-full rounded-lg border-gray-300 shadow-sm focus:border-custom focus:ring-custom focus:invalid:border-red-500 focus:invalid:ring-red-500"
          placeholder="••••••••"
        />
        {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
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
        <a href="#" className="text-custom hover:text-custom/90" onClick={(e) => { e.preventDefault(); toggleForm(); }}>
          로그인하기
        </a>
      </p>
    </form>
  );

  return (
    <div className="bg-white p-8 rounded-lg shadow-sm">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{isSignUp ? '회원가입' : '시작하기'}</h2>
        <p className="text-gray-600">{isSignUp ? '간단한 정보를 입력하고 시작하세요' : '계정을 만들고 무료로 시작해보세요'}</p>
      </div>
      {isSignUp ? renderSignUpForm() : renderInitialForm()}
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
