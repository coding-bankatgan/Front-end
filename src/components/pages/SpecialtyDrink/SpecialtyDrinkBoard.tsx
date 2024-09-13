import { ContentWrapper, NoFooterLayout } from '@/styles/CommonStyles';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useEffect } from 'react';
import styled from '@emotion/styled';
import ArrowLeftIcon from '@/assets/icons/ArrowLeftIcon';
import PlusIcon from '@/assets/icons/PlusIcon';
import useRegistrationStore from '@/store/useRegistrationStore';
import dayjs from 'dayjs';

const SpecialtyDrinkBoard = () => {
  const { registrations, fetchRegistrations } = useRegistrationStore();
  useEffect(() => {
    fetchRegistrations();
  }, [fetchRegistrations]);
  const navigate = useNavigate();
  return (
    <NoFooterLayoutSub>
      <ContentWrapper>
        <ListTitleStyled>
          <Link to="/">
            <ArrowLeftIcon />
          </Link>
          <h1>특산주 신청 리스트</h1>
        </ListTitleStyled>
        <ListContentStyled>
          {registrations.map(registration => (
            <li
              key={registration.registId}
              onClick={() => navigate(`/specialty-drink/${registration.registId}`)}
            >
              <div>
                <span>{registration.drinkName}</span>
                {registration.approved === null ? (
                  <Badge variant="outline">New!</Badge>
                ) : (
                  <p>
                    Re:{' '}
                    {registration.approved
                      ? '특산주 등록이 완료되었습니다! :D'
                      : '전달주신 특산주 정보가 확인되지 않습니다.'}
                  </p>
                )}
              </div>
              <p>{dayjs(registration.createdAt).format('MM/DD')}</p>
            </li>
          ))}
        </ListContentStyled>
        <ListBottomStyled>
          <EditDrinkForm>
            <Link to="/specialty-drink/form">
              <PlusIcon />
            </Link>
          </EditDrinkForm>
        </ListBottomStyled>
      </ContentWrapper>
    </NoFooterLayoutSub>
  );
};

const NoFooterLayoutSub = styled(NoFooterLayout)`
  align-items: flex-start;
`;

const ListTitleStyled = styled.div`
  h1 {
    width: 100%;
    height: 40px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.black};
    color: ${({ theme }) => theme.colors.black};
    font-size: ${({ theme }) => theme.fontSizes.large};
    font-weight: bold;
    text-align: center;
  }
`;

const ListContentStyled = styled.ul`
  li {
    display: flex;
    margin: 15px 10px;
    justify-content: space-between;

    p {
      font-size: ${({ theme }) => theme.fontSizes.xsmall};
    }

    > div {
      div {
        color: ${({ theme }) => theme.colors.error};
      }
    }
  }
`;

const ListBottomStyled = styled.div`
  display: flex;
  margin-right: 15px;
  flex-direction: row-reverse;
`;

const EditDrinkForm = styled(Button)`
  display: flex;
  width: 40px;
  height: 40px;
  background-color: ${({ theme }) => theme.colors.tertiary};
  border-radius: 20px;

  :hover {
    background-color: ${({ theme }) => theme.colors.tertiary};
  }
`;

export default SpecialtyDrinkBoard;
