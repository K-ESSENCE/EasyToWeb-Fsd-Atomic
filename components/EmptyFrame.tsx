import { useRef, useEffect } from 'react';

interface DefaultProps {
  isEmpty: boolean;
  children: React.ReactNode;
}

const EmptyFrame = ({ isEmpty, children }: DefaultProps) => {
  useEffect(() => {
    if (sectionLayoutRef.current) {
      sectionLayoutRef.current.focus();
    }
  }, []);

  const sectionLayoutRef = useRef<HTMLDivElement | null>(null);

  return (
    <section 
      ref={sectionLayoutRef} 
      className={`relative ${isEmpty ? 'bg-gray-500 cursor-pointer' : 'bg-white cursor-default'}`}
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
