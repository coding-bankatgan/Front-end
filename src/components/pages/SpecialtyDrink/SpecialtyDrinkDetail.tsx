import { useState, useEffect } from 'react';
import { ContentWrapper, NoFooterLayout } from '@/styles/CommonStyles';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import styled from '@emotion/styled';
import { Textarea } from '@/components/ui/textarea';
import useRegistrationStore from '@/store/useRegistrationStore';

const SpecialtyDrinkDetail = () => {
  const { registrations, fetchRegistrations, updateApprovalStatus } = useRegistrationStore();
  const { registId } = useParams();
  const id = Number(registId);

  const navigate = useNavigate();

  const location = useLocation();
  const newRegistration = location.state;

  const registration =
    registrations.find(registration => registration.registId === id) || newRegistration;

  const [selectedApproval, setSelectedApproval] = useState<'true' | 'false' | null>(null);
  const [isSelectDisabled, setIsSelectDisabled] = useState<boolean>(false);

  useEffect(() => {
    fetchRegistrations();
  }, [fetchRegistrations]);

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
          <h1>특산주 신청합니다!</h1>
        </HeaderStyled>
        <TitleStyled>
          <img src={registration?.imageUrl} alt={registration?.drinkName} />
          <DrinkInfo>
            <Label htmlFor="text">특산주 이름</Label>
            <span>{registration?.drinkName}</span>
            <Label htmlFor="text">지역</Label>
            <span>{registration?.placeName}</span>
          </DrinkInfo>
        </TitleStyled>
        <TextareaStyled value={registration?.description} readOnly />
        <Line />
        <BottomStyled>
          <SelectStyled
            value={selectedApproval ?? ''}
            onChange={handleApprovalChange}
            disabled={isSelectDisabled}
          >
            <option value="" disabled hidden>
              {registration?.approved === null
                ? '특산주를 등록하시겠습니까?'
                : '특산주 상태가 이미 설정되었습니다.'}
            </option>
            <option value="true" disabled={isSelectDisabled}>
              특산주 등록이 완료되었습니다! :D
            </option>
            <option value="false" disabled={isSelectDisabled}>
              전달주신 특산주 정보가 확인되지 않습니다.
            </option>
          </SelectStyled>
          <ButtonStyled>
            <Button onClick={handleCancelClick}>취소</Button>
            <Button onClick={handleUpdateClick} disabled={selectedApproval === null}>
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
    max-height: 150px;
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

const SelectStyled = styled.select`
  width: 100%;
  height: 35px;
  margin-left: auto;
  margin-top: 20px;
  font-size: ${({ theme }) => theme.fontSizes.base};
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
  margin-top: 80px;
  justify-content: space-around;
  button {
    width: 140px;
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
