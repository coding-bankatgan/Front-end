import { ContentWrapper, NoFooterLayout } from '@/styles/CommonStyles';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useEffect } from 'react';
import useRegistrationStore from '@/store/useRegistrationStore';
import styled from '@emotion/styled';
import PlusIcon from '@/assets/icons/PlusIcon';
import dayjs from 'dayjs';
import PrevBtn from '@/components/layout/PrevBtn';
import Pagination from './../../layout/Pagination';

const SpecialtyDrinkBoard = () => {
  const navigate = useNavigate();
  const { registrations, pagination, fetchRegistrations } = useRegistrationStore(state => ({
    registrations: state.registrations,
    pagination: state.pagination,
    fetchRegistrations: state.fetchRegistrations,
    setRegistrations: state.setRegistrations,
  }));

  useEffect(() => {
    fetchRegistrations(pagination.number, pagination.size);
  }, [fetchRegistrations, pagination.number, pagination.size]);

  const handlePageChange = (newPage: number) => {
    fetchRegistrations(newPage, pagination.size);
  };

  const handleItemClick = (id: number) => {
    navigate(`/specialty-drink/${id}`);
  };

  return (
    <NoFooterLayoutSub>
      <ContentWrapper>
        <ListTitleStyled>
          <PrevBtn />
          <h1>특산주 신청 리스트</h1>
        </ListTitleStyled>
        <ListContentStyled>
          {registrations.map(registration => (
            <li key={registration.id} onClick={() => handleItemClick(registration.id)}>
              <div>
                <span>{registration.drinkName}</span>
                {registration.approved === null ? (
                  <Badge variant="outline">New</Badge>
                ) : (
                  <p>
                    Re:{' '}
                    {registration.approved
                      ? '특산주 등록이 완료되었습니다! :D'
                      : '전달주신 특산주 정보가 확인되지 않습니다.'}
                  </p>
                )}
              </div>
              <span>{dayjs(registration.createdAt).format('YYYY.MM.DD')}</span>
            </li>
          ))}
        </ListContentStyled>
        {registrations.length > 0 && (
          <Pagination pagination={pagination} onPageChange={handlePageChange} />
        )}
        <EditDrinkForm onClick={() => navigate('/specialty-drink/form')}>
          <PlusIcon />
        </EditDrinkForm>
      </ContentWrapper>
    </NoFooterLayoutSub>
  );
};

const NoFooterLayoutSub = styled(NoFooterLayout)`
  align-items: flex-start;
  color: ${({ theme }) => theme.colors.black};
`;

const ListTitleStyled = styled.div`
  h1 {
    width: 100%;
    height: auto;
    padding-bottom: 20px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.darkGray};
    color: ${({ theme }) => theme.colors.black};
    font-size: ${({ theme }) => theme.fontSizes.large};
    font-weight: bold;
    text-align: center;
  }
`;

const ListContentStyled = styled.ul`
  li {
    display: flex;
    justify-content: space-between;
    padding: 15px 10px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.lightGray};

    p {
      font-size: ${({ theme }) => theme.fontSizes.xsmall};
    }

    > div {
      div {
        color: ${({ theme }) => theme.colors.error};
      }
    }

    > span {
      margin-top: 4px;
      color: ${({ theme }) => theme.colors.gray};
      font-size: ${({ theme }) => theme.fontSizes.xsmall};
    }
  }
`;

const EditDrinkForm = styled(Button)`
  position: fixed;
  bottom: 40px;
  right: 20px;
  display: flex;
  width: 40px;
  height: 40px;
  padding: 12px;
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: 20px;
  box-shadow: rgba(0, 0, 0, 0.05) 0px 4px 10px;

  svg {
    color: ${({ theme }) => theme.colors.white};
  }

  :hover {
    background-color: ${({ theme }) => theme.colors.secondary};
  }
`;

export default SpecialtyDrinkBoard;
