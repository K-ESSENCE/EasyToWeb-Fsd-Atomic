import React from "react";
import apiHandler from "../../shared/api/axios";

interface SocialButtonProps {
  provider: "google" | "naver" | "kakao";
  onClick?: () => void;
}

const providerConfig = {
  google: {
    icon: <i className="fab fa-google text-red-500 mr-2"></i>,
    text: "Google",
  },
  naver: {
    icon: (
      <img
        src="https://ai-public.creatie.ai/gen_page/naver_icon.png"
        className="w-4 h-4 mr-2"
        alt="Naver"
      />
    ),
    text: "Naver",
  },
  kakao: {
    icon: (
      <img
        src="https://ai-public.creatie.ai/gen_page/kakao_icon.png"
        className="w-4 h-4 mr-2"
        alt="Kakao"
      />
    ),
    text: "Kakao",
  },
};

const SocialButton: React.FC<SocialButtonProps> = ({ provider, onClick }) => {
  const { icon, text } = providerConfig[provider];

  const handleClick = () => {
    // 소셜 로그인 로직 추가

    apiHandler.socialLogin(provider);

    console.log(`${provider} 로그인 시도`);
    if (onClick) {
      onClick();
    }
  };

  return (
    <button
      onClick={handleClick}
      className="!rounded-button flex items-center justify-center py-2 px-4 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
    >
      {icon}
      {text}
    </button>
  );
};

export default SocialButton;
