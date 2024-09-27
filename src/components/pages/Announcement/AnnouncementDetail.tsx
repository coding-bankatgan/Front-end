import { useEffect } from 'react';
import { ContentWrapper, NoFooterLayout } from '@/styles/CommonStyles';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Textarea } from '@/components/ui/textarea';
import useAnnouncementStore from '@/store/useAnnouncementStore';
import dayjs from 'dayjs';
import styled from '@emotion/styled';
import PrevBtn from '../../layout/PrevBtn';
import EllipsisHorizontalIcon from '@/assets/icons/EllipsisHorizontalIcon';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import DeleteAnnouncement from './DeleteAnnouncement';

interface AnnouncementDetailProps {
  showAlert: (type: 'success' | 'error', message: string) => void;
}

const AnnouncementDetail = ({ showAlert }: AnnouncementDetailProps) => {
  const navigate = useNavigate();
  const { announcements, fetchAnnouncementsDetail } = useAnnouncementStore();
  const { id } = useParams();
  const announcementId = Number(id);

  const location = useLocation();
  const stateAnnouncement = location.state;

  useEffect(() => {
    const fetchDetail = async () => {
      if (!stateAnnouncement) {
        await fetchAnnouncementsDetail(announcementId);
      }
    };
    fetchDetail();
  }, [fetchAnnouncementsDetail, announcementId, stateAnnouncement]);

  const announcement =
    stateAnnouncement || announcements.find(announcement => announcement.id === announcementId);

  return (
    <NoFooterLayoutSub>
      <ContentWrapper>
        <OptionWrapper>
          <PrevBtn />
          <DropdownMenu>
            <DropdownMenuTrigger>
              <EllipsisHorizontalIcon />
            </DropdownMenuTrigger>
            <DropdownMenuContentStyled>
              <DropdownMenuItem
                onClick={() =>
                  navigate('/announcement/form', {
                    state: {
                      initialTitle: announcement.title,
                      initialContent: announcement.content,
                      initialImageUrl: announcement.imageUrl,
                      announcementId: announcement.id,
                    },
                  })
                }
              >
                수정
              </DropdownMenuItem>
              <DropdownMenuItem>
                <DeleteAnnouncement announcementId={announcementId} showAlert={showAlert} />
              </DropdownMenuItem>
            </DropdownMenuContentStyled>
          </DropdownMenu>
        </OptionWrapper>
        <HeaderStyled>
          <div>{announcement?.title}</div>
          <span>{dayjs(announcement?.createdAt).format('YYYY.MM.DD')}</span>
        </HeaderStyled>
        <Line />
        <BottomStyled>
          {announcement?.imageUrl ? <img src={announcement.imageUrl} alt="이미지 설명" /> : null}
          <TextareaStyled id="content" value={announcement?.content || ''} readOnly />
        </BottomStyled>
      </ContentWrapper>
    </NoFooterLayoutSub>
  );
};

const NoFooterLayoutSub = styled(NoFooterLayout)`
  align-items: flex-start;
  color: ${({ theme }) => theme.colors.black};
`;

const OptionWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const DropdownMenuContentStyled = styled(DropdownMenuContent)`
  margin: 5px 1px 0 0;

  div {
    padding: 10px 0;
    font-size: ${({ theme }) => theme.fontSizes.small};
  }
`;

const HeaderStyled = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 15px 10px;
  > div {
    display: block;
    white-space: wrap;
    word-wrap: break-word;
    overflow-wrap: break-word;
    max-width: 100%;
  }
  > span {
    margin-top: 4px;
    color: ${({ theme }) => theme.colors.gray};
    font-size: ${({ theme }) => theme.fontSizes.xsmall};
  }
`;

const Line = styled.div`
  width: 100%;
  height: 1px;
  margin-bottom: 10px;
  background-color: ${({ theme }) => theme.colors.lightGray};
`;

const BottomStyled = styled.div`
  img {
    min-width: 150px;
    width: auto;
    height: auto;
    max-height: 150px;
    object-fit: contain;
    margin-bottom: 10px;
    border: 1px solid ${({ theme }) => theme.colors.brightGray};
    overflow: hidden;
  }

  > button {
    &:focus {
      border-color: ${({ theme }) => theme.colors.focusShadowGray};
      box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.focusShadowGray};
    }
  }
`;

const TextareaStyled = styled(Textarea)`
  min-height: 100px;
  height: auto;
  margin-bottom: 10px;
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 0;
  resize: none;

  :focus {
    border: 0;
    box-shadow: none;
  }
`;

export default AnnouncementDetail;
