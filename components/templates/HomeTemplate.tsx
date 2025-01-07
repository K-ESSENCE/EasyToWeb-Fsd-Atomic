import Form from '../organisms/Form';
import Icon from '../atoms/Icon';

const HomeTemplate: React.FC = () => {
  return (
      <div className="h-auto max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              웹사이트 제작이<br />이렇게 쉬워질 수 있습니다
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Noto Sans KR 폰트를 사용하여 가독성과 현대적인 느낌을 살렸습니다.<br />
              한글 디지털 환경에 최적화된 폰트로 전문성과 신뢰도를 높였습니다.
            </p>
            <div className="grid grid-cols-3 gap-6 mb-12">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <Icon name="fas fa-paint-brush" className="text-custom text-2xl mb-4" />
                <h3 className="font-bold text-lg mb-2">직관적인 디자인</h3>
                <p className="text-gray-600">드래그 앤 드롭으로 쉽게 디자인하세요</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <Icon name="fas fa-mobile-alt" className="text-custom text-2xl mb-4" />
                <h3 className="font-bold text-lg mb-2">반응형 지원</h3>
                <p className="text-gray-600">모든 디바이스에 최적화된 화면</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <Icon name="fas fa-palette" className="text-custom text-2xl mb-4" />
                <h3 className="font-bold text-lg mb-2">모던한 디자인</h3>
                <p className="text-gray-600">깔끔한 레이아웃과 여백으로 시각적 편안함 제공</p>
              </div>
            </div>
          </div>
          <Form />
        </div>
      </div>
  );
};

export default HomeTemplate;
