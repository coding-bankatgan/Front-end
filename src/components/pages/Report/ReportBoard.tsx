import { ContentWrapper, NoFooterLayout } from '@/styles/CommonStyles';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import useDeclarationStore from '@/store/useDeclarationStore';
import styled from '@emotion/styled';
import dayjs from 'dayjs';
import PrevBtn from '@/components/layout/PrevBtn';
import Pagination from './../../layout/Pagination';
// import { getRoleFromToken } from '@/auth'; // 경로를 알맞게 수정하세요

interface ReportListProps {
  showAlert: (type: 'success' | 'error', message: string) => void;
}

const ReportBoard = ({ showAlert }: ReportListProps) => {
  console.log(showAlert);

  const navigate = useNavigate();
  const { declarations, pagination, fetchDeclarations } = useDeclarationStore(state => ({
    declarations: state.declarations,
    pagination: state.pagination,
    fetchDeclarations: state.fetchDeclarations,
  }));

  useEffect(() => {
    fetchDeclarations(pagination.number, pagination.size);
  }, [fetchDeclarations, pagination.number, pagination.size]);

  const handlePageChange = (newPage: number) => {
    fetchDeclarations(newPage, pagination.size);
  };

  // const role = getRoleFromToken();

  const handleItemClick = (id: number) => {
    // if (role !== 'MANAGER') {
    //   showAlert('error', '권한이 없습니다.');
    //   return;
    // }
    navigate(`/report/reported-post/${id}`);
  };

  return (
    <NoFooterLayoutSub>
      <ContentWrapper>
        <ListTitleStyled>
          <PrevBtn />
          <h1>신고 접수 리스트</h1>
        </ListTitleStyled>
        <ListContentStyled>
          {declarations.map(declaration => (
            <li key={declaration.id} onClick={() => handleItemClick(declaration.id)}>
              <div>
                <span>신고합니다!</span>
                {declaration.approved === null ? (
                  <Badge variant="outline">New!</Badge>
                ) : (
                  <p>Re: {declaration.approved ? '삭제 조치' : '반려 조치'}</p>
                )}
              </div>
              <span>{dayjs(declaration.createdAt).format('YYYY.MM.DD')}</span>
            </li>
          ))}
        </ListContentStyled>
        {declarations.length > 0 && (
          <Pagination pagination={pagination} onPageChange={handlePageChange} />
        )}
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

    > div {
      div {
        color: ${({ theme }) => theme.colors.error};
      }
    }
  }
`;

export default ReportBoard;
