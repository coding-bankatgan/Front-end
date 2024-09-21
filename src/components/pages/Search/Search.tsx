import styled from '@emotion/styled';
import ArrowLeftIcon from './../../../assets/icons/ArrowLeftIcon';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import SearchIcon from './../../../assets/icons/SearchIcon';
import { useEffect, useState } from 'react';
import {
  fetchAutoCompleteDrinkApi,
  fetchAutoCompleteTagApi,
  fetchSuggestedDrinksApi,
  fetchSuggestedTagsApi,
} from '@/api/postApi';
import { Badge } from '@/components/ui/badge';
import CloseIcon from './../../../assets/icons/CloseIcon';

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
  const [inputValue, setInputValue] = useState<string>(''); // 기본 값은 태그일 때 #으로 시작
  const [tags, setTags] = useState<{ id: number; name: string }[]>([]); // input 뱃지로 변환
  const [autoCompleteData, setAutoCompleteData] = useState<string[]>([]); // 자동완성 데이터
  const [isAutoVisible, setIsAutoVisible] = useState(false); // 자동완성 비활성화
  const [isInputDisabled, setIsInputDisabled] = useState(false); // 입력 필드 비활성화

  const prevBtn = () => {
    navigate(-1);
  };

  /** 검색 페이지 진입 시 Top15 데이터 불러오기 */
  useEffect(() => {
    const fetchData = async () => {
      let data;
      if (searchType === 'tag') {
        setInputValue('#');
        data = await fetchSuggestedTagsApi();
      } else if (searchType === 'drink') {
        setInputValue('');
        data = await fetchSuggestedDrinksApi();
      }
      setSuggestedData(data);
    };

    fetchData();
  }, [searchType]);

  /** 입력 값이 변경될 때 자동완성 데이터 업데이트 */
  useEffect(() => {
    const fetchAutoCompleteData = async () => {
      if (inputValue.trim().length > 1) {
        let data;
        if (searchType === 'tag') {
          data = await fetchAutoCompleteTagApi(inputValue.replace('#', ''));
        } else if (searchType === 'drink') {
          data = await fetchAutoCompleteDrinkApi(inputValue);
        }
        setAutoCompleteData(data || []);
        setIsAutoVisible(true);
      } else {
        setAutoCompleteData([]);
        setIsAutoVisible(false);
      }
    };

    fetchAutoCompleteData();
  }, [inputValue, searchType]);

  /** input value값 변경 */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // 태그 검색일 때에는 자동으로 # 붙이기
    if (searchType === 'tag') {
      // # 뒤에 공백이 오는 것을 방지
      if (value === '# ') {
        return;
      }

      if (!value.startsWith('#')) {
        setInputValue(`#${value.replace(/^#+/, '')}`);
      } else {
        setInputValue(value);
      }
    } else {
      setInputValue(value);
    }
  };

  /** 자동완성 항목 클릭 시 # 추가 */
  const handleAutoCompleteClick = (item: string) => {
    if (searchType === 'tag') {
      setInputValue(`#${item}`);
    } else {
      setInputValue(item);
    }
    setIsAutoVisible(false);
  };

  /** 태그 추가 (=뱃지 변환) */
  const handleTagAdd = () => {
    if (inputValue.trim() && inputValue.trim() !== '#') {
      setTags([{ id: Date.now(), name: inputValue.trim() }]);
      setInputValue('#');
      setIsAutoVisible(false);
      setIsInputDisabled(true);
    }
  };

  /** 뱃지 삭제 */
  const handleBadgeRemove = () => {
    setTags([]);
    setInputValue('#');
    setIsInputDisabled(false);
  };

  /** Enter 클릭 시 태그 추가 */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();

      if (searchType === 'tag' && (inputValue === '#' || inputValue.trim() === '')) {
        // 기본 #만 있을 때는 엔터 눌러도 아무 것도 하지 않음
        return;
      }

      handleTagAdd();
      setInputValue('');
    }
  };

  /** Recommend 컴포넌트 hidden */
  const showRecommend =
    searchType === 'tag'
      ? (inputValue.length <= 1 || inputValue === '#') && tags.length === 0
      : inputValue.trim() === '' && tags.length === 0;

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
            {/* 뱃지 UI */}
            {tags.length > 0 && (
              <BadgeStyled key={tags[0].id}>
                <div>
                  <span>{tags[0].name}</span>
                  <span onClick={handleBadgeRemove}>
                    <CloseIcon />
                  </span>
                </div>
              </BadgeStyled>
            )}
            <Input
              value={inputValue}
              onChange={handleInputChange}
              placeholder={searchType === 'tag' ? '#달달한 술' : '오메기술'}
              onKeyDown={handleKeyDown}
              disabled={isInputDisabled}
            />
            <SearchIcon />
            {/* 자동완성 UI */}
            {isAutoVisible && autoCompleteData.length > 0 && (
              <AutoCompleteList>
                {autoCompleteData.map((item, idx) => (
                  <AutoCompleteItem key={idx} onClick={() => handleAutoCompleteClick(item)}>
                    {item}
                  </AutoCompleteItem>
                ))}
              </AutoCompleteList>
            )}
          </SearchInput>
          <span>찾고 싶은 게시글의 태그 또는 특산주 이름을 입력해 주세요.</span>
        </SearchContent>
      </SearchFixed>
      <RecommendResultWrapper>
        {showRecommend && (
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
        )}
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
    border: 1px solid ${({ theme }) => theme.colors.secondary};

    svg {
      color: ${({ theme }) => theme.colors.white};
      width: 10px;
      height: 10px;
      margin-top: 2px;
    }
  }
`;

const SearchInput = styled.div`
  position: relative;
  width: 100%;

  input {
    height: 40px;
    padding-right: 45px;
    border: 1px solid ${({ theme }) => theme.colors.primary};
    border-radius: 20px;
    overflow: hidden;
    position: relative;
    z-index: 5;

    :focus {
      box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.focusShadow};
    }
  }

  > svg {
    position: absolute;
    top: 10px;
    right: 15px;
    width: 20px;
    height: 20px;
    color: ${({ theme }) => theme.colors.primary};
    z-index: 5;
  }
`;

const BadgeStyled = styled(Badge)`
  position: absolute;
  top: 50%;
  left: 5px;
  transform: translateY(-50%);
  width: auto;
  height: 30px;
  background-color: ${({ theme }) => theme.colors.secondary};
  font-size: ${({ theme }) => theme.fontSizes.small};
  font-weight: normal;
  z-index: 10;

  :hover {
    background-color: ${({ theme }) => theme.colors.secondary};
  }

  div {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 20px;
  }

  span:nth-of-type(1) {
    color: ${({ theme }) => theme.colors.white};
    font-size: ${({ theme }) => theme.fontSizes.small};
  }

  span:nth-of-type(2) {
    color: ${({ theme }) => theme.colors.white};
    font-size: ${({ theme }) => theme.fontSizes.base};

    svg {
      width: 16px;
      height: 16px;
      margin-left: 10px;
    }
  }
`;

const AutoCompleteList = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
  min-height: 40px;
  height: auto;
  max-height: 350px;
  padding-top: 45px;
  background-color: ${({ theme }) => theme.colors.white};
  overflow-y: auto;
  box-shadow: rgba(17, 17, 26, 0.1) 0px 0px 16px;
  border-radius: 20px 20px 10px 10px;
  z-index: 3;

  ::-webkit-scrollbar {
    width: 0px;
    background: transparent;
  }
`;

const AutoCompleteItem = styled.div`
  padding: 10px;
  font-size: ${({ theme }) => theme.fontSizes.small};

  :hover {
    background-color: ${({ theme }) => theme.colors.brightGray};
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
