import styled from '@emotion/styled';
import { Progress } from '@/components/ui/progress';
import ArrowLeftIcon from '@/assets/icons/ArrowLeftIcon';

interface ChangePageProps {
  prevStep: () => void;
  progressValue: number;
}

const ChangePage = ({ prevStep, progressValue }: ChangePageProps) => {
  return (
    <ChangePageContainer>
      <div onClick={prevStep}>
        <ArrowLeftIcon />
      </div>
      <ProgressStyled value={progressValue} />
    </ChangePageContainer>
  );
};

const ChangePageContainer = styled.section`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 20px 40px 20px 20px;
  background-color: ${({ theme }) => theme.colors.white};

  svg {
    margin-left: -5px;
    color: ${({ theme }) => theme.colors.darkGray};
  }
`;

const ProgressStyled = styled(Progress)`
  width: 155px;
  height: 7px;
  margin: auto;

  div {
    background-color: ${({ theme }) => theme.colors.primary};
  }
`;

export default ChangePage;
