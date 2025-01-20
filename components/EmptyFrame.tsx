import { useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { changeNowSectionKey, changeNowItemKey } from '../store/slices/keys';

interface DefaultProps {
  isEmpty: boolean;
  children: React.ReactNode;
  sectionKey?: string;
}

const EmptyFrame = ({ isEmpty, children, sectionKey }: DefaultProps) => {
  const sectionLayoutRef = useRef<HTMLDivElement | null>(null);     
  const dispatch = useDispatch();

  useEffect(() => {
    if (isEmpty && sectionLayoutRef.current) {
      sectionLayoutRef.current.focus();
    }
  }, [isEmpty]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (isEmpty && sectionKey && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      dispatch(changeNowSectionKey(sectionKey));
      dispatch(changeNowItemKey(''));
    }
  };

  const handleClick = () => {
    if (isEmpty && sectionKey) {
      dispatch(changeNowSectionKey(sectionKey));
      dispatch(changeNowItemKey(''));
    }
  };

  return (
    <section
      ref={sectionLayoutRef} 
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onClick={isEmpty ? handleClick : undefined}
      className={`scroll-x-auto overflow-hidden relative ${isEmpty ? 'bg-gray-500 cursor-pointer' : 'bg-white cursor-default'}`}
    >
      {isEmpty && (
        <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white">
          아이템을 추가해주세요
        </p>
      )}
      {children}
    </section>
  );
};

export default EmptyFrame;
