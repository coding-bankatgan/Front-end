import { ContentWrapper, NoFooterLayout } from '@/styles/CommonStyles';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import styled from '@emotion/styled';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const ReportForm = () => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleSelectChange = (value: string) => {
    setSelectedOption(value);
  };

  return (
    <NoFooterLayoutSub>
      <ContentWrapper>
        <TitleStyled>게시글 신고하기</TitleStyled>
        <Label>링크</Label>
        <FormHeaderStyled>
          <Input placeholder="게시글 링크" disabled />
        </FormHeaderStyled>
        <FormContentStyled>
          <Label>신고 사유</Label>
          <Select onValueChange={handleSelectChange}>
            <SelectTrigger>
              <SelectValue placeholder="신고 유형" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="option1">18세 미만인 사용자와 관련된 문제</SelectItem>
                <SelectItem value="option2">사기 또는 거짓 정보</SelectItem>
                <SelectItem value="option3">허위 과장 광고</SelectItem>
                <SelectItem value="option4">상품 정보 오류</SelectItem>
                <SelectItem value="option5">기타</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Label htmlFor="text">신고 내용</Label>
          <TextareaStyled placeholder="기타 사유를 입력해주세요" />
          <Label>
            이미지 수정 요청 시<br />
            관리자 이메일(admin@gmail.com)로 요청해주시기 바랍니다.
          </Label>
        </FormContentStyled>
        <FormBottomStyled>
          <Link to="/">
            <Button>취소</Button>
          </Link>
          <Link
            to={selectedOption ? `/` : '#'}
            onClick={e => {
              if (!selectedOption) {
                e.preventDefault(); // 선택되지 않으면 링크 클릭 방지
              }
            }}
          >
            <Button>등록</Button>
          </Link>
        </FormBottomStyled>
      </ContentWrapper>
    </NoFooterLayoutSub>
  );
};

const NoFooterLayoutSub = styled(NoFooterLayout)`
  align-items: flex-start;
`;

const TitleStyled = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.medium};
  margin-bottom: 10px;
`;

const FormHeaderStyled = styled.div`
  margin-bottom: 20px;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.colors.lightGray};
  overflow: hidden;
`;

const Label = styled.label`
  margin: 5px 0;
  font-size: ${({ theme }) => theme.fontSizes.xsmall};

  :not(:last-child)::before {
    content: '* ';
    color: ${({ theme }) => theme.colors.tertiary};
  }

  :last-child {
    font-size: ${({ theme }) => theme.fontSizes.xxsmall};
    color: ${({ theme }) => theme.colors.error};
  }
`;

const FormContentStyled = styled.div`
  button {
    margin-top: 5px;
    margin-bottom: 20px;
  }

  > button,
  > textarea {
    &:focus {
      border-color: ${({ theme }) => theme.colors.focusShadow};
      box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.focusShadow};
    }
  }
`;

const TextareaStyled = styled(Textarea)`
  height: 150px;
  margin-top: 5px;
  margin-bottom: 10px;
  background-color: ${({ theme }) => theme.colors.lightGray};
  resize: none;
`;

const FormBottomStyled = styled.div`
  display: flex;
  margin-top: 20px;
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

export default ReportForm;
