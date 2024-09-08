import styled from '@emotion/styled';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Title } from './PostStep1';
import { regions } from '@/data/regions';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Line } from '../Home/Home';
import SearchIcon from '@/assets/icons/SearchIcon';
import SearchResults from './SearchResults';

interface PostStep2Props {
  nextStep: () => void;
}

const PostStep2 = ({ nextStep }: PostStep2Props) => {
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [viewName, setViewName] = useState(false);

  const handleRegionChange = (value: string) => {
    setSelectedRegion(value);

    setTimeout(() => {
      setViewName(true);
    }, 1000);
  };

  const handleBtnClick = () => {
    nextStep();
  };

  return (
    <>
      <Title>어떤 특산주에 대해 작성하실 건가요?</Title>
      <SelectSearchGroup>
        <Select value={selectedRegion} onValueChange={handleRegionChange}>
          <SelectTrigger>
            <SelectValue placeholder="시/도" />
          </SelectTrigger>
          <SelectContent>
            {regions.map(region => (
              <SelectItem value={region.value} key={region.value}>
                {region.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Search>
          <Input placeholder="특산주 이름을 입력하세요." />
          <SearchIcon />
        </Search>
      </SelectSearchGroup>
      <Line />
      <ResultsContainer>
        {/* <Suggest>
          {viewName &&
            Array.from({ length: 15 }, (_, idx) => (
              <Button key={idx} onClick={handleBtnClick}>
                특산주
              </Button>
            ))}
        </Suggest> */}
        <SearchResults nextStep={nextStep} />
      </ResultsContainer>
    </>
  );
};

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
