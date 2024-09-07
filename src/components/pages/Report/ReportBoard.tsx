import { ContentWrapper, NoFooterLayout } from '@/styles/CommonStyles';
import { Link } from 'react-router-dom';
import { Pagination } from '@/components/ui/pagination';
import styled from '@emotion/styled';
import ArrowLeftIcon from '@/assets/icons/ArrowLeftIcon';

const SpecialtyDrinkBoard = () => {
  return (
    <NoFooterLayoutSub>
      <ContentWrapper>
        <ListTitleStyled>
          <Link to="/">
            <ArrowLeftIcon />
          </Link>
          <h1>신고 접수 리스트</h1>
        </ListTitleStyled>
        <ListContentStyled>
          {Array.from({ length: 3 }, (_, idx) => (
            <li key={idx}>
              <Link to="/report/reported-post/:idx">
                <span>[신고 사유]</span>
                <p>Re: 삭제 조치</p>
              </Link>
              <p>09/06</p>
            </li>
          ))}
        </ListContentStyled>
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

export default SpecialtyDrinkBoard;
