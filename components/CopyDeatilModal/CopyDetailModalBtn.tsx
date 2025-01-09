import { styled } from 'styled-components';

type BtnType = 'confirm' | 'close';

const CopyDetailModalBtn = ({ type, onClose }: { type: BtnType; onClose: () => void }) => {
  return (
    <Button onClick={onClose} type={type}>
      {type === 'close' ? '닫기' : '확인'}
    </Button>
  );
};

export default CopyDetailModalBtn;

const Button = styled.button<{ type: BtnType }>`
  letter-spacing: -1px;

  width: 307px;
  height: 53px;
  border: none;
  color: white;
  line-height: 23.87px;

  border-radius: ${(props) => (props.type === 'close' ? '0px 0px 0px 10px' : '0px 0px 10px 0px')};
  background-color: ${(props) =>
    props.type === 'close' ? props.theme.colors.grayscale80 : props.theme.colors.primary100};
  font: inherit;
  font-weight: 700;
  font-size: 20px;
  cursor: pointer;
`;
