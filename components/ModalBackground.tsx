import { createPortal } from 'react-dom';

const ModalBackground = ({ isOpen, children }: { isOpen: boolean; children: React.ReactNode }) => {
  if (!isOpen) return null;
  return createPortal(
    <section className="fixed top-0 left-0 w-full h-full bg-black/40">
      {children}
    </section>,
    document.getElementById('modal') as HTMLElement,
  );
};

export default ModalBackground;
