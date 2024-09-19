import React, { useState } from 'react';
import { ContentWrapper, NoFooterLayout } from '@/styles/CommonStyles';
import { Link, useNavigate } from 'react-router-dom';
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
import { Input } from '@/components/ui/input';

const ReportedPost = () => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSelectChange = (value: string) => {
    setSelectedOption(value);
  };

  const handleUpdateClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!selectedOption) {
      e.preventDefault();
    } else {
      navigate('/report');
    }
  };

  return (
    <NoFooterLayoutSub>
      <ContentWrapper>
        <HeaderStyled>
          <h1>[신고 사유]</h1>
        </HeaderStyled>
        <TitleStyled>
          <Label>링크</Label>
          <FormHeaderStyled>
            <Input placeholder="게시글 링크" disabled />
          </FormHeaderStyled>
        </TitleStyled>
        <Line />
        <BottomStyled>
          <Select onValueChange={handleSelectChange}>
            <SelectTrigger>
              <SelectValue placeholder="신고 결과" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItemStyled value="true">
                  [삭제] 신고 주신 부분 검토하였으며, 게시글 내 사유와 관련된 부분 확인되어 게시글
                  비공개 진행하였습니다. 제보에 감사드립니다.
                </SelectItemStyled>
                <SelectItemStyled value="false">
                  [반려] 신고 주신 부분 검토하였으나, 수정이 필요한 부분 확인되지 않아 신고 요청
                  반려되었습니다.
                </SelectItemStyled>
              </SelectGroup>
            </SelectContent>
          </Select>
          <ButtonStyled>
            <Button onClick={() => navigate('/report')}>취소</Button>
            <Button onClick={handleUpdateClick}>등록</Button>
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
    margin-bottom: 20px;
    color: ${({ theme }) => theme.colors.black};
    font-size: ${({ theme }) => theme.fontSizes.medium};
    font-weight: bold;
  }
`;

const TitleStyled = styled.div`
  display: flex;
  flex-direction: column;

  img {
    min-width: 150px;
    width: 48.5%;
    margin-bottom: 10px;
    border-radius: 10px;
    border: 1px solid ${({ theme }) => theme.colors.lightGray};
    overflow: hidden;
  }
`;

const FormHeaderStyled = styled.div`
  margin-bottom: 20px;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.colors.lightGray};
  overflow: hidden;
`;

const Label = styled.label`
  margin-bottom: 5px;
  font-size: ${({ theme }) => theme.fontSizes.small};
  font-weight: bold;

  ::before {
    content: '*';
    margin-right: 3px;
    color: ${({ theme }) => theme.colors.tertiary};
  }
`;

const Line = styled.div`
  width: 100%;
  height: 1px;
  margin: 10px 0;
  background-color: ${({ theme }) => theme.colors.lightGray};
`;

const BottomStyled = styled.div`
  > button {
    &:focus {
      border-color: ${({ theme }) => theme.colors.focusShadow};
      box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.focusShadow};
    }
  }
`;

const SelectItemStyled = styled(SelectItem)`
  max-width: 310px;
  white-space: pre-wrap;
`;

const ButtonStyled = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 70px;

  button {
    width: 48%;
    height: 45px;
    font-size: ${({ theme }) => theme.fontSizes.base};
    border-radius: 30px;

    :nth-of-type(1) {
      background-color: ${({ theme }) => theme.colors.gray};
    }

    :nth-of-type(2) {
      background-color: ${({ theme }) => theme.colors.primary};
    }
  }
`;

export default ReportedPost;
