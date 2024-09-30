import ArrowLeftIcon from '@/assets/icons/ArrowLeftIcon';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';

const PrevBtn = () => {
  const navigate = useNavigate();

  const prevBtn = () => {
    navigate(-1);
  };

  return (
    <PrevBtnContainer aria-label="뒤로가기">
      <div onClick={prevBtn}>
        <ArrowLeftIcon />
      </div>
    </PrevBtnContainer>
  );
};

const PrevBtnContainer = styled.section`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 5px;

  svg {
    margin-left: -5px;
    color: ${({ theme }) => theme.colors.darkGray};
  }
`;

export default PrevBtn;
