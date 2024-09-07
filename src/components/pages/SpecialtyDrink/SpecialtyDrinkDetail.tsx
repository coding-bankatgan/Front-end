import React, { useState } from 'react';
import { ContentWrapper, NoFooterLayout } from '@/styles/CommonStyles';
import { Link } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import styled from '@emotion/styled';
import { Textarea } from '@/components/ui/textarea';

const SpecialtyDrinkDetail = () => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleSelectChange = (value: string) => {
    setSelectedOption(value);
  };

  return (
    <NoFooterLayoutSub>
      <ContentWrapper>
        <HeaderStyled>
          <h1>특산주 신청합니다!</h1>
        </HeaderStyled>
        <TitleStyled>
          <img src="https://picsum.photos/seed/picsum/155/135" alt="주류 이름" />
          <DrinkInfo>
            <Label htmlFor="text">특산주 이름</Label>
            <span>특산주 이름</span>
            <Label htmlFor="text">지역</Label>
            <span>지역</span>
          </DrinkInfo>
        </TitleStyled>
        <TextareaStyled disabled placeholder="포스팅 내용" />
        <Line />
        <BottomStyled>
          <Select onValueChange={handleSelectChange}>
            <SelectTrigger>
              <SelectValue placeholder="특산주를 등록하시겠습니까?" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="true">특산주 등록이 완료되었습니다! :D</SelectItem>
                <SelectItem value="false">전달주신 특산주 정보가 확인되지 않습니다.</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <ButtonStyled>
            <Link to="/specialty-drink">
              <Button>취소</Button>
            </Link>
            <Link
              to={selectedOption ? `/specialty-drink/` : '#'}
              onClick={e => {
                if (!selectedOption) {
                  e.preventDefault(); // 선택되지 않으면 링크 클릭 방지
                }
              }}
            >
              <Button>등록</Button>
            </Link>
          </ButtonStyled>
        </BottomStyled>
      </ContentWrapper>
    </NoFooterLayoutSub>
  );
};

const NoFooterLayoutSub = styled(NoFooterLayout)`
  align-items: flex-start;
`;

const HeaderStyled = styled.div`
  h1 {
    width: 100%;
    height: 40px;
    margin-top: 5px;
    color: ${({ theme }) => theme.colors.black};
    font-size: ${({ theme }) => theme.fontSizes.medium};
  }
`;

const TitleStyled = styled.div`
  display: flex;

  img {
    min-width: 150px;
    width: 48.5%;
    margin-bottom: 10px;
    border-radius: 10px;
    border: 1px solid ${({ theme }) => theme.colors.lightGray};
    overflow: hidden;
  }
`;

const DrinkInfo = styled.div`
  display: flex;
  margin-left: 10px;
  flex-direction: column;
  align-items: flex-start;

  span {
    margin-bottom: 16px;
    font-size: ${({ theme }) => theme.fontSizes.small};
  }
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.fontSizes.xsmall};

  ::before {
    content: '* ';
    color: ${({ theme }) => theme.colors.tertiary};
  }
`;

const TextareaStyled = styled(Textarea)`
  height: 150px;
  margin-bottom: 10px;
  background-color: ${({ theme }) => theme.colors.lightGray};
  resize: none;
`;

const Line = styled.div`
  width: 100%;
  height: 1px;
  margin: 10px 0;
  background-color: ${({ theme }) => theme.colors.gray};
`;

const BottomStyled = styled.div`
  > button {
    &:focus {
      border-color: ${({ theme }) => theme.colors.focusShadow};
      box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.focusShadow};
    }
  }
`;

const ButtonStyled = styled.div`
  display: flex;
  margin-top: 80px;
  justify-content: space-around;
  button {
    width: 140px;
    border-radius: 30px;
  }
  a:nth-of-type(1) button {
    background-color: ${({ theme }) => theme.colors.gray};
  }
  a:nth-of-type(2) button {
    background-color: ${({ theme }) => theme.colors.primary};
  }
`;

export default SpecialtyDrinkDetail;
