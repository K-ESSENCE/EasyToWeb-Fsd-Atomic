import FormField from '../molecules/FormField';
import Button from '../atoms/Button';
import SocialButton from '../molecules/SocialButton';

const Form: React.FC = () => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-sm">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">시작하기</h2>
        <p className="text-gray-600">계정을 만들고 무료로 시작해보세요</p>
      </div>
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
        <Button className="w-full !rounded-button bg-custom text-white py-3 px-4 font-medium hover:bg-custom/90">
          회원가입
        </Button>
        <Button className="w-full !rounded-button bg-white text-gray-700 py-3 px-4 font-medium border border-gray-300 hover:bg-gray-50">
          로그인
        </Button>
      </form>
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">또는</span>
          </div>
        </div>
        <div className=" mt-6 grid gap-4">
          <SocialButton platform="google" />
          {/* <SocialButton platform="naver" />
          <SocialButton platform="kakao" /> */}
        </div>
      </div>
    </div>
  );
};

export default Form;
