import { Button } from '@/components/ui/button';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';

interface SearchResultsProps {
  nextStep: () => void;
}

const SearchResults = ({ nextStep }: SearchResultsProps) => {
  const navigate = useNavigate();
  const isEmpty = false;

  const handleBtnClick = () => {
    nextStep();
  };

  return (
    <>
      {isEmpty ? (
        <NoResultsWrapper>
          <p>찾으시는 술이 없으신가요?</p>
          <Button onClick={() => navigate('/specialty-drink/form')}>특산주 등록하러 가기</Button>
        </NoResultsWrapper>
      ) : (
        <ResultsWrapper>
          {Array.from({ length: 10 }, (_, idx) => (
            <ListItem key={idx} onClick={handleBtnClick}>
              <img src="https://picsum.photos/seed/picsum/50/60" alt="주류 이름" />
              <ImgDesc>
                <b>주류 이름</b>
                <span>종류 / 맛 / 도수 / 가격 정보</span>
              </ImgDesc>
            </ListItem>
          ))}
        </ResultsWrapper>
      )}
    </>
  );
};

const NoResultsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 200px;
  margin-top: 20px;
  color: ${({ theme }) => theme.colors.gray};
  font-size: ${({ theme }) => theme.fontSizes.base};

  button {
    margin-top: 10px;
    background-color: ${({ theme }) => theme.colors.primary};

    &:hover {
      background-color: ${({ theme }) => theme.colors.secondary};
    }
  }
`;

const ResultsWrapper = styled.div`
  width: 100%;
  min-height: 300px;
  height: auto;
  padding: 0 5px;
`;

const ListItem = styled(Button)`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  height: auto;
  padding: 10px;
  margin-bottom: 5px;
  background-color: ${({ theme }) => theme.colors.brightGray};
  color: ${({ theme }) => theme.colors.darkGray};
  border-radius: 10px;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.white};
  }

  &:nth-last-of-type(1) {
    margin-bottom: 0;
  }

  img {
    width: 50px;
    height: 60px;
    margin-right: 10px;
    border-radius: 10px;
    background-color: ${({ theme }) => theme.colors.gray};
  }
`;

const ImgDesc = styled.span`
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  b {
    font-size: ${({ theme }) => theme.fontSizes.small};
  }

  span {
    font-size: ${({ theme }) => theme.fontSizes.small};
  }
`;

export default SearchResults;
