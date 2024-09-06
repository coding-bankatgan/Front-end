import styled from '@emotion/styled';
import ArrowLeftIcon from './../../../assets/icons/ArrowLeftIcon';
import { Input } from '@/components/ui/input';
import { Line } from '../Home/Home';
import { Badge } from '@/components/ui/badge';
import handImg from '../../../assets/img/handimg.png';
import SearchResults from './SearchResults';

const Search = () => {
  return (
    <SearchLayout>
      <SearchFixed>
        <SearchTop>
          <ArrowLeftIcon />
          검색하기
        </SearchTop>
        <SearchContent>
          <Input placeholder="#달달한 술" />
          <span>찾고 싶은 게시글의 태그를 입력해 주세요.</span>
          <Line />
        </SearchContent>
      </SearchFixed>
      <SearchWrapper>
        <TagWrapper>
          <div>
            <img src={handImg} alt="추천" />
            {Array.from({ length: 15 }, (_, idx) => (
              <BadgeStyled variant="outline" key={idx}>
                #달달한
              </BadgeStyled>
            ))}
          </div>
        </TagWrapper>
        {/* <SearchResults /> */}
      </SearchWrapper>
    </SearchLayout>
  );
};

const SearchLayout = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  position: relative;
  min-width: 360px;
  width: 100%;
  max-width: auto;
  min-height: 100vh;
  height: auto;
  padding: 40px 20px 20px 20px;
  background-color: ${({ theme }) => theme.colors.lightGray};
`;

const SearchFixed = styled.section`
  position: fixed;
  top: 0;
  width: 100vw;
  height: auto;
  padding: 40px 20px 0;
  background-color: ${({ theme }) => theme.colors.lightGray};
  z-index: 10;
`;

const SearchTop = styled.div`
  display: flex;
  align-items: center;
  width: auto;
  color: ${({ theme }) => theme.colors.darkGray};
  font-size: ${({ theme }) => theme.fontSizes.small};
  font-weight: bold;

  svg {
    margin-left: -5px;
    margin-right: 10px;
    color: ${({ theme }) => theme.colors.darkGray};
  }
`;

const SearchContent = styled.div`
  margin-top: 20px;

  input {
    border: 1px solid ${({ theme }) => theme.colors.primary};
    border-radius: 20px;

    &:focus {
      box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.focusShadow};
    }
  }

  span {
    color: ${({ theme }) => theme.colors.darkGray};
    font-size: ${({ theme }) => theme.fontSizes.xsmall};
  }
`;

const SearchWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 320px;
  width: auto;
  height: 100%;
  margin-top: 160px;
`;

const TagWrapper = styled.div`
  padding: 0 5px;

  > div {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
  }

  img {
    margin: 0 5px 5px 0;
  }
`;

const BadgeStyled = styled(Badge)`
  padding: 6px 10px;
  margin: 0 5px 5px 0;
  background-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.secondary};
  font-weight: normal;
  border: 1px solid ${({ theme }) => theme.colors.secondary};
`;

export default Search;
