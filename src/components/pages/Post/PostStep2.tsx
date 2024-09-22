import styled from '@emotion/styled';
import { Button } from '@/components/ui/button';
import { Title } from './PostStep1';
import { regions } from '@/data/regions';
import { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Line } from '../Home/Home';
import SearchIcon from '@/assets/icons/SearchIcon';
import SearchResults from './SearchResults';
import axios from 'axios';
import { setegid } from 'process';

interface PostStep2Props {
  nextStep: () => void;
  setDrinkData: React.Dispatch<React.SetStateAction<Drink>>;
}

export interface Drink {
  id: number;
  placeName: string;
  name: string;
  drinkType: string;
  degree: number;
  sweetness: number;
  cost: number;
  averageRating: number;
  description: string;
  imageUrl: string;
  createdAt: string;
}

interface ApiResponse {
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  content: Drink[];
}

const PostStep2 = ({ nextStep, setDrinkData }: PostStep2Props) => {
  const [selectedRegionId, setSelectedRegionId] = useState<number | null>(null);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewAutocomplete, setViewAutocomplete] = useState(false);
  const fixedSuggestions = ['111', '222', '333', '111', '222', '333', '111', '222', '333'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setViewAutocomplete(true); // 입력이 발생하면 자동완성 보이기
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
        setPage(0); // 페이지 초기화
        setSearchResults([]); // 검색 결과 초기화
        fetchSearchResults(); // 결과를 다시 불러오기
      }
    }, 800); // 1초 후에 실행

    return () => {
      clearTimeout(handler); // 컴포넌트 언마운트 시 타이머 취소
    };
  }, [searchTerm]);

  const handleBtnClick = () => {
    nextStep();
  };

  const [searchResults, setSearchResults] = useState<Drink[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadingRef = useRef<HTMLDivElement | null>(null);

  const fetchSearchResults = async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    try {
      const response = await axios.get(`/api/search/drinks`, {
        params: {
          regionId: selectedRegionId,
          drinkName: searchTerm,
          size: 10,
          page: page,
        },
      });

      const data = response.data;
      console.log(data.data[0].content);
      setSearchResults(prevResults => [...prevResults, ...data.data[0].content]);
      setHasMore(data.data[0].content.length > 0);
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
        setPage(prevPage => prevPage + 1); // `page`를 증가시키고
      }
    });

    if (loadingRef.current) {
      observer.observe(loadingRef.current); // `loadingRef`를 관찰합니다.
    }

    return () => {
      if (loadingRef.current) {
        observer.unobserve(loadingRef.current);
      }
    };
  }, [loadingRef, hasMore, loading]);

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
            placeholder="특산주 이름을 입력하세요."
          />
          <SearchIcon />
        </Search>
        {searchTerm !== '' && viewAutocomplete && (
          <AutocompleteList>
            {fixedSuggestions.map((suggestion, idx) => (
              <AutocompleteItem key={idx} onClick={() => handleSuggestionClick(suggestion)}>
                {suggestion}
              </AutocompleteItem>
            ))}
          </AutocompleteList>
        )}
      </SelectSearchGroup>
      <Line />
      <ResultsContainer>
        {searchTerm !== '' && (
          <>
            <SearchResults
              nextStep={nextStep}
              setDrinkData={setDrinkData}
              contents={searchResults}
            ></SearchResults>
            <div ref={loadingRef} style={{ height: '20px', background: 'transparent' }} />
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
  width: 78px;
  height: 40px;
  font-size: ${({ theme }) => theme.fontSizes.small};
  padding: 3px 4px 3px 16px;
  border-radius: 50px 0 0 50px;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  position: absolute;
  &:focus {
    outline: none;
  }
`;

const AutocompleteList = styled.ul`
  position: absolute;
  top: 39.8px;
  right: 0;
  width: calc(100% - 78px);
  background: white;
  box-shadow:
    -4px 4px 8px rgba(0, 0, 0, 0.2),
    4px 4px 8px rgba(0, 0, 0, 0.2);
  max-height: 200px;
  overflow-y: auto;
  z-index: 1;
`;

const AutocompleteItem = styled.li`
  padding: 10px;
  cursor: pointer;
  &:hover {
    background-color: ${({ theme }) => theme.colors.lightGray};
  }
`;

const SelectSearchGroup = styled.section`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;

  > button {
    position: absolute;
    left: 3px;
    width: 75px;
    height: 100%;
    background: transparent;
    border-radius: 20px 0 0 20px;
    border-right: 1px solid ${({ theme }) => theme.colors.primary};

    &:focus {
      box-shadow: none;
    }
  }
`;

const Search = styled.div`
  width: 100%;

  input {
    height: 40px;
    padding-right: 45px;
    padding-left: 85px;
    border: 1px solid ${({ theme }) => theme.colors.primary};
    border-radius: 20px;
    overflow: hidden;

    &:focus {
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

const ResultsContainer = styled.section`
  position: relative;
  width: 100%;
  min-height: 300px;
  height: auto;
  margin: 25px 0;
`;

const Suggest = styled.div`
  padding: 0 5px;

  button {
    display: inline-block;
    margin: 0 5px 5px 0;
    height: 36px;
    background-color: ${({ theme }) => theme.colors.brightGray};
    color: ${({ theme }) => theme.colors.darkGray};
    font-size: ${({ theme }) => theme.fontSizes.base};
    border-radius: 5px;

    &:hover {
      background-color: ${({ theme }) => theme.colors.primary};
      color: ${({ theme }) => theme.colors.white};
    }
  }
`;

export default PostStep2;
