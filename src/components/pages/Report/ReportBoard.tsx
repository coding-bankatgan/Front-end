import { ContentWrapper, NoFooterLayout } from '@/styles/CommonStyles';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import PrevBtn from '@/components/layout/PrevBtn';

const ReportBoard = () => {
  return (
    <NoFooterLayoutSub>
      <ContentWrapper>
        <ListTitleStyled>
          <PrevBtn />
          <h1>신고 접수 리스트</h1>
        </ListTitleStyled>
        <ListContentStyled>
          {Array.from({ length: 3 }, (_, idx) => (
            <li key={idx}>
              <Link to="/report/reported-post/:idx">
                <span>[신고 사유]</span>
                <p>Re: 삭제 조치</p>
              </Link>
              <span>2024.09.06</span>
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

    > span {
      margin-top: 4px;
      color: ${({ theme }) => theme.colors.gray};
      font-size: ${({ theme }) => theme.fontSizes.xsmall};
    }
  }
`;

export default ReportBoard;
