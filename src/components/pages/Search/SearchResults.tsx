import styled from '@emotion/styled';

const SearchResults = () => {
  const isEmpty = true;

  return (
    <>
      {isEmpty ? (
        <NoResultsWrapper>
          <p>검색 결과가 없습니다.</p>
        </NoResultsWrapper>
      ) : (
        <ResultsWrapper>
          <span>검색결과 (00개)</span>
        </ResultsWrapper>
      )}
    </>
  );
};

const NoResultsWrapper = styled.div`
  margin-top: 40px;
  color: ${({ theme }) => theme.colors.gray};
  font-size: ${({ theme }) => theme.fontSizes.base};
  text-align: center;
`;

const ResultsWrapper = styled.div`
  > span {
    display: inline-block;
    margin-bottom: 10px;
    color: ${({ theme }) => theme.colors.darkGray};
    font-size: ${({ theme }) => theme.fontSizes.base};
    font-weight: bold;
  }
`;

export default SearchResults;
