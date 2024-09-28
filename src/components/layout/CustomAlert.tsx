import { useEffect } from 'react';
import styled from '@emotion/styled';

interface AlertProps {
  type: 'success' | 'error';
  message: string;
  onClose: () => void;
}

const CustomAlert = ({ type, message, onClose }: AlertProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return <AlertWrapper type={type}>{message}</AlertWrapper>;
};

const AlertWrapper = styled.div<{ type: 'success' | 'error' }>`
  position: fixed;
  width: 70%;
  top: 80px;
  left: 50%;
  padding: 10px 20px;
  background-color: ${({ theme, type }) =>
    type === 'success' ? theme.colors.success : theme.colors.error};
  border-radius: 5px;
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.fontSizes.xsmall};
  text-align: center;
  transform: translateX(-50%);
  z-index: 1000;
  animation: fadeOut 2s forwards;

  @keyframes fadeOut {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
`;

export default CustomAlert;
