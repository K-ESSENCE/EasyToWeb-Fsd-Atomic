import Icon from '../atoms/Icon';

interface SocialButtonProps {
  platform: 'google' | 'naver' | 'kakao';
  onClick?: () => void;
}

const platformDetails = {
  google: {
    icon: 'fab fa-google',
    color: 'text-red-500',
    label: 'Google',
  },
  naver: {
    icon: 'naver_icon.png',
    color: '',
    label: 'Naver',
  },
  kakao: {
    icon: 'kakao_icon.png',
    color: '',
    label: 'Kakao',
  },
};

const SocialButton: React.FC<SocialButtonProps> = ({ platform, onClick }) => {
  const { icon, color, label } = platformDetails[platform];
  return (
    <button
      onClick={onClick}
      className="!rounded-button flex items-center justify-center py-2 px-4 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
    >
      {platform === 'google' ? (
        <Icon name={icon} className={`${color} mr-2`} />
      ) : (
        <img src={icon} className="w-4 h-4 mr-2" alt={label} />
      )}
      {label}
    </button>
  );
};

export default SocialButton;
