import { ContentWrapper, NoFooterLayout } from '@/styles/CommonStyles';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/ui/pagination';
import styled from '@emotion/styled';
import ArrowLeftIcon from '@/assets/icons/ArrowLeftIcon';
import PlusIcon from '@/assets/icons/PlusIcon';

const SpecialtyDrinkBoard = () => {
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
          {Array.from({ length: 3 }, (_, idx) => (
            <li key={idx}>
              <Link to="/specialty-drink/:idx">
                <span>특산주 신청합니다!</span>
                <p>Re: 특산주 등록이 완료되었습니다! :D</p>
              </Link>
              <p>09/06</p>
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
