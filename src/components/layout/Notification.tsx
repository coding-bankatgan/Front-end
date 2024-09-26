import styled from '@emotion/styled';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import BellIcon from '@/assets/icons/BellIcon';
import dayjs from 'dayjs';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useNotificationStore from '@/store/useNotificationStore';
import { useMemberStore } from '@/store/useMemberStore';

interface Notification {
  id: number;
  memberId: number;
  postId: number | null;
  type: string;
  content: string;
  createdAt: string;
  isNew: boolean;
}

const getNotificationTitle = (type: Notification['type']) => {
  switch (type) {
    case 'COMMENT':
      return '💬 새로운 댓글이 달렸습니다.';
    case 'DECLARATION':
      return '🚨 신고 처리 결과를 확인하세요.';
    case 'REGISTRATION':
      return '🎉 특산주 신청 처리 결과를 확인하세요';
    case 'REMOVED':
      return '⚠️ 게시글이 삭제 되었습니다.';
    case 'FOLLOW':
      return '🔔 팔로우한 태그에 새로운 글이 올라왔습니다.';
    default:
      return '알림';
  }
};

const Notification = () => {
  const navigate = useNavigate();
  const { notifications, newNotificationCount, fetchNotifications, markAsRead } =
    useNotificationStore();
  const { currentUser } = useMemberStore();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleNotificationClick = (notification: Notification) => {
    const { type, postId, memberId } = notification;
    markAsRead(notification.id);

    if (type === 'DECLARATION' || type === 'REMOVED' || postId === null) {
      return;
    }
    if (type === 'COMMENT') {
      if (memberId === currentUser?.id) {
        navigate(`/post/${postId}`);
      }
    } else if (type === 'REGISTRATION') {
      navigate(`/specialty-drink/${postId}`);
    } else if (type === 'FOLLOW') {
      navigate(`/post/${postId}`);
    }

    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTriggerStyled>
        {newNotificationCount > 0 && <span />} {/* 새로운 알림이 있으면 빨간 점 */}
        <BellIcon />
      </SheetTriggerStyled>
      <SheetContentStyled>
        <SheetHeaderStyled>
          <SheetTitle>
            알림 <span>(새로운 알림 {newNotificationCount}개)</span>
          </SheetTitle>
          <SheetDescriptionStyled>※ 알림은 최대 20개까지만 보여집니다.</SheetDescriptionStyled>
        </SheetHeaderStyled>
        <NoticeWrapper>
          {notifications.map(notification => (
            <NoticeSection
              key={notification.id}
              onClick={() => handleNotificationClick(notification)}
            >
              <NoticeTop>
                {notification.isNew && <Badge variant="outline">New</Badge>}
                <span>{dayjs(notification.createdAt).format('YYYY.MM.DD')}</span>
              </NoticeTop>
              <NoticeTitle>{getNotificationTitle(notification.type)}</NoticeTitle>
              <NoticeContent style={{ whiteSpace: 'pre-line' }}>
                {notification.content}
              </NoticeContent>
            </NoticeSection>
          ))}
        </NoticeWrapper>
      </SheetContentStyled>
    </Sheet>
  );
};

const SheetTriggerStyled = styled(SheetTrigger)`
  position: relative;
  margin-right: 15px;

  span {
    position: absolute;
    top: -3px;
    right: -2px;
    width: 6px;
    height: 6px;
    background-color: ${({ theme }) => theme.colors.error};
    border-radius: 20px;
  }
`;

const SheetContentStyled = styled(SheetContent)`
  padding: 20px 15px 15px 15px;
  color: ${({ theme }) => theme.colors.black};

  > button {
    &:focus {
      box-shadow: none;
    }
  }
`;

const SheetHeaderStyled = styled(SheetHeader)`
  margin-top: 20px;

  h2 {
    margin-bottom: 10px;
    color: ${({ theme }) => theme.colors.black};
    text-align: left;

    > span {
      color: ${({ theme }) => theme.colors.gray};
      font-size: ${({ theme }) => theme.fontSizes.base};
      font-weight: normal;
    }
  }
`;

const SheetDescriptionStyled = styled(SheetDescription)`
  display: inline-block;
  margin-bottom: 10px !important;
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.fontSizes.xsmall};
  text-align: left;
`;

const NoticeWrapper = styled.div`
  width: auto;
  height: 84%;
  overflow-y: scroll;
`;

const NoticeSection = styled.div`
  padding: 15px 5px;
  border-top: 1px solid ${({ theme }) => theme.colors.lightGray};
`;

const NoticeTop = styled.span`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
  color: ${({ theme }) => theme.colors.gray};
  font-size: ${({ theme }) => theme.fontSizes.xsmall};

  > div {
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.white};
    font-weight: normal;
  }
`;

const NoticeTitle = styled.b`
  display: inline-block;
  font-size: ${({ theme }) => theme.fontSizes.small};
  line-height: 18px;
  text-align: justify;
  letter-spacing: -0.3px;
`;

const NoticeContent = styled.span`
  display: inline-block;
  font-size: ${({ theme }) => theme.fontSizes.xsmall};
  line-height: 15px;
  text-align: justify;
  letter-spacing: -0.3px;
`;

export default Notification;
