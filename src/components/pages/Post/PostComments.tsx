import styled from '@emotion/styled';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import SendIcon from '@/assets/icons/SendIcon';
import WarningIcon from '@/assets/icons/WarningIcon';
import Pagination from './../../layout/Pagination';
import { useEffect, useState } from 'react';
import ExProfileImg from '@/assets/ExProfileImg';
import EllipsisHorizontalIcon from '@/assets/icons/EllipsisHorizontalIcon';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { fetchCommentsApi, fetchCommentWriteApi, fetchCommentsModifyApi } from '@/api/postApi';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { useMemberStore } from '@/store/useMemberStore';
import { usePostsDetailStore } from '@/store/usePostsDetailStore';
import useNotificationStore from '@/store/useNotificationStore';
import DeleteComment from './DeleteComment';

interface PostCommentsProps {
  postId: number;
  fetchCommentCount: () => Promise<void>;
  showAlert: (type: 'success' | 'error', message: string) => void;
}

interface Content {
  id: number;
  memberId: number;
  memberName: string;
  memberImageUrl: string;
  postId: number;
  content: string;
  anonymous: boolean;
  createdAt: string;
  updatedAt: string | null;
}

interface PagenationInfo {
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

/** 댓글 작성 API 호출 함수 */
const writeComment = async (postId: number, content: string, anonymous: boolean) => {
  try {
    console.log('API 호출 시:', { postId, content, anonymous });
    const response = await fetchCommentWriteApi(postId, content, anonymous);
    console.log(response);
    return response;
  } catch (err) {
    console.error('Error writing comment: ', err);
  }
};

const PostComments = ({ postId, fetchCommentCount, showAlert }: PostCommentsProps) => {
  const [comments, setComments] = useState<Content[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [pagination, setPagination] = useState<PagenationInfo>({
    totalElements: 0,
    totalPages: 0,
    size: 10,
    number: 0,
  });

  /** 특정 게시글의 댓글 가져오는 함수 */
  const fetchComments = async (postId: number, page: number, size: number) => {
    console.log('Fetching comments for page:', page);
    const data = await fetchCommentsApi(postId, page, size);

    if (data) {
      setComments(data.content);

      setPagination({
        totalElements: data.totalElements,
        totalPages: data.totalPages,
        size: size,
        number: page,
      });
    }
  };

  useEffect(() => {
    fetchComments(postId, pagination.number, pagination.size);
  }, [postId, pagination.number]);

  const handleAnonymousChange = () => {
    setIsAnonymous(prev => !prev);
  };
  console.log(isAnonymous);

  const handlePageChange = (newPage: number) => {
    if (newPage < 0 || newPage >= pagination.totalPages) return;
    // 페이지 번호만 업데이트, fetchComments로 새로운 댓글을 가져옴
    setPagination(prev => ({ ...prev, number: newPage }));
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewComment(e.target.value);
  };

  const { postsDetail } = usePostsDetailStore();
  const handleCommentSubmit = async () => {
    if (newComment.trim() === '') return;

    try {
      console.log('API 호출 전 - isAnonymous:', isAnonymous);
      const response = await writeComment(postId, newComment, isAnonymous);
      console.log(response);
      console.log('Anonymous value sent:', isAnonymous);

      if (response) {
        const newCommentData = {
          ...response,
          id: response.id,
          memberName: isAnonymous ? '익명' : response.memberName,
        };

        setComments(prevComments => {
          // 최신 댓글이 위로 오도록 정렬 및 중복 제거
          const updatedComments = [newCommentData, ...prevComments].sort(
            (a, b) => b.createdAt - a.createdAt,
          );
          return Array.from(
            new Map(updatedComments.map(comment => [comment.id, comment])).values(),
          );
        });

        setNewComment('');
        setIsAnonymous(false);

        // 댓글 수 업데이트
        await fetchCommentCount();

        // 댓글 다시 불러오기 (페이지 번호는 그대로 유지)
        await fetchComments(postId, pagination.number, pagination.size);

        // 알림관련
        const { currentUser } = useMemberStore.getState(); // 2
        console.log('currentUser Id : ', currentUser?.id);
        const post = postsDetail;
        if (!post) {
          console.error('게시글을 찾을 수 없습니다.');
          return;
        }
        const { memberId } = post;
        const { members } = useMemberStore();
        console.log('post memberId : ', memberId);
        const isNotificationChecked = members[0].alarmEnabled; // 정상작동

        if (currentUser && currentUser.id !== memberId && isNotificationChecked) {
          const notification = {
            id: Date.now(), // 임시 ID
            memberId, // 게시글 작성자에게만 알림이 가야하나 댓글을 작성한 사용자에게도 알림이 가는중, 수정 필요
            postId: postId,
            type: 'COMMENT',
            content: `${newCommentData.memberName}님이 귀하의 게시글에 댓글을 작성했습니다: "${newComment}"`,
            createdAt: new Date().toISOString(),
            isNew: true,
          };
          console.log(notification); // 디버깅 용
          useNotificationStore.getState().addNewNotification(notification);
        }

        // 댓글 수 업데이트
        await fetchCommentCount();
      }
    } catch (err) {
      console.error('Error submitting comment:', err);
    }
  };

  /** 신고하기 버튼 클릭 시 폼 이동 */
  const navigate = useNavigate();
  const postLink = `/post/${postId}`;
  const handleReportClick = () => {
    navigate(`/report/form`, { state: { postLink } });
  };

  /** 댓글 수정 */
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null); // 수정할 댓글 ID
  const [editingContent, setEditingContent] = useState('');
  const [editingAnonymous, setEditingAnonymous] = useState(false);

  const handleEditingChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditingContent(e.target.value);
  };

  const handleCommentEdit = (comment: Content) => {
    setEditingCommentId(comment.id);
    setEditingContent(comment.content);
    setEditingAnonymous(comment.anonymous);
  };

  const handleEditSubmit = async () => {
    if (editingCommentId === null) return;
    if (editingContent.trim() === '') return;

    try {
      await fetchCommentsModifyApi(editingCommentId!, editingContent, editingAnonymous);

      // 댓글 상태 업데이트
      setComments(prevComments =>
        prevComments.map(comment =>
          comment.id === editingCommentId
            ? { ...comment, content: editingContent, anonymous: editingAnonymous }
            : comment,
        ),
      );

      // 수정 상태 초기화
      setEditingCommentId(null);
      setEditingContent('');
      setEditingAnonymous(false);
    } catch (err) {
      console.error('Error editing comment:', err);
    }
  };

  return (
    <CommentWrapper>
      <Write>
        <div>
          {editingCommentId ? (
            <Textarea
              placeholder="댓글을 수정해주세요."
              value={editingContent}
              onChange={handleEditingChange}
            />
          ) : (
            <Textarea
              placeholder="댓글을 작성해주세요."
              value={newComment}
              onChange={handleCommentChange}
            />
          )}
          <CheckBoxWrapper>
            <Checkbox id="other" checked={isAnonymous} onCheckedChange={handleAnonymousChange} />
            <label htmlFor="other">익명</label>
          </CheckBoxWrapper>
        </div>
        {editingCommentId ? (
          <Button onClick={handleEditSubmit}>
            <SendIcon />
          </Button>
        ) : (
          <Button onClick={handleCommentSubmit}>
            <SendIcon />
          </Button>
        )}
      </Write>
      <Comments>
        {comments.length > 0 ? (
          comments.map(comment => (
            <Comment key={comment.id}>
              {comment.memberImageUrl ? (
                <img src={comment.memberImageUrl} alt={comment.memberName} />
              ) : (
                <ExProfileImg />
              )}

              <CommentInfoWrapper>
                <span>
                  <CommentNickname>{comment.memberName}</CommentNickname>
                  <CommentDate>{dayjs(comment.createdAt).format('YYYY.MM.DD')}</CommentDate>
                </span>
                <p>{comment.content}</p>
              </CommentInfoWrapper>
              <DropdownMenu>
                <DropdownMenuTriggerStyled>
                  <EllipsisHorizontalIcon />
                </DropdownMenuTriggerStyled>
                <DropdownMenuContentStyled>
                  <DropdownMenuItem onClick={() => handleCommentEdit(comment)}>
                    수정
                  </DropdownMenuItem>
                  <DeleteComment commentId={comment.id} showAlert={showAlert} />
                </DropdownMenuContentStyled>
              </DropdownMenu>
            </Comment>
          ))
        ) : (
          <NoComment>작성된 댓글이 없습니다</NoComment>
        )}
      </Comments>
      {comments.length > 0 && (
        <Pagination pagination={pagination} onPageChange={handlePageChange} />
      )}
      <ReportBtn onClick={handleReportClick}>
        <WarningIcon /> 신고하기
      </ReportBtn>
    </CommentWrapper>
  );
};

const CommentWrapper = styled.section`
  width: 100%;
  min-height: 200px;
  height: auto;
  margin-top: 10px;
  padding: 20px;
  background: ${({ theme }) => theme.colors.white};
`;

const Write = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  textarea {
    min-width: 230px;
    width: 100%;
    padding: 10px 10px 10px 70px;
    background-color: ${({ theme }) => theme.colors.clearGray};
    font-size: ${({ theme }) => theme.fontSizes.small};
    border-radius: 10px;
    resize: none;
    height: 40px;

    &:hover,
    &:focus {
      box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.focusShadowGray};
    }
  }

  button {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 30px;
    height: 30px;
    margin-left: 5px;
    padding: 5px;
    background-color: ${({ theme }) => theme.colors.primary};

    &:active,
    &:hover {
      background-color: ${({ theme }) => theme.colors.secondary};
    }

    svg {
      width: 18px;
      height: 18px;
      margin: 0;
      color: ${({ theme }) => theme.colors.white};
    }
  }

  > div {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
  }
`;

const CheckBoxWrapper = styled.div`
  position: absolute;
  top: 18px;
  left: 10px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 0 !important;

  button {
    width: 16px;
    height: 16px;
    margin: 0 5px 0 0;
    background-color: ${({ theme }) => theme.colors.gray};

    svg {
      width: 14px;
      height: 14px;
    }
  }

  button[aria-checked='true'] {
    background-color: ${({ theme }) => theme.colors.secondary};
  }

  label {
    font-size: ${({ theme }) => theme.fontSizes.xsmall};
  }
`;

const Comments = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  min-height: 70px;
  height: auto;
  margin: 20px 0;
`;

const NoComment = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 50px;
  background-color: ${({ theme }) => theme.colors.clearGray};
  color: ${({ theme }) => theme.colors.gray};
  font-size: ${({ theme }) => theme.fontSizes.small};
  border-radius: 10px;
`;

const Comment = styled.div`
  display: flex;
  width: 100%;
  min-height: 50px;
  height: auto;
  padding: 10px;
  background-color: ${({ theme }) => theme.colors.clearGray};
  border-bottom: 1px solid ${({ theme }) => theme.colors.lightGray};

  &:first-of-type {
    border-radius: 10px 10px 0 0;
  }

  &:last-of-type {
    border-bottom: 0;
    border-radius: 0 0 10px 10px;
  }

  svg {
    width: 26px;
    height: 26px;
    margin-right: 8px;
  }

  img {
    width: 26px;
    height: 26px;
    margin-right: 8px;
    border-radius: 50%;
  }
`;

const CommentInfoWrapper = styled.div`
  width: 90%;

  > span {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 5px;
  }

  p {
    font-size: ${({ theme }) => theme.fontSizes.small};
  }

  > div {
    background: blue;
  }
`;

const CommentNickname = styled.span`
  margin-right: 5px;
  font-size: ${({ theme }) => theme.fontSizes.small};
`;

const CommentDate = styled.span`
  color: ${({ theme }) => theme.colors.gray};
  font-size: ${({ theme }) => theme.fontSizes.xsmall};
`;

const DropdownMenuTriggerStyled = styled(DropdownMenuTrigger)`
  margin-left: auto;
  margin-bottom: auto;

  > svg {
    margin-right: 0;
    margin-top: -3px;
    color: ${({ theme }) => theme.colors.gray};
  }
`;

const DropdownMenuContentStyled = styled(DropdownMenuContent)`
  margin: 5px 1px 0 0;
  width: 40px !important;

  div {
    padding: 6px 8px;
    font-size: ${({ theme }) => theme.fontSizes.small};
  }
`;

const ReportBtn = styled.span`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin: 30px 0 10px 0;
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.fontSizes.xsmall};

  svg {
    width: 16px;
    height: 16px;
    margin-right: 2px;
  }
`;

export default PostComments;
