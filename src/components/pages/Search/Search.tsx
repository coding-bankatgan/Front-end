import styled from '@emotion/styled';
import ArrowLeftIcon from './../../../assets/icons/ArrowLeftIcon';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import SearchIcon from './../../../assets/icons/SearchIcon';
import { useEffect, useRef, useState } from 'react';
import {
  fetchAutoCompleteDrinkApi,
  fetchAutoCompleteTagApi,
  fetchDrinkResultsApi,
  fetchSuggestedDrinksApi,
  fetchSuggestedTagsApi,
  fetchTagResultsApi,
} from '@/api/postApi';
import { Badge } from '@/components/ui/badge';
import CloseIcon from './../../../assets/icons/CloseIcon';
import CardItem from '@/components/layout/CardItem';
import getWeekRange from '../../../utils/dateSearch';
import { Skeleton } from '@/components/ui/skeleton';

interface SuggestedTag {
  tagId: number;
  tagName: string;
}

interface SuggestedDrink {
  id: number;
  name: string;
}

type SuggestedData = SuggestedTag | SuggestedDrink;

interface Post {
  id: number;
  title: string;
  content: string;
  tags: string[];
}

interface Tag {
  id: number;
  name: string;
}

interface RankProps {
  highlight: boolean;
}

const Search = () => {
  const navigate = useNavigate();
  const [searchType, setSearchType] = useState<'tag' | 'drink'>('tag');
  const [suggestedData, setSuggestedData] = useState<SuggestedData[]>([]); // Top15
  const [inputValue, setInputValue] = useState<string>(''); // 기본 값은 태그일 때 #으로 시작
  const [tags, setTags] = useState<Tag[]>([]); // 뱃지로 변환
  const [autoCompleteData, setAutoCompleteData] = useState<string[]>([]); // 자동완성 데이터
  const [isAutoVisible, setIsAutoVisible] = useState(false); // 자동완성 비활성화
  const [searchResults, setSearchResults] = useState<Post[]>([]);
  const [page, setPage] = useState(0);
  const [size, _setSize] = useState(10);
  const [_totalElements, setTotalElements] = useState();
  const [_totalPages, setTotalPages] = useState();
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoadingResults, setIsLoadingResults] = useState(false); // 검색 결과 로딩
  const [isLoadingTagRemove, setIsLoadingTagRemove] = useState(false); // 태그 삭제 로딩
  const [hasMore, setHasMore] = useState(true);

  const loadingRef = useRef<HTMLDivElement | null>(null);

  const handleObserver: IntersectionObserverCallback = entries => {
    if (!hasMore) {
      return;
    }
    const target = entries[0];
    if (target.isIntersecting) {
      setPage(prevPage => prevPage + 1);
    }
  };
  useEffect(() => {
    setPage(0);
    setHasMore(true);
    setSearchResults([]);
  }, [tags]);

  useEffect(() => {
    const options: IntersectionObserverInit = {
      root: null,
      rootMargin: '2px 100px',
      threshold: 0.1,
    };

    const observer = new IntersectionObserver(handleObserver, options);
    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }

    return () => {
      if (loadingRef.current) {
        observer.unobserve(loadingRef.current);
      }
    };
  }, [loadingRef, hasMore]);

  useEffect(() => {
    setPage(0);
    setHasMore(true);
  }, [inputValue]);

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
      setHasSearched(false);

      setTags([]);
      setSearchResults([]);
      setAutoCompleteData([]);
      setIsAutoVisible(false);
    };

    fetchData();
  }, [searchType]);

  /** 입력 값이 변경될 때 자동완성 데이터 업데이트 */
  useEffect(() => {
    const debounceData = setTimeout(async () => {
      if (inputValue.trim().length > 1) {
        if (searchType === 'tag') {
          const data = await fetchAutoCompleteTagApi(inputValue.replace('#', ''));

          setAutoCompleteData(data || []);
          setIsAutoVisible(true);
        } else if (searchType === 'drink') {
          const data = await fetchAutoCompleteDrinkApi(inputValue);

          setAutoCompleteData(data || []);
          setIsAutoVisible(true);
        }
      } else {
        setAutoCompleteData([]);
        setIsAutoVisible(false);
      }
    }, 300);

    return () => {
      clearTimeout(debounceData);
    };
  }, [inputValue, searchType]);

  /** 태그 삭제 시 검색결과 재반영 */
  useEffect(() => {
    const tagNames = tags.map(tag => tag.name);
    searchResults.filter((post: Post) => post.tags.some(tag => tagNames.includes(tag)));
  }, [tags, searchResults]);

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

  /* 태그 추가 (=뱃지 변환) */
  const handleTagAdd = () => {
    const trimmedInput = inputValue.trim();
    const newTagName =
      searchType === 'tag' && !trimmedInput.startsWith('#') ? `#${trimmedInput}` : trimmedInput;

    if (trimmedInput && trimmedInput !== '#') {
      setTags(prevTags => {
        if (searchType === 'tag' && prevTags.length >= 3) {
          return prevTags;
        } else if (searchType === 'drink' && prevTags.length >= 1) {
          return prevTags;
        }

        // 새로 입력된 태그가 기존 태그 목록에 있는지 확인
        const existingTagIndex = prevTags.findIndex(tag => tag.name === newTagName);

        if (existingTagIndex !== -1) {
          // 새로 입력된 태그가 기존 태그와 중복되면, 새 태그는 추가하지 않고 기존 태그 유지
          setInputValue(searchType === 'tag' ? '#' : '');
          setIsAutoVisible(false);
          return prevTags;
        }

        // 기존 태그에 중복되지 않으면 새로운 태그를 추가
        const newTag = { id: Date.now(), name: newTagName };
        const updatedTags = [...prevTags, newTag];
        const tagNamesWithoutHash = updatedTags.map(tag => tag.name.replace('#', ''));

        const drinkSearchTerm =
          updatedTags.length === 1 ? updatedTags[0].name.replace('#', '') : '';

        setIsLoadingResults(true);

        setTimeout(async () => {
          try {
            if (searchType === 'tag') {
              const results = await fetchTagResultsApi(tagNamesWithoutHash, page, size);
              setSearchResults(results.content);
              setTotalElements(results.totalElements);
              setTotalPages(results.totalPages);
            } else if (searchType === 'drink') {
              if (drinkSearchTerm) {
                const results = await fetchDrinkResultsApi(drinkSearchTerm, page, size);
                setSearchResults(results.content);
                setTotalElements(results.totalElements);
                setTotalPages(results.totalPages);
              }
            }
            setHasSearched(true);
          } catch (err) {
            console.error('검색 중 오류 발생: ', err);
          } finally {
            setIsLoadingResults(false);
          }
        }, 200);

        setInputValue(searchType === 'tag' ? '#' : '');
        setIsAutoVisible(false);
        return updatedTags;
      });
    }
  };

  /* Enter 클릭 시 태그 추가 및 검색 결과 API 호출 */
  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();

      if (searchType === 'tag' && (inputValue === '#' || inputValue.trim() === '')) {
        return;
      }

      handleTagAdd(); // 태그 추가
    }
  };

  /** 뱃지 삭제 후 검색결과 재반영 */
  const handleBadgeRemove = async (id: number) => {
    setTags(prevTags => {
      const updatedTags = prevTags.filter(tag => tag.id !== id);
      const tagNamesWithoutHash = updatedTags.map(tag => tag.name.replace('#', ''));

      const drinkSearchTerm = updatedTags.length > 0 ? updatedTags[0].name.replace('#', '') : '';

      setIsLoadingTagRemove(true);
      setTimeout(async () => {
        try {
          if (searchType === 'tag') {
            const results = await fetchTagResultsApi(tagNamesWithoutHash, page, size);

            setSearchResults(results.content);
            setTotalElements(results.totalElements);
            setTotalPages(results.totalPages);
          } else if (searchType === 'drink') {
            const results = await fetchDrinkResultsApi(drinkSearchTerm, page, size);

            setSearchResults(results.content);
            setTotalElements(results.totalElements);
            setTotalPages(results.totalPages);
          }
        } catch (err) {
          console.error('검색 중 오류 발생: ', err);
        } finally {
          setIsLoadingTagRemove(false);
        }
      }, 200);

      return updatedTags;
    });
  };

  /** 이번주 날짜 기준 */
  const weekRange = getWeekRange();

  /** Top15 항목 클릭 시 뱃지 변환 및 검색 결과 */
  const handleSuggestedClick = (item: SuggestedTag | SuggestedDrink) => {
    const newTagName =
      searchType === 'tag' ? `#${(item as SuggestedTag).tagName}` : (item as SuggestedDrink).name;

    setTags(prevTags => {
      if (
        (searchType === 'tag' && prevTags.length >= 3) ||
        (searchType === 'drink' && prevTags.length >= 1)
      ) {
        return [...prevTags];
      }

      if (prevTags.some(tag => tag.name === newTagName)) return prevTags;

      const updatedTags = [...prevTags, { id: Date.now(), name: newTagName }];
      searchByResults(updatedTags);
      return updatedTags;
    });
  };

  /** Top15 항목 클릭 시 검색 결과 */
  const searchByResults = async (tags: Tag[]) => {
    try {
      const tagNames = tags.map(tag => tag.name.replace('#', ''));
      if (searchType === 'tag') {
        const results = await fetchTagResultsApi(tagNames, page, size);
        setSearchResults(results.content);
        setTotalElements(results.totalElements);
        setTotalPages(results.totalPages);
      } else {
        const drinkNames = tagNames[0];
        const results = await fetchDrinkResultsApi(drinkNames, page, size);
        setSearchResults(results.content);
        setTotalElements(results.totalElements);
        setTotalPages(results.totalPages);
      }
      setHasSearched(true);
    } catch (err) {
      console.error('검색 중 오류 발생:', err);
    }
  };

  useEffect(() => {
    if (!hasMore) {
      return;
    }
    try {
      if (page > 0) {
        const fetchData = async () => {
          if (searchType === 'tag') {
            const tagNames = tags.map(tag => tag.name.replace('#', ''));
            const results = await fetchTagResultsApi(tagNames, page, size);
            const data: Post[] = [...searchResults, ...results.content];

            if (results.content.length === 0) {
              throw new Error('Max Page');
            }
            setSearchResults(data);
            setTotalElements(results.totalElements);
            setTotalPages(results.totalPages);
          } else {
            const drinkNames = tags[0].name;
            const results = await fetchDrinkResultsApi(drinkNames, page, size);
            const data: Post[] = [...searchResults, ...results.content];

            if (results.content.length === 0) {
              throw new Error('Max Page');
            }
            setSearchResults(data);
            setTotalElements(results.totalElements);
            setTotalPages(results.totalPages);
          }
        };

        fetchData();
      }
    } catch (error) {
      setHasMore(false);
    }
  }, [page]);

  useEffect(() => {
    if (page > 0) {
    }
  }, [page]);

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
              <RadioGroupItem value="tag" id="tag" aria-label="태그 검색" />
              <Label htmlFor="tag">태그 검색</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="drink" id="drink" aria-label="특산주 검색" />
              <Label htmlFor="drink">특산주 검색</Label>
            </div>
          </RadioGroupStyled>
          <SearchInput>
            {searchType === 'tag' ? (
              <Input
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                disabled={tags.length === 3}
                aria-label="태그로 게시글 검색"
              />
            ) : (
              <Input
                value={inputValue}
                onChange={handleInputChange}
                placeholder="오메기술"
                onKeyDown={handleKeyDown}
                disabled={tags.length === 1}
                aria-label="특산주이름으로 게시글 검색"
              />
            )}

            <SearchIcon />
            {/* 자동완성 UI */}
            {isAutoVisible && autoCompleteData.length > 0 && (
              <AutoCompleteList>
                {autoCompleteData.map((item, idx) => (
                  <AutoCompleteItem
                    key={idx}
                    onClick={() => handleAutoCompleteClick(item)}
                    aria-label={`자동완성: ${item}`}
                  >
                    {item}
                  </AutoCompleteItem>
                ))}
              </AutoCompleteList>
            )}
          </SearchInput>
          {/* 뱃지 UI */}
          <BadgeWrapper>
            {tags.length >= 1 ? (
              tags.map((tag, idx) => (
                <BadgeStyled key={tag.id || idx}>
                  <div>
                    <span>{tag.name}</span>
                    <span onClick={() => handleBadgeRemove(tag.id)} aria-label="태그 제거">
                      <CloseIcon />
                    </span>
                  </div>
                </BadgeStyled>
              ))
            ) : (
              <span>찾고 싶은 게시글의 태그 또는 특산주 이름을 입력해 주세요.</span>
            )}
          </BadgeWrapper>
        </SearchContent>
      </SearchFixed>
      <RecommendResultWrapper>
        {tags.length === 0 && (
          <Recommend>
            <RecommendTitle>
              <b>
                이번 주{' '}
                <span>{searchType === 'tag' ? '인기 태그 Top 15' : '인기 특산주 Top 15'}</span>
              </b>
              <span>{weekRange} 기준</span>
            </RecommendTitle>
            <RecommendContent>
              {suggestedData.map((item, idx) => (
                <div key={idx}>
                  <Rank highlight={idx === 0 || idx === 1 || idx === 2}>{idx + 1}</Rank>
                  <span onClick={() => handleSuggestedClick(item)} aria-label="인기 키워드">
                    {searchType === 'tag'
                      ? (item as SuggestedTag).tagName
                      : (item as SuggestedDrink).name}
                  </span>
                </div>
              ))}
            </RecommendContent>
          </Recommend>
        )}
        {isLoadingTagRemove ? (
          <></>
        ) : isLoadingResults ? (
          <SkeWrapper>
            {Array.from({ length: 10 }).map((_, index) => (
              <div key={index} className="flex flex-col space-y-2 w-1/2 p-1">
                <Skeleton className="w-full h-[155px] rounded-xl" />
                <div className="space-y-1">
                  <div className="flex flex-row space-x-2">
                    <Skeleton className="w-6 h-5 rounded-full" />
                    <Skeleton className="w-full h-5 max-w-[200px]" />
                  </div>
                  <Skeleton className="w-full h-8 max-w-[250px]" />
                  <Skeleton className="w-full h-5 max-w-[250px]" />
                  <Skeleton className="w-full h-3 max-w-[200px]" />
                </div>
              </div>
            ))}
          </SkeWrapper>
        ) : hasSearched ? (
          Array.isArray(searchResults) && searchResults.length > 0 ? (
            <ResultsWrapper>
              <span>검색결과 ({searchResults.length}개)</span>
              <div>
                {searchResults.map((result: any, idx) => (
                  <CardItem key={idx} post={result} />
                ))}
              </div>
            </ResultsWrapper>
          ) : !tags.length && !searchResults.length ? null : (
            <NoResultsWrapper>
              <p>검색 결과가 없습니다.</p>
            </NoResultsWrapper>
          )
        ) : null}
        {hasMore && <div ref={loadingRef} />}
      </RecommendResultWrapper>
    </SearchLayout>
  );
};

const SkeWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 72px 20px 20px 20px;
`;

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
  color: ${({ theme }) => theme.colors.black};
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
  color: ${({ theme }) => theme.colors.black};
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
  height: 40px;

  input {
    height: 40px;
    padding-right: 45px;
    border: 1px solid ${({ theme }) => theme.colors.primary};
    border-radius: 20px;
    z-index: 10;

    :focus {
      box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.focusShadowOrange};
    }
  }

  > svg {
    position: absolute;
    top: 10px;
    right: 15px;
    width: 20px;
    height: 20px;
    color: ${({ theme }) => theme.colors.primary};
    z-index: 10;
  }
`;

const BadgeWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 25px;
  margin-top: 11px;
  overflow-x: scroll;
  overflow-y: hidden;
  -ms-overflow-style: none;
  scrollbar-width: none;

  ::-webkit-scrollbar {
    display: none;
  }
`;

const BadgeStyled = styled(Badge)`
  flex-shrink: 0;
  width: auto;
  height: 100%;
  margin-right: 8px;
  background-color: ${({ theme }) => theme.colors.secondary};
  font-size: ${({ theme }) => theme.fontSizes.small};
  font-weight: normal;

  :nth-last-of-type(1) {
    margin-right: 0;
  }

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
    margin-right: 5px;
    color: ${({ theme }) => theme.colors.white};
    font-size: ${({ theme }) => theme.fontSizes.small};
  }

  span:nth-of-type(2) {
    color: ${({ theme }) => theme.colors.white};
    font-size: ${({ theme }) => theme.fontSizes.base};

    svg {
      width: 16px;
      height: 16px;
    }
  }
`;

const AutoCompleteList = styled.div`
  position: absolute;
  top: 42px;
  width: 100%;
  min-height: 40px;
  height: auto;
  max-height: 350px;
  background-color: ${({ theme }) => theme.colors.white};
  overflow-y: auto;
  box-shadow: rgba(17, 17, 26, 0.1) 0px 0px 10px;
  border-radius: 10px;
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
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.white};
  overflow-y: scroll;
`;

const Recommend = styled.section`
  width: 100%;
  padding: 20px;
`;

const RecommendTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 15px;

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
  flex-direction: column;
  flex-wrap: wrap;
  width: 100%;
  height: 320px;

  div {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 50%;
    margin-bottom: 5px;
    padding: 5px 0;
    font-size: ${({ theme }) => theme.fontSizes.small};

    span:nth-of-type(2) {
      margin-left: 8px;
    }
  }
`;

const Rank = styled.span<RankProps>`
  width: 15px;
  color: ${({ highlight, theme }) => (highlight ? theme.colors.secondary : theme.colors.darkGray)};
  font-weight: bold;
  text-align: right;
`;

const NoResultsWrapper = styled.div`
  margin-top: 40px;
  color: ${({ theme }) => theme.colors.gray};
  font-size: ${({ theme }) => theme.fontSizes.base};
  text-align: center;
`;

const ResultsWrapper = styled.div`
  > div {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    margin-top: 70px;
    padding: 0 20px;
  }

  > span {
    position: fixed;
    display: inline-block;
    width: 100%;
    height: auto;
    padding: 15px 20px;
    background-color: ${({ theme }) => theme.colors.white};
    color: ${({ theme }) => theme.colors.black};
    border-bottom: 1px solid ${({ theme }) => theme.colors.lightGray};
    font-size: ${({ theme }) => theme.fontSizes.small};
    font-weight: bold;
  }
`;

export default Search;
