import CopyDetailModalBtn from './CopyDetailModalBtn';
import CopyDetailModalInput from './CopyDetailModalInput';
import ModalBackground from '../ModalBackground';

const CopyDetailModal = ({
  isOpen,
  onModalBtnClose,
  type,
  url,
}: {
  isOpen: boolean;
  type: 'copy' | 'detail';
  url: string;
  onModalBtnClose: () => void;
}) => {
  return (
    <ModalBackground isOpen={isOpen}>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[614px] h-[316px]">
        <div className="box-border p-[40px_19px_89px_19px] w-full h-[calc(316px-53px)] shadow-[0px_4px_8px_0px_#00000040] bg-white rounded-t-[10px]">
          <p className="tracking-[-1px] font-bold text-xl leading-6 mb-[19px]">
            {type === 'copy' ? '페이지 복제' : '페이지 상세'}
          </p>
          <div className="flex flex-col gap-[13px]">
            <CopyDetailModalInput value="내게 맞는 북클럽 찾기" type="name" />
            <CopyDetailModalInput type="url" />
          </div>
          <p className="tracking-[-1px] mt-[18px] text-sm font-normal leading-[16.71px]">
            {url}
          </p>
        </div>

        <div className="w-[614px]">
          <CopyDetailModalBtn onClose={onModalBtnClose} type="close" />
          <CopyDetailModalBtn onClose={onModalBtnClose} type="confirm" />
        </div>
      </div>
    </ModalBackground>
  );
};

export default CopyDetailModal;
