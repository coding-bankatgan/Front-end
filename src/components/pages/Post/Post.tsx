import styled from '@emotion/styled';
import ExProfileImg from '@/assets/ExProfileImg';
import ViewIcon from './../../../assets/icons/ViewIcon';
import AlertDialogTag from '@/components/layout/AlertDialogTag';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import PostComments from './PostComments';
import EllipsisHorizontalIcon from '@/assets/icons/EllipsisHorizontalIcon';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import ChatIcon from '@/assets/icons/ChatIcon';
import HeartIcon from '@/assets/icons/HeartIcon';
import { mapDrinkType } from '@/data/drinkTypes';
import DeletePost from './DeletePost';
import { fetchCommentsApi } from '@/api/postApi';
import { usePostsStore } from '@/store/usePostsStore';
import DOMPurify from 'dompurify';
import { motion } from 'framer-motion';
import useMemberStore from '@/store/useMemberStore';
import { Button } from '@/components/ui/button';

const typeMap = {
  AD: '광고',
  REVIEW: '리뷰',
};

interface PostProps {
  showAlert: (type: 'success' | 'error', message: string) => void;
}

const Post = ({ showAlert }: PostProps) => {
  const navigate = useNavigate();
  const [commentCount, setCommentCount] = useState<number | null>(null);
  const { postsDetail, fetchPostsDetail, togglePostLike } = usePostsStore();
  const { members, fetchMembers } = useMemberStore();

  const { id } = useParams();
  const postId = Number(id);

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleLikeClick = () => {
    togglePostLike(post.id, post.isLiked);
  };

  /** 특정 게시글의 댓글 수 가져오는 함수 */
  const fetchCommentCount = async () => {
    try {
      const commentsData = await fetchCommentsApi(Number(id), 0, 10);
      setCommentCount(commentsData.totalElements);
    } catch (err) {
      console.error('Error fetching comments counts: ', err);
    }
  };

  useEffect(() => {
    const path = location.pathname;

    // URL 경로 유효성 검사: '/post/{postId}' 형식이 아니면 경고 알림
    if (!/^\/post\/\d+$/.test(path)) {
      console.error('잘못된 URL 경로입니다:', path);
      showAlert('error', '잘못된 URL 경로입니다. 다시 시도해주세요.');
      setTimeout(() => {
        navigate('/');
      }, 3000);
      return;
    }
    fetchPostsDetail(Number(id));
    fetchCommentCount();
  }, [fetchPostsDetail, id]);

  if (!postsDetail) {
    return <p>로딩 중...</p>;
  }

  const post = postsDetail;
  const handleButtonClick = () => {
    const drinkData = postsDetail.drink;
    navigate(`/drink-page/${drinkData.id}`, { state: { drinkData } });
  };

  // if (!post) {
  //   return <p>게시글을 찾을 수 없습니다.</p>;
  // }

  const handleNavigate = async () => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = postsDetail.content;
    const textContent = tempDiv.innerHTML.replace(/<br\s*\/?>/gi, '\n').replace(/&nbsp;/g, ' ');
    navigate('/create-post', {
      state: {
        postId: postsDetail.id,
        category: postsDetail.type,
        initialTags: postsDetail.tags.map(tag => tag.tagName),
        initialContent: textContent,
        initialImageUrl: postsDetail.imageUrl,
        initialRating: postsDetail.rating,
        drinkId: postsDetail.drink.id,
        drinkType: postsDetail.drink.type,
        degree: postsDetail.drink.degree,
        sweetness: postsDetail.drink.sweetness,
        drinkName: postsDetail.drink.name,
        step: 3,
      },
    });
  };

  return (
    <PostLayout>
      <PostTitleSection>
        <b>
          <span>{typeMap[postsDetail?.type]}</span>
          {postsDetail?.drink.name}
        </b>
      </PostTitleSection>
      <UserPost>
        <Nickname>
          {postsDetail?.memberImageUrl ? (
            <img src={postsDetail?.memberImageUrl} />
          ) : (
            <ExProfileImg />
          )}

          {postsDetail?.memberName}
          <span>
            {(postsDetail?.memberId === members[0]?.id || members[0]?.role === 'MANAGER') && (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <EllipsisHorizontalIcon />
                </DropdownMenuTrigger>
                <DropdownMenuContentStyled>
                  <DropdownMenuItem onClick={handleNavigate}>수정</DropdownMenuItem>
                  <DropdownMenuItem>
                    <DeletePost postId={postId} showAlert={showAlert} />
                  </DropdownMenuItem>
                </DropdownMenuContentStyled>
              </DropdownMenu>
            )}
          </span>
        </Nickname>
        <Img>
          <img src={postsDetail?.imageUrl} alt={postsDetail?.drink.name} />
        </Img>
        <Interactions>
          <span>
            <motion.button
              onClick={handleLikeClick}
              whileTap={{ scale: 1.3 }}
              animate={{
                scale: postsDetail?.isLiked ? [1, 1.3, 1] : [1, 1.3, 1],
                color: postsDetail?.isLiked ? '#FF3140' : '#4B463F',
              }}
              transition={{
                type: 'spring',
                stiffness: 500, // 스프링 강도
                damping: 20, // 반동 후 멈추는 정도
                bounce: 20, // 튕기는 효과
              }}
              style={{
                border: 'none',
                background: 'none',
              }}
            >
              <HeartIcon liked={post.isLiked} />
            </motion.button>
            <span>{post.likeCount.toLocaleString()}</span>
          </span>
          <span>
            <ChatIcon /> {commentCount?.toLocaleString()}
          </span>
          <span>
            <Button onClick={handleButtonClick}>특산주 설명 보러가기 {'>'}</Button>
          </span>
        </Interactions>
        <Desc dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}></Desc>
        <EtcWrap>
          <TagWrapper>
            {post.tags.map(tag => (
              <AlertDialogTag key={tag.tagId} tagId={tag.tagId} showAlert={showAlert}>
                {tag.tagName}
              </AlertDialogTag>
            ))}
          </TagWrapper>
          {post.type === 'AD' ? (
            <Info>
              <li>
                <span>주종:</span> {mapDrinkType(postsDetail?.drink.type)}
              </li>
              <li>
                <span>도수:</span> {postsDetail?.drink.degree}%
              </li>
              <li>
                <span>당도:</span> {postsDetail?.drink.sweetness}
              </li>
            </Info>
          ) : (
            <Info>
              <li>
                <span>주종:</span> {mapDrinkType(postsDetail?.drink.type)}
              </li>
              <li>
                <span>도수:</span> {postsDetail?.drink.degree}%
              </li>
              <li>
                <span>당도:</span> {postsDetail?.drink.sweetness}
              </li>
              <li>
                <span>평점:</span> {postsDetail?.rating}
              </li>
              <li>
                <span>평균 평점:</span> {postsDetail?.drink.averageRating || 0}
              </li>
            </Info>
          )}
          <MetaData>
            <span>{dayjs(postsDetail?.createdAt).format('YYYY.MM.DD')}</span>
            <span>
              <ViewIcon /> {postsDetail?.viewCount.toLocaleString()}
            </span>
          </MetaData>
        </EtcWrap>
      </UserPost>
      <PostComments postId={postId} fetchCommentCount={fetchCommentCount} showAlert={showAlert} />
    </PostLayout>
  );
};

const PostLayout = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  height: auto;
  padding-top: 60px;
  background-color: ${({ theme }) => theme.colors.brightGray};
  color: ${({ theme }) => theme.colors.black};
`;

const PostTitleSection = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.brightGray};

  b {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 20px;
    font-size: ${({ theme }) => theme.fontSizes.base};

    span {
      display: inline-block;
      margin-right: 5px;
      padding: 2px 10px;
      background-color: ${({ theme }) => theme.colors.secondary};
      color: ${({ theme }) => theme.colors.white};
      font-size: ${({ theme }) => theme.fontSizes.small};
      font-weight: normal;
      border-radius: 20px;
    }
  }
`;

const UserPost = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.white};

  img {
    width: auto;
    height: 270px;
  }
`;

const Img = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
  border-top: 1px solid ${({ theme }) => theme.colors.brightGray};
  border-bottom: 1px solid ${({ theme }) => theme.colors.brightGray};

  img {
    object-fit: cover;
  }
`;

const DropdownMenuContentStyled = styled(DropdownMenuContent)`
  margin: 5px 1px 0 0;

  div {
    padding: 10px 0;
    font-size: ${({ theme }) => theme.fontSizes.small};
  }
`;

const Nickname = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  padding: 10px 20px;
  font-size: ${({ theme }) => theme.fontSizes.base};

  > svg {
    width: 30px;
    height: 30px;
    margin-right: 5px;
  }

  > img {
    width: 30px;
    height: 30px;
    margin-right: 5px;
    border-radius: 50%;
  }

  span {
    display: flex;
    margin-left: auto;
    padding: 0;

    svg {
      margin-right: -3px;
      color: ${({ theme }) => theme.colors.darkGray};
    }
  }
`;

const Interactions = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin: 10px 20px 10px 20px;
  width: 90%;

  > span {
    display: flex;

    align-items: center;
    font-size: ${({ theme }) => theme.fontSizes.small};

    span {
      min-width: 20px;
      width: auto;
    }

    svg {
      width: 24px;
      height: 24px;
      margin-right: 3px;
    }

    :nth-of-type(2) {
      svg {
        color: ${({ theme }) => theme.colors.darkGray};
      }
    }
  }

  > span:nth-of-type(3) {
    margin-left: auto;
    button {
      height: 25px;
      padding: 0;
      background: none;
      color: ${({ theme }) => theme.colors.darkGray};
      border: none;
      font-size: ${({ theme }) => theme.fontSizes.xsmall};
      text-decoration: underline;
    }
  }
`;

const Desc = styled.p`
  width: 100%;
  min-height: 21px;
  height: auto;
  margin-bottom: 20px;
  padding: 0 20px;
  line-height: 21px;
`;

const EtcWrap = styled.div`
  width: 100%;
  height: auto;
  padding: 0 20px 10px 20px;
`;

const TagWrapper = styled.div`
  width: 100%;
  margin-bottom: 15px;
  overflow-x: auto;
  white-space: nowrap;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    height: 0;
  }
`;

const Info = styled.ul`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: auto;
  margin-bottom: 15px;
  padding: 10px;
  background-color: ${({ theme }) => theme.colors.brightGray};
  font-size: ${({ theme }) => theme.fontSizes.small};
  border-radius: 10px;

  li {
    width: 28%;
    margin-right: 10px;
  }

  li:nth-of-type(5) {
    width: 30%;
  }

  li:nth-of-type(4),
  li:nth-of-type(5) {
    margin-top: 5px;
  }
`;

const MetaData = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;

  span {
    color: ${({ theme }) => theme.colors.gray};
    font-size: ${({ theme }) => theme.fontSizes.small};
  }

  span:nth-of-type(2) {
    display: flex;
    justify-content: flex-start;
    align-items: center;

    svg {
      width: 16px;
      height: 16px;
      margin-right: 3px;
    }
  }
`;

export default Post;
