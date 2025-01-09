import styled from 'styled-components';

const CopyDetailModalInput = ({ type, value }: { type: 'name' | 'url'; value?: string }) => {
  return (
    <ModalInput
      value={value && value}
      placeholder={type === 'name' ? '페이지명' : '페이지 주소'}
    ></ModalInput>
  );
};

export default CopyDetailModalInput;

const ModalInput = styled.input`
  padding: 15.5px 0 15.5px 10px;
  width: 100%;
  border: none;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.colors.grayscale5};
  font: inherit;
  color: ${({ theme }) => theme.colors.grayscale100};
  line-height: 16.71px;
  letter-spacing: -1px;
  font-weight: 400;

  &::placeholder {
    font: inherit;
    font-weight: 400;
    font-size: 14px;
    line-height: 16.71px;
    color: ${({ theme }) => theme.colors.grayscale30};
    letter-spacing: -1px;
  }
`;
