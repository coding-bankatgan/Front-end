import { useState, useEffect } from 'react';
import { ContentWrapper, NoFooterLayout } from '@/styles/CommonStyles';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import styled from '@emotion/styled';
import { Textarea } from '@/components/ui/textarea';
import useRegistrationStore from '@/store/useRegistrationStore';
import { useMemberStore } from '@/store/useMemberStore';

const SpecialtyDrinkDetail = () => {
  const { registrations, fetchRegistrationsDetail, updateApprovalStatus } = useRegistrationStore();
  const { currentUser, fetchMembers } = useMemberStore();
  const { registId } = useParams();
  const id = Number(registId);
  const isManager = currentUser?.role === 'MANAGER';

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const navigate = useNavigate();

  const location = useLocation();
  const newRegistration = location.state;

  const registration =
    registrations.find(registration => registration.registId === id) || newRegistration;

  const [selectedApproval, setSelectedApproval] = useState<'true' | 'false' | null>(null);
  const [isSelectDisabled, setIsSelectDisabled] = useState<boolean>(false);

  useEffect(() => {
    fetchRegistrationsDetail(id);
  }, [fetchRegistrationsDetail, id]);

  useEffect(() => {
    if (registration) {
      setSelectedApproval(
        registration.approved === null ? null : (registration.approved as 'true' | 'false'),
      );
      setIsSelectDisabled(registration.approved !== null);
    }
  }, [registration]);

  //** approve 기능 */
  const handleApprovalChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedApproval(
      event.target.value === '' ? null : (event.target.value as 'true' | 'false'),
    );
  };
  const handleUpdateClick = async () => {
    if (selectedApproval !== null) {
      updateApprovalStatus(id, selectedApproval);
      console.log(id);
      console.log(selectedApproval);
      navigate('/specialty-drink');
    }
  };
  const handleCancelClick = () => {
    navigate('/specialty-drink');
  };

  return (
    <NoFooterLayoutSub>
      <ContentWrapper>
        <HeaderStyled>
          <h1>{registration?.drinkName}</h1>
        </HeaderStyled>
        <TitleStyled>
          <img src={registration?.imageUrl} alt={registration?.drinkName} />
        </TitleStyled>
        <ContentStyled>
          <DrinkInfo>
            <div>
              <Label htmlFor="text">지역</Label>
              <span>{registration?.placeName}</span>
            </div>
            <div>
              <Label htmlFor="text">종류</Label>
              <span>{registration?.type}</span>
            </div>
            <div>
              <Label htmlFor="text">당도</Label>
              <span>{registration?.sweetness}</span>
            </div>
          </DrinkInfo>
          <DrinkInfo>
            <div>
              <Label htmlFor="text">도수</Label>
              <span>{registration?.degree} 도</span>
            </div>
            <div>
              <Label htmlFor="text">가격</Label>
              <span>{registration?.cost} 원</span>
            </div>
          </DrinkInfo>
        </ContentStyled>
        <Label htmlFor="text">특산주 정보</Label>
        <TextareaStyled value={registration?.description} readOnly />
        <Line />
        <BottomStyled>
          <SelectStyled
            value={selectedApproval ?? ''}
            onChange={handleApprovalChange}
            disabled={!isManager || isSelectDisabled}
          >
            <option value="" disabled hidden>
              {registration?.approved === null
                ? '특산주를 등록하시겠습니까?'
                : '특산주 상태가 이미 설정되었습니다.'}
            </option>
            <option value="true">특산주 등록이 완료되었습니다! :D</option>
            <option value="false">전달주신 특산주 정보가 확인되지 않습니다.</option>
          </SelectStyled>
          <ButtonStyled>
            <Button onClick={handleCancelClick}>취소</Button>
            <Button onClick={handleUpdateClick} disabled={selectedApproval === null || !isManager}>
              등록
            </Button>
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

  img {
    min-width: 316px;
    width: auto;
    height: auto;
    max-height: 316px;
    object-fit: contain;
    margin-bottom: 10px;
    border: 1px solid ${({ theme }) => theme.colors.brightGray};
    overflow: hidden;
  }
`;

const DrinkInfo = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  margin-top: 5px;
  margin-bottom: 5px;

  span {
    margin-bottom: 16px;
    font-size: ${({ theme }) => theme.fontSizes.base};
  }
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.fontSizes.small};
  font-weight: bold;
  margin-right: 10px;

  ::before {
    content: '*';
    margin-right: 3px;
    color: ${({ theme }) => theme.colors.tertiary};
  }
`;

const ContentStyled = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin-bottom: 10px;

  span {
    margin-right: 20px;
  }
`;

const TextareaStyled = styled(Textarea)`
  height: 150px;
  margin-bottom: 10px;
  background-color: ${({ theme }) => theme.colors.brightGray};
  font-size: ${({ theme }) => theme.fontSizes.base};
  resize: none;

  &:focus {
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.focusShadow};
  }
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
    border-color: ${({ theme }) => theme.colors.focusShadow};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.focusShadow};
    outline: none;
  }
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

export default SpecialtyDrinkDetail;
