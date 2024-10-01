import { ContentWrapper, NoFooterLayout } from '@/styles/CommonStyles';
import { Button } from '@/components/ui/button';
import styled from '@emotion/styled';
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchDeclarationsWriteApi } from '@/api/postApi';
// import { getRoleFromToken } from '@/auth';

interface ReportFormProps {
  showAlert: (type: 'success' | 'error', message: string) => void;
}

export const reportReasons: { [key: string]: string } = {
  ILLEGAL_INFORMATION: '법률 위반(불법, 사기, 위법 행위 권장 등)',
  PERSONAL_INFORMATION_EXPOSURE: '개인정보 노출(전화번호, 주소, 주민등록번호 등)',
  OBSCENE: '음란성/선정성(성적 표현, 외설적인 이미지나 글)',
  PROFANE_LANGUAGE: '비속어 사용',
  SPAMMING: '동일한 게시글 반복 게시(도배)',
  COPYRIGHT_INFRINGEMENT: '저작권에 위배되는 게시글',
  OTHER: '기타',
};

const ReportForm = ({ showAlert }: ReportFormProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [type, setType] = useState<string>('');
  const [content, setContent] = useState<string>('');

  const { postLink } = location.state || {};

  useEffect(() => {
    if (!/^\/post\/\d+$/.test(postLink)) {
      console.error('잘못된 postLink 경로입니다:', postLink);
      showAlert('error', '잘못된 링크입니다. 다시 시도해주세요.');
    }
  }, [postLink]);

  const handleUpdateClick = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!type || !content) {
      showAlert('error', '신고 사유와 내용을 입력해주세요.');
      return;
    } else if (content.length < 10) {
      showAlert('error', '신고 내용을 10~1000자 사이로 입력해주세요.');
      return;
    }

    if (!/^\/post\/\d+$/.test(postLink)) {
      showAlert('error', '잘못된 링크입니다. 올바른 게시물 링크를 사용해주세요.');
      return;
    }

    try {
      const response = await fetchDeclarationsWriteApi(postLink, type, content);
      if (response) {
        showAlert('success', '신고가 접수되었습니다');
        setTimeout(() => navigate(-1), 1500);
      }
    } catch (error) {
      showAlert('error', '오류가 발생하였습니다. 잠시 후 다시 시도해주세요.');
      console.error('신고 중 오류 발생:', error);
    }
  };

  const handleInputClick = () => {
    window.open(postLink, '_blank');
  };

  const handleCancelClick = () => {
    navigate(-1);
  };

  return (
    <NoFooterLayoutSub>
      <ContentWrapper>
        <TitleStyled>게시글 신고하기</TitleStyled>
        <Label htmlFor="link">링크</Label>
        <FormHeaderStyled>
          <Input type="text" id="link" value={postLink} onClick={handleInputClick} readOnly />
        </FormHeaderStyled>
        <FormContentStyled>
          <Label htmlFor="type">신고 사유</Label>
          <SelectStyled id="type" value={type} onChange={e => setType(e.target.value)}>
            <option value="" disabled hidden>
              신고 유형
            </option>
            {Object.keys(reportReasons).map(key => (
              <option key={key} value={key}>
                {reportReasons[key]}
              </option>
            ))}
          </SelectStyled>
          <Label htmlFor="content">신고 내용</Label>
          <TextareaStyled
            id="content"
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="기타 사유를 입력해주세요"
          />
          <WarningTxt>
            이미지 수정 요청 시<br />
            관리자 이메일(admin@gmail.com)로 요청해주시기 바랍니다.
          </WarningTxt>
        </FormContentStyled>
        <FormBottomStyled>
          <Button onClick={handleCancelClick}>취소</Button>
          <Button onClick={handleUpdateClick}>등록</Button>
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
  font-weight: bold;
  margin-bottom: 20px;
`;

const FormHeaderStyled = styled.div`
  margin-bottom: 20px;
  border-radius: 5px;
  border: 1px solid ${({ theme }) => theme.colors.lightGray};
  overflow: hidden;
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.fontSizes.xsmall};

  :not(:last-child)::before {
    content: '*';
    margin-right: 3px;
    color: ${({ theme }) => theme.colors.point};
  }
`;

const WarningTxt = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.xsmall};
  color: ${({ theme }) => theme.colors.error};
`;

const FormContentStyled = styled.div`
  button {
    margin-top: 5px;
    margin-bottom: 20px;
  }

  > button,
  > textarea {
    &:focus {
      border-color: ${({ theme }) => theme.colors.focusShadowGray};
      box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.focusShadowGray};
    }
  }
`;

const SelectStyled = styled.select`
  width: 100%;
  height: 40px;
  margin-left: auto;
  margin-bottom: 20px;
  font-size: ${({ theme }) => theme.fontSizes.small};
  border: 1px solid ${({ theme }) => theme.colors.lightGray};
  border-radius: 5px;
  &:focus,
  &:active {
    border-color: ${({ theme }) => theme.colors.focusShadowGray};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.focusShadowGray};
    outline: none;
  }
`;

const TextareaStyled = styled(Textarea)`
  height: 150px;
  margin-bottom: 10px;
  background-color: ${({ theme }) => theme.colors.brightGray};
  resize: none;
`;

const FormBottomStyled = styled.div`
  display: flex;
  margin-top: 50px;
  justify-content: space-between;

  button {
    width: 48%;
    height: 45px;
    font-size: ${({ theme }) => theme.fontSizes.base};
    border-radius: 30px;

    :nth-of-type(1) {
      background-color: ${({ theme }) => theme.colors.lightGray};
      color: ${({ theme }) => theme.colors.darkGray};
    }

    :nth-of-type(2) {
      background-color: ${({ theme }) => theme.colors.primary};
      color: ${({ theme }) => theme.colors.white};
    }
  }
`;

export default ReportForm;
