import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import styled from '@emotion/styled';
import { Textarea } from '@/components/ui/textarea';
import useRegistrationStore from '@/store/useRegistrationStore';
import { useMemberStore } from '@/store/useMemberStore';
import { mapDrinkType } from '@/data/drinkTypes';

const SpecialtyDrinkDetail = () => {
  const { registrations, fetchRegistrationsDetail, updateApprovalStatus } = useRegistrationStore();
  const { currentUser, fetchMembers } = useMemberStore();
  const { id } = useParams();
  const registId = Number(id);
  const isManager = currentUser?.role === 'MANAGER';

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const navigate = useNavigate();

  const location = useLocation();
  const newRegistration = location.state;

  useEffect(() => {
    fetchRegistrationsDetail(registId);
  }, [fetchRegistrationsDetail, registId]);

  const registration =
    registrations.find(registration => registration.id === registId) || newRegistration;

  const [selectedApproval, setSelectedApproval] = useState<'true' | 'false' | null>(null);
  const [isSelectDisabled, setIsSelectDisabled] = useState<boolean>(false);

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
      updateApprovalStatus(registId, selectedApproval);
      console.log(registId);
      console.log(selectedApproval);
      navigate('/specialty-drink');
    }
  };
  const handleCancelClick = () => {
    navigate('/specialty-drink');
  };

  return (
    <DrinkDetailLayout>
      <HeaderStyled>
        <h1>{registration?.drinkName}</h1>
      </HeaderStyled>
      <ImgStyled>
        <img src={registration?.imageUrl} alt={registration?.drinkName} />
      </ImgStyled>
      <ContentStyled>
        <DrinkInfo>
          <div>
            <Label htmlFor="text">종류</Label>
            <span>{mapDrinkType(registration?.type || '')}</span>
          </div>
          <div style={{ width: '150px' }}>
            <Label htmlFor="text">지역</Label>
            <span>{registration?.placeName}</span>
          </div>
        </DrinkInfo>
        <DrinkInfo>
          <div>
            <Label htmlFor="text">가격</Label>
            <span>{registration?.cost.toLocaleString()}원</span>
          </div>
          <div>
            <Label htmlFor="text">당도</Label>
            <span>{registration?.sweetness}</span>
          </div>
          <div>
            <Label htmlFor="text">도수</Label>
            <span>{registration?.degree}도</span>
          </div>
        </DrinkInfo>
        <Label htmlFor="text">특산주 정보</Label>
        <TextareaStyled value={registration?.description} readOnly />
      </ContentStyled>
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
    </DrinkDetailLayout>
  );
};

const DrinkDetailLayout = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  height: auto;
  padding-top: 60px;
  background-color: ${({ theme }) => theme.colors.brightGray};
  color: ${({ theme }) => theme.colors.black};
`;

const HeaderStyled = styled.div`
  width: 100%;
  padding: 20px;
  background-color: ${({ theme }) => theme.colors.white};

  h1 {
    width: 100%;
    color: ${({ theme }) => theme.colors.black};
    font-size: ${({ theme }) => theme.fontSizes.medium};
    font-weight: bold;
  }
`;

const ImgStyled = styled.div`
  width: 100%;
  padding: 0 20px 20px 20px;
  background-color: ${({ theme }) => theme.colors.white};

  img {
    width: 100%;
    height: 316px;
    object-fit: contain;
    border: 1px solid ${({ theme }) => theme.colors.lightGray};
    border-radius: 10px;
    overflow: hidden;
  }
`;

const ContentStyled = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
  padding: 0 20px 20px 20px;
  background-color: ${({ theme }) => theme.colors.white};

  span {
    margin-right: 20px;
  }
`;

const DrinkInfo = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  width: 100%;

  span {
    margin-bottom: 16px;
    font-size: ${({ theme }) => theme.fontSizes.small};
  }

  div {
    display: flex;
    width: 100px;
    margin-right: 10px;
    flex-direction: column;
  }
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.fontSizes.small};
  font-weight: bold;
  margin-right: 10px;
`;

const TextareaStyled = styled(Textarea)`
  min-height: 100px;
  height: auto;
  margin-top: 5px;
  background-color: ${({ theme }) => theme.colors.clearGray};
  border: 1px solid ${({ theme }) => theme.colors.brightGray};
  font-size: ${({ theme }) => theme.fontSizes.small};
  resize: none;

  &:focus {
    box-shadow: none;
  }
`;

const BottomStyled = styled.div`
  width: 100%;
  margin-top: 10px;
  padding: 20px;
  background-color: ${({ theme }) => theme.colors.white};

  > button {
    :focus {
      border-color: ${({ theme }) => theme.colors.focusShadowOrange};
      box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.focusShadowOrange};
    }
  }
`;

const SelectStyled = styled.select`
  width: 100%;
  height: 40px;
  margin-left: auto;
  font-size: ${({ theme }) => theme.fontSizes.small};
  border: 1px solid ${({ theme }) => theme.colors.lightGray};
  border-radius: 5px;

  :focus,
  :active {
    border-color: ${({ theme }) => theme.colors.focusShadowGray};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.focusShadowGray};
    outline: none;
  }
`;

const ButtonStyled = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 40px;

  button {
    width: 48%;
    height: 45px;
    color: ${({ theme }) => theme.colors.white};
    font-size: ${({ theme }) => theme.fontSizes.base};
    border-radius: 30px;

    :nth-of-type(1) {
      background-color: ${({ theme }) => theme.colors.lightGray};
      color: ${({ theme }) => theme.colors.darkGray};
    }

    :nth-of-type(2) {
      background-color: ${({ theme }) => theme.colors.primary};
    }
  }
`;

export default SpecialtyDrinkDetail;
