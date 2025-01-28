import Dialog from '../atoms/Dialog';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'success' | 'error';
  title: string;
  message: string;
}

export default function AuthModal({ isOpen, onClose, type, title, message }: AuthModalProps) {
  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <div className="text-center">
        <i className={`fas fa-${type === 'success' ? 'check' : 'times'}-circle text-${type === 'success' ? 'green' : 'red'}-500 text-4xl mb-4`}></i>
        <h3 className="text-xl font-bold mb-2">
          {title}
        </h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <button
          onClick={onClose}
          className={`w-full bg-${type === 'success' ? 'green' : 'red'}-500 text-white py-2 px-4 rounded-lg hover:bg-${type === 'success' ? 'green' : 'red'}-600 transition-colors`}
        >
          확인
        </button>
      </div>
    </Dialog>
  );
}
