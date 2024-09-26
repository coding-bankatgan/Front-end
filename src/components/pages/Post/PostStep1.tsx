import styled from '@emotion/styled';
import { Button } from '@/components/ui/button';

interface PostStep1Props {
  nextStep: () => void;
  setCategory: React.Dispatch<React.SetStateAction<string>>;
}

const PostStep1 = ({ nextStep, setCategory }: PostStep1Props) => {
  return (
    <>
      <Title>어떤 글을 작성하실 건가요?</Title>
      <ButtonWrapper>
        <Button
          onClick={() => {
            setCategory('REVIEW');
            nextStep();
          }}
        >
          리뷰
        </Button>
        <Button
          onClick={() => {
            setCategory('AD');
            nextStep();
          }}
        >
          광고
        </Button>
      </ButtonWrapper>
    </>
  );
};

export const Title = styled.b`
  display: inline-block;
  width: 100%;
  padding: 0 20px 20px 20px;
  background-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.black};
  font-size: ${({ theme }) => theme.fontSizes.medium};
`;

const ButtonWrapper = styled.div`
  width: 100%;
  height: calc(100vh - 171px);
  padding: 0 20px;
  background-color: ${({ theme }) => theme.colors.white};

  button {
    width: 100%;
    height: 50px;
    background-color: ${({ theme }) => theme.colors.brightGray};
    color: ${({ theme }) => theme.colors.darkGray};
    font-size: ${({ theme }) => theme.fontSizes.base};
    border-radius: 10px;

    svg {
      display: none;
    }

    &:focus,
    &:hover,
    &:active {
      background-color: ${({ theme }) => theme.colors.primary};
      color: ${({ theme }) => theme.colors.white};
    }
  }

  button:nth-of-type(1) {
    margin-bottom: 10px;
  }
`;

export default PostStep1;
