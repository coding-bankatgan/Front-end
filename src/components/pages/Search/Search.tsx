import styled from '@emotion/styled';
import ArrowLeftIcon from './../../../assets/icons/ArrowLeftIcon';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import SearchIcon from './../../../assets/icons/SearchIcon';
import { useEffect, useState } from 'react';
import { fetchSuggestedDrinksApi, fetchSuggestedTagsApi } from '@/api/postApi';

interface SuggestedTag {
  tagId: number;
  tagName: string;
}

interface SuggestedDrink {
  drinkId: number;
  drinkName: string;
}

type SuggestedData = SuggestedTag | SuggestedDrink;

const Search = () => {
  const navigate = useNavigate();
  const [searchType, setSearchType] = useState<'tag' | 'drink'>('tag');
  const [suggestedData, setSuggestedData] = useState<SuggestedData[]>([]); // Top15

  const prevBtn = () => {
    navigate(-1);
  };

  useEffect(() => {
    const fetchData = async () => {
      let data;
      if (searchType === 'tag') {
        data = await fetchSuggestedTagsApi();
      } else if (searchType === 'drink') {
        data = await fetchSuggestedDrinksApi();
      }
      setSuggestedData(data);
    };

    fetchData();
  }, [searchType]);

  return (
    <SearchLayout>
      <SearchFixed>
        <SearchTop>
          <span onClick={prevBtn}>
            <ArrowLeftIcon />
          </span>
          검색하기
        </SearchTop>
        <SearchContent>
          <RadioGroupStyled
            defaultValue={searchType}
            onValueChange={value => setSearchType(value as 'tag' | 'drink')}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="tag" id="tag" />
              <Label htmlFor="tag">태그 검색</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="drink" id="drink" />
              <Label htmlFor="drink">특산주 검색</Label>
            </div>
          </RadioGroupStyled>
          <SearchInput>
            <Input placeholder={searchType === 'tag' ? '#달달한 술' : '오메기술'} />
            <SearchIcon />
          </SearchInput>
          <span>찾고 싶은 게시글의 태그 또는 특산주 이름을 입력해 주세요.</span>
        </SearchContent>
      </SearchFixed>
      <RecommendResultWrapper>
        <Recommend>
          <RecommendTitle>
            <b>
              이번 주{' '}
              <span>{searchType === 'tag' ? '인기 태그 Top 15' : '인기 특산주 Top 15'}</span>
            </b>
            <span>09.16 ~ 09.22 기준</span>
          </RecommendTitle>
          <RecommendContent>
            {suggestedData.map((item, idx) => (
              <div key={idx}>
                <span>{idx + 1}</span>
                <span>
                  {searchType === 'tag'
                    ? (item as SuggestedTag).tagName
                    : (item as SuggestedDrink).drinkName}
                </span>
              </div>
            ))}
          </RecommendContent>
        </Recommend>
        {/* 결과 입력 시 
        <SearchResults />*/}
      </RecommendResultWrapper>
    </SearchLayout>
  );
};

const SearchLayout = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  position: relative;
  width: 100%;
  max-width: auto;

  height: 100vh;
  padding-top: 220px;
  background-color: ${({ theme }) => theme.colors.brightGray};
`;

const SearchFixed = styled.section`
  position: fixed;
  top: 0;
  width: 100vw;
  height: 210px;
  padding: 40px 20px 0;
  background-color: ${({ theme }) => theme.colors.white};
  z-index: 10;
`;

const SearchTop = styled.div`
  display: flex;
  align-items: center;
  width: auto;
  color: ${({ theme }) => theme.colors.darkGray};
  font-size: ${({ theme }) => theme.fontSizes.medium};
  font-weight: bold;

  svg {
    margin-left: -5px;
    margin-right: 10px;
    color: ${({ theme }) => theme.colors.darkGray};
  }
`;

const RadioGroupStyled = styled(RadioGroup)`
  display: flex;
  margin-bottom: 10px;

  button {
    border: 1px solid ${({ theme }) => theme.colors.secondary};
  }

  button[aria-checked='true'] {
    background-color: ${({ theme }) => theme.colors.secondary};

    svg {
      color: ${({ theme }) => theme.colors.white};
    }
  }
`;

const SearchInput = styled.div`
  width: 100%;
  position: relative;

  input {
    height: 40px;
    padding-right: 45px;
    border: 1px solid ${({ theme }) => theme.colors.primary};
    border-radius: 20px;
    overflow: hidden;

    :focus {
      box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.focusShadow};
    }
  }

  svg {
    position: absolute;
    top: 10px;
    right: 15px;
    width: 20px;
    height: 20px;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const SearchContent = styled.div`
  margin-top: 30px;

  span {
    margin-bottom: 20px;
    color: ${({ theme }) => theme.colors.gray};
    font-size: ${({ theme }) => theme.fontSizes.xsmall};
  }
`;

const RecommendResultWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.white};
  border: 3px solid pink;
`;

const Recommend = styled.section`
  width: 100%;
  padding: 20px;
`;

const RecommendTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  b {
    span {
      background: linear-gradient(to top, rgba(255, 209, 140, 0.4) 45%, transparent 15%);
    }
  }

  > span {
    color: ${({ theme }) => theme.colors.darkGray};
    font-size: ${({ theme }) => theme.fontSizes.xsmall};
  }
`;
const RecommendContent = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  height: auto;

  div {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 50%;
    margin-bottom: 5px;
    padding: 5px 0;
    font-size: ${({ theme }) => theme.fontSizes.small};

    span:nth-of-type(1) {
      width: 15px;
      font-weight: bold;
      text-align: right;
    }

    span:nth-of-type(2) {
      margin-left: 8px;
    }
  }
`;

export default Search;
