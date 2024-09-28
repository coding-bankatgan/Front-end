import styled from '@emotion/styled';
import { Title } from './PostStep1';
import { regions } from '@/data/regions';
import { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import SearchIcon from '@/assets/icons/SearchIcon';
import SearchResults from './SearchResults';
import api from '@/api/axios';

interface PostStep2Props {
  nextStep: () => void;
  setDrinkData: React.Dispatch<React.SetStateAction<Drink>>;
}

export interface Drink {
  id: number;
  placeName: string;
  name: string;
  type: string;
  degree: number;
  sweetness: number;
  cost: number;
  averageRating: number;
  description: string;
  imageUrl: string;
  createdAt: string;
}

const PostStep2 = ({ nextStep, setDrinkData }: PostStep2Props) => {
  const [selectedRegionId, setSelectedRegionId] = useState<number | null>(null);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewAutocomplete, setViewAutocomplete] = useState(false);

  /** */
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const fetchAutocomplete = async () => {
    if (!searchTerm) return;

    try {
      const url = selectedRegionId ? `/auto-complete/region-drink` : `/auto-complete/drink`;

      const response = await api.get(url, {
        params: {
          ...(selectedRegionId && { regionId: selectedRegionId }),
          name: searchTerm,
        },
      });

      console.log(response.data);

      setSuggestions(response.data || []);
    } catch (error) {
      console.error('Error fetching autocomplete suggestions:', error);
    }
  };

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      fetchAutocomplete();
    }, 500);

    return () => clearTimeout(debounceTimeout);
  }, [searchTerm]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    e.target.value === '' ? setViewAutocomplete(false) : setViewAutocomplete(true);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion); // 추천 항목 클릭 시 검색어에 반영
    setViewAutocomplete(false); // 선택 후 자동완성 목록 닫기
  };

  const handleRegionChange = (value: string) => {
    setSelectedRegion(value);
  };

  useEffect(() => {
    const regionsId = regions.find(region => region.name === selectedRegion)?.id;
    setSelectedRegionId(regionsId ?? null);
  }, [selectedRegion]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchTerm) {
        setPage(0);
        setSearchResults([]);
        fetchSearchResults();
      }
    }, 800);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const [searchResults, setSearchResults] = useState<Drink[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadingRef = useRef<HTMLDivElement | null>(null);

  const fetchSearchResults = async () => {
    if (!hasMore) return;

    setLoading(true);

    try {
      const response = await api.get(`/search/drinks`, {
        params: {
          regionId: selectedRegionId ? selectedRegionId : 0,
          drinkName: searchTerm,
          size: 10,
          page: page,
        },
      });

      const data = [response.data];
      console.log('data : ', data);
      console.log(data[0].content);
      setSearchResults(prevResults => {
        const isDuplicate = data[0].content.some((newItem: Drink) =>
          prevResults.some(prevItem => prevItem.id === newItem.id),
        );
        if (isDuplicate) {
          console.log('ok');
          return prevResults;
        } else {
          return [...prevResults, ...data[0].content];
        }
      });
      setHasMore(data[0].content.length > 0);
    } catch (error) {
      console.error('Error fetching search results:', error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchTerm !== '') {
      fetchSearchResults();
    }
  }, [page]);

  useEffect(() => {
    setPage(0);
    setHasMore(true);
  }, [searchTerm]);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        setPage(prevPage => prevPage + 1);
      }
    });

    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }

    return () => {
      if (loadingRef.current) {
        observer.unobserve(loadingRef.current);
      }
    };
  }, [loadingRef, hasMore, loading]);

  useEffect(() => {
    console.log(searchResults);
  }, [searchResults]);

  const handleFocus = () => {
    setViewAutocomplete(true);
  };
  const handleBlur = () => {
    setTimeout(() => setViewAutocomplete(false), 100);
  };

  return (
    <>
      <Title>어떤 특산주에 대해 작성하실 건가요?</Title>
      <SelectSearchGroup>
        <SelectStyled value={selectedRegion} onChange={e => handleRegionChange(e.target.value)}>
          <option value="" disabled>
            시/도
          </option>
          {regions.map(region => (
            <option value={region.name} key={region.value}>
              {region.name}
            </option>
          ))}
        </SelectStyled>
        <Search>
          <Input
            value={searchTerm}
            onChange={handleInputChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            placeholder="특산주 이름을 입력하세요."
          />
          <SearchIcon />
        </Search>
        {viewAutocomplete && suggestions.length > 0 && (
          <AutocompleteList>
            {suggestions.map((suggestion, idx) => (
              <AutocompleteItem key={idx} onClick={() => handleSuggestionClick(suggestion)}>
                {suggestion}
              </AutocompleteItem>
            ))}
          </AutocompleteList>
        )}
      </SelectSearchGroup>
      <ResultsContainer>
        {searchTerm !== '' && (
          <>
            <SearchResults
              nextStep={nextStep}
              setDrinkData={setDrinkData}
              contents={searchResults}
            ></SearchResults>
            <div ref={loadingRef} style={{ height: '20px', background: 'transparent' }}></div>
          </>
        )}
        {/* {searchResults.map(result => (
          <div key={result.id}>
            <h3>{result.name}</h3>
            <p>{result.description}</p>
            <img src={result.imageUrl} alt={result.name} />
          </div>
        ))}
        {loading && <p>Loading...</p>}
        <div ref={loadingRef} style={{ height: '20px', background: 'transparent' }} /> */}
      </ResultsContainer>
    </>
  );
};

const SelectStyled = styled.select`
  position: absolute;
  width: 80px;
  height: 40px;
  padding: 0 10px;
  font-size: ${({ theme }) => theme.fontSizes.small};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: 50px 0 0 50px;

  :focus {
    outline: none;
  }
`;

const AutocompleteList = styled.ul`
  position: absolute;
  top: 42px;
  right: 20px;
  width: calc(100vw - 120px);
  min-height: 40px;
  height: auto;
  max-height: 350px;
  background-color: ${({ theme }) => theme.colors.white};
  box-shadow: rgba(17, 17, 26, 0.1) 0px 0px 10px;
  border-radius: 10px;
  overflow-y: auto;
  z-index: 3;

  ::-webkit-scrollbar {
    width: 0px;
    background: transparent;
  }
`;

const AutocompleteItem = styled.li`
  padding: 10px;
  cursor: pointer;

  :hover {
    background-color: ${({ theme }) => theme.colors.lightGray};
  }
`;

const SelectSearchGroup = styled.section`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  margin-bottom: 10px;
  padding: 0 20px 20px 20px;
  background-color: ${({ theme }) => theme.colors.white};

  > button {
    position: absolute;
    left: 3px;
    width: 75px;
    height: 100%;
    background: transparent;
    border-radius: 20px 0 0 20px;
    border-right: 1px solid ${({ theme }) => theme.colors.primary};

    :focus {
      box-shadow: none;
    }
  }
`;

const Search = styled.div`
  width: 100%;

  input {
    height: 40px;
    padding-right: 45px;
    padding-left: 90px;
    border: 1px solid ${({ theme }) => theme.colors.primary};
    border-radius: 20px;
    overflow: hidden;

    :focus {
      box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.focusShadowOrange};
    }
  }

  svg {
    position: absolute;
    top: 10px;
    right: 35px;
    width: 20px;
    height: 20px;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const ResultsContainer = styled.section`
  position: relative;
  width: 100%;
  min-height: calc(100vh - 241px);
  height: calc(100% - 241px);
  padding: 20px 20px 0 20px;
  background-color: ${({ theme }) => theme.colors.white};
`;

export default PostStep2;
