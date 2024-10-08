import { Button } from '@/components/ui/button';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import { Drink } from './PostStep2';
import { useEffect, useState } from 'react';
import { alcoholsData } from '@/data/alcoholsData';
import { Skeleton } from '@/components/ui/skeleton';

interface SearchResultsProps {
  nextStep: () => void;
  setDrinkData: React.Dispatch<React.SetStateAction<Drink>>;
  contents: Drink[];
  loading: boolean;
}

const SearchResults = ({ nextStep, setDrinkData, contents, loading }: SearchResultsProps) => {
  const navigate = useNavigate();
  const [isEmpty, setIsEmpty] = useState(false);

  const handleBtnClick = () => {
    nextStep();
  };

  useEffect(() => {
    if (contents.length === 0) {
      setIsEmpty(true);
    } else {
      setIsEmpty(false);
    }
  }, [contents]);

  return (
    <>
      {!loading && isEmpty ? (
        <NoResultsWrapper>
          <p>찾으시는 술이 없으신가요?</p>
          <Button onClick={() => navigate('/specialty-drink/form')}>특산주 등록하러 가기</Button>
        </NoResultsWrapper>
      ) : (
        <ResultsWrapper>
          {loading
            ? Array.from({ length: 9 }, (_, index) => (
                <SkeletonContainer key={index}>
                  <Skeleton />
                </SkeletonContainer>
              ))
            : contents.map((item, idx) => (
                <ListItem
                  key={idx}
                  onClick={() => {
                    setDrinkData(item);
                    handleBtnClick();
                  }}
                >
                  <img src={item.imageUrl} alt={item.name} />
                  <ImgDesc>
                    <b>{item.name}</b>
                    <span>{`주종 : ${alcoholsData[item.type]}`}</span>
                    <span>{`도수 : ${item.degree}%`}</span>
                  </ImgDesc>
                </ListItem>
              ))}
        </ResultsWrapper>
      )}
    </>
  );
};

const SkeletonContainer = styled.div`
  width: 100%;
  height: 80px;
  object-fit: contain;
  margin: 0 10px 5px 0;
  border-radius: 10px;
  > div {
    width: 100%;
    height: 100%;
    border-radius: 10px;
  }
`;

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
    object-fit: cover;
    border-radius: 10px;
    margin-right: 10px;
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
