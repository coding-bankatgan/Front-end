import React, { useEffect, useState } from 'react';
import { ContentWrapper, NoFooterLayout } from '@/styles/CommonStyles';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import useDeclarationStore from '@/store/useDeclarationStore';
import styled from '@emotion/styled';

const ReportedPost = () => {
  const { declarations, fetchDeclarationsDetail, updateApprovalStatus } = useDeclarationStore();
  const { id } = useParams();
  const declarationId = Number(id);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDeclarationsDetail(declarationId);
  }, [fetchDeclarationsDetail, declarationId]);

  const declaration = declarations.find(declaration => declaration.id === declarationId);

  //** approve 기능 */
  const [selectedApproval, setSelectedApproval] = useState<true | false | null>(null);
  const [selectedRejectReason, setSelectedRejectReason] = useState<string | null>(null);
  const [isSelectDisabled, setIsSelectDisabled] = useState<boolean>(false);

  const rejectReasons: { [key: string]: string } = {
    POST_DELETED_BY_USER: '사용자가 신고당한 게시글을 삭제한 경우',
    NOT_RELEVANT: '신고 내용이 게시글과 관련이 없는 경우',
    MISUNDERSTANDING: '신고자가 게시글을 오해하거나 잘못 해석한 경우',
    NOT_ENOUGH_DETAILS: '신고 사유에 대한 구체적인 정보나 설명이 부족한 경우',
    DUPLICATE_REPORT: '신고자의 의미없는 반복된 신고',
  };

  const renderMessage = () => {
    const approvalState = declaration?.approved !== null ? declaration?.approved : selectedApproval;
    switch (approvalState) {
      case true:
        return '신고 주신 부분 검토하였으며, 게시글 내 사유와 관련된 부분 확인되어 게시글 비공개 진행하였습니다. 제보에 감사드립니다.';
      case false:
        return '신고 주신 부분 검토하였으나, 수정이 필요한 부분 확인되지 않아 신고 요청 반려되었습니다.';
      default:
        return '';
    }
  };

  useEffect(() => {
    if (declaration) {
      setSelectedApproval(
        declaration.approved === null ? null : (declaration.approved as true | false),
      );
      setIsSelectDisabled(declaration.approved !== null);
    }
  }, [declaration]);

  const handleApprovalChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedApproval(
      value === '' ? null : value === 'true' ? true : false, // 문자열을 boolean으로 변환
    );
    if (value === 'false') {
      setSelectedRejectReason(null); // 반려 선택 시 반려 사유 초기화
    }
  };

  const handleRejectReasonChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRejectReason(event.target.value);
  };

  const handleInputClick = () => {
    window.open(declaration?.link, '_blank');
  };

  const handleUpdateClick = async () => {
    if (selectedApproval !== null) {
      let rejectReasonText: string | null = null;

      if (selectedApproval === false && selectedRejectReason !== null) {
        rejectReasonText = rejectReasons[selectedRejectReason];
      }

      updateApprovalStatus(declarationId, selectedApproval, rejectReasonText);
      console.log(id);
      console.log(selectedApproval);
      navigate('/report');
    }
  };
  const handleCancelClick = () => {
    navigate('/report');
  };

  return (
    <NoFooterLayoutSub>
      <ContentWrapper>
        <HeaderStyled>
          <h1>신고합니다!</h1>
        </HeaderStyled>
        <TitleStyled>
          <Label>링크</Label>
          <FormStyled>
            <Input
              type="text"
              id="link"
              value={declaration?.link || ''}
              onClick={handleInputClick}
              readOnly
            />
            <Label>신고 사유</Label>
            <Input type="text" id="type " value={declaration?.type || '알 수 없음'} readOnly />
          </FormStyled>
          <Label>신고 내용</Label>
          <TextareaStyled id="content" value={declaration?.content || ''} readOnly />
        </TitleStyled>
        <Line />
        <BottomStyled>
          <SelectStyled
            value={selectedApproval !== null ? String(selectedApproval) : ''}
            onChange={handleApprovalChange}
            disabled={isSelectDisabled}
          >
            <option value="" disabled hidden>
              {declaration?.approved === null ? '신고 처리 대기중' : '신고 처리 완료'}
            </option>
            <option value="true" disabled={isSelectDisabled}>
              삭제 조치
            </option>
            <option value="false" disabled={isSelectDisabled}>
              반려 조치
            </option>
          </SelectStyled>
          {selectedApproval === false && (
            <SelectStyled value={selectedRejectReason || ''} onChange={handleRejectReasonChange}>
              <option value="" disabled hidden>
                반려 사유를 선택하세요
              </option>
              {Object.keys(rejectReasons).map(key => (
                <option key={key} value={key}>
                  {rejectReasons[key]}
                </option>
              ))}
            </SelectStyled>
          )}
          <MessageContainer>{renderMessage()}</MessageContainer>
          <ButtonStyled>
            <Button onClick={handleCancelClick}>취소</Button>
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

  > textarea {
    &:focus {
      border-color: ${({ theme }) => theme.colors.focusShadowGray};
      box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.focusShadowGray};
    }
  }
`;

const FormStyled = styled.div`
  overflow: hidden;

  > input {
    border-radius: 10px;
    border: 1px solid ${({ theme }) => theme.colors.lightGray};
    margin-bottom: 10px;
    &:focus {
      border-color: ${({ theme }) => theme.colors.focusShadowGray};
      box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.focusShadowGray};
    }
  }
`;

const TextareaStyled = styled(Textarea)`
  height: 150px;
  margin-top: 5px;
  margin-bottom: 10px;
  background-color: ${({ theme }) => theme.colors.lightGray};
  resize: none;

  &:focus {
    border-color: ${({ theme }) => theme.colors.focusShadowGray};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.focusShadowGray};
  }
`;

const Label = styled.label`
  margin-bottom: 5px;
  font-size: ${({ theme }) => theme.fontSizes.small};
  font-weight: bold;

  ::before {
    content: '*';
    margin-right: 3px;
    color: ${({ theme }) => theme.colors.point};
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
      border-color: ${({ theme }) => theme.colors.focusShadowOrange};
      box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.focusShadowOrange};
    }
  }
`;

const SelectStyled = styled.select`
  width: 100%;
  height: 40px;
  margin-left: auto;
  margin-top: 20px;
  font-size: ${({ theme }) => theme.fontSizes.small};
  border: 1px solid ${({ theme }) => theme.colors.lightGray};
  border-radius: 5px;
  &:focus,
  &:active {
    border-color: ${({ theme }) => theme.colors.focusShadowOrange};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.focusShadowOrange};
    outline: none;
  }
`;

const MessageContainer = styled.div`
  margin-top: 20px;
  font-size: ${({ theme }) => theme.fontSizes.small};
  color: ${({ theme }) => theme.colors.primary};
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
