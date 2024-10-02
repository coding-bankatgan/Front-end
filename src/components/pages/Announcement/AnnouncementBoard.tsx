import { ContentWrapper, NoFooterLayout } from '@/styles/CommonStyles';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
// import { getRoleFromToken } from '@/auth';
import PlusIcon from '@/assets/icons/PlusIcon';
import dayjs from 'dayjs';
import useAnnouncementStore from '@/store/useAnnouncementStore';
import styled from '@emotion/styled';
import PrevBtn from '../../layout/PrevBtn';
import Pagination from './../../layout/Pagination';
import useMemberStore from '@/store/useMemberStore';

const AnnouncementBoard = () => {
  /** 페이지 유입 시 기본 데이터 출력 */
  const navigate = useNavigate();
  const { announcements, pagination, fetchAnnouncements } = useAnnouncementStore(state => ({
    announcements: state.announcements,
    pagination: state.pagination,
    fetchAnnouncements: state.fetchAnnouncements,
  }));
  const { members, fetchMembers } = useMemberStore();
  useEffect(() => {
    if (!members[0]) {
      fetchMembers();
    }
  }, []);

  useEffect(() => {
    fetchAnnouncements(pagination.number, pagination.size);
  }, [pagination.number, pagination.size]);

  const handlePageChange = (newPage: number) => {
    fetchAnnouncements(newPage, pagination.size);
  };

  const handleItemClick = (id: number) => {
    navigate(`/announcement/${id}`);
  };

  /** 7일 이내에 생성된 공지인지 확인하는 함수 */
  const isNewAnnouncement = (createdAt: string) => {
    return dayjs().diff(dayjs(createdAt), 'day') <= 7;
  };

  return (
    <NoFooterLayoutSub>
      <ContentWrapper>
        <PrevBtn />
        <TitleStyled>공지사항</TitleStyled>
        <ListContentStyled>
          {announcements.map(announcement => (
            <li key={announcement?.id} onClick={() => handleItemClick(announcement?.id)}>
              <div>
                <TitleSpan>{announcement?.title}</TitleSpan>
                {isNewAnnouncement(announcement?.createdAt) && (
                  <Badge variant="outline">New!</Badge>
                )}
              </div>
              <span>{dayjs(announcement?.createdAt).format('YYYY.MM.DD')}</span>
            </li>
          ))}
        </ListContentStyled>
        {announcements.length > 0 && (
          <Pagination pagination={pagination} onPageChange={handlePageChange} />
        )}
        {members[0]?.role === 'MANAGER' && (
          <EditAnnouncementForm onClick={() => navigate('/announcement/form')}>
            <PlusIcon />
          </EditAnnouncementForm>
        )}
      </ContentWrapper>
    </NoFooterLayoutSub>
  );
};

const NoFooterLayoutSub = styled(NoFooterLayout)`
  align-items: flex-start;
`;

const TitleStyled = styled.h1`
  width: 100%;
  height: auto;
  padding-bottom: 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.darkGray};
  color: ${({ theme }) => theme.colors.black};
  font-size: ${({ theme }) => theme.fontSizes.large};
  font-weight: bold;
  text-align: center;
`;

const ListContentStyled = styled.ul`
  color: ${({ theme }) => theme.colors.black};

  li {
    display: flex;
    flex-direction: column;
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
      display: flex;
      div {
        color: ${({ theme }) => theme.colors.error};
      }
    }
  }
`;

const TitleSpan = styled.span`
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
`;

const EditAnnouncementForm = styled(Button)`
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

export default AnnouncementBoard;
