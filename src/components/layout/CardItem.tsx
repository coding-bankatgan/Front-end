import styled from '@emotion/styled';
import ViewIcon from './../../assets/icons/ViewIcon';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import HeartIcon from '@/assets/icons/HeartIcon';
import { Badge } from '@/components/ui/badge';
import ExProfileImg from '@/assets/ExProfileImg';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { Post, usePostsStore } from '@/store/usePostsStore';
import { motion } from 'framer-motion';
import CustomAlert from '@/components/layout/CustomAlert';
import { useState } from 'react';
import DOMPurify from 'dompurify';

interface CardItemProps {
  post: Post;
}

const CardItem = ({ post }: CardItemProps) => {
  const navigate = useNavigate();
  const { togglePostLike } = usePostsStore();
  const [isLiked, setIsLiked] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const toggleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleCardClick = () => {
    if (window.location.pathname.startsWith('/posts/')) {
      setAlert({
        type: 'error',
        message: '잘못된 URL 형식입니다. 유효한 경로는 /post/입니다.',
      });
      return;
    }

    navigate(`/post/${post.id}`);
  };

  return (
    <CardStyled onClick={handleCardClick}>
      {alert && (
        <CustomAlert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)} // 알림 닫기
        />
      )}
      <CardHeaderStyled>
        <img src={post.imageUrl} alt={post.drink.name} />
      </CardHeaderStyled>
      <CardContentStyled>
        <ContentTop>
          <span>
            {post.memberImageUrl ? (
              <img src={post.memberImageUrl} alt={post.memberName} />
            ) : (
              <ExProfileImg />
            )}

            {post.memberName}
          </span>
          <motion.button
            onClick={toggleLike}
            style={{
              border: 'none',
              background: 'none',
              cursor: 'pointer',
            }}
          >
            <motion.div
              whileTap={{ scale: 1.2 }}
              animate={{
                scale: post.isLiked ? [1, 1.2, 1] : [1, 1.2, 1],
                color: post.isLiked ? '#FF3140' : '#4B463F',
              }}
              transition={{
                type: 'spring',
                stiffness: 500, // 스프링 강도
                damping: 20, // 반동 후 멈추는 정도
                bounce: 0.5, // 튕기는 효과
              }}
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '18px',
                height: '18px',
              }}
            >
              <HeartIcon
                onClick={e => {
                  e.stopPropagation();
                  togglePostLike(post.id, post.isLiked);
                }}
                liked={post.isLiked}
              />
            </motion.div>
          </motion.button>
        </ContentTop>
        <DrinkName>{post.drink.name}</DrinkName>
        <p dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}></p>
        <TagWrapper>
          {post.tags.map(tag => (
            <Badge key={tag.tagId}>#{tag.tagName}</Badge>
          ))}
        </TagWrapper>
      </CardContentStyled>
      <CardFooterStyled>
        <span>{dayjs(post.createdAt).format('YYYY.MM.DD')}</span>
        <span>
          <ViewIcon />
          {post.viewCount.toLocaleString()}
        </span>
      </CardFooterStyled>
    </CardStyled>
  );
};

const CardStyled = styled(Card)`
  width: 48.5%;
  margin-bottom: 7.5px;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.colors.lightGray};
  color: ${({ theme }) => theme.colors.black};
  box-shadow: none;
  overflow: hidden;
`;

const CardHeaderStyled = styled(CardHeader)`
  min-width: 135px;
  width: auto;
  height: 150px;
  padding: 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.lightGray};

  img {
    width: auto;
    height: 100%;
    object-fit: cover;
  }
`;

const CardContentStyled = styled(CardContent)`
  padding: 8px 8px 0px 8px;

  p {
    display: -webkit-box;
    height: 34px;
    margin-top: 2px;
    font-size: ${({ theme }) => theme.fontSizes.small};
    text-align: left;
    letter-spacing: -0.3px;
    line-height: 17px;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
`;

const ContentTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  span {
    display: flex;
    font-size: ${({ theme }) => theme.fontSizes.small};

    svg {
      width: 20px;
      height: 20px;
      margin-right: 3px;
    }

    > img {
      width: 20px;
      height: 20px;
      border-radius: 50%;
    }
  }

  > svg {
    width: 16px;
    height: 16px;
    color: ${({ theme }) => theme.colors.gray};
  }
`;

const DrinkName = styled.span`
  background: linear-gradient(
    to top,
    ${({ theme }) => theme.colors.focusShadowOrange} 45%,
    transparent 15%
  );
  font-size: ${({ theme }) => theme.fontSizes.xsmall};
`;

const TagWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  white-space: nowrap;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    height: 0;
  }

  div {
    margin-right: 4px;
    padding: 3px 10px;
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.white};
    font-size: ${({ theme }) => theme.fontSizes.xsmall};
    font-weight: normal;

    &:hover {
      background-color: ${({ theme }) => theme.colors.primary};
    }
  }

  div:nth-last-of-type(1) {
    margin-right: 0;
  }
`;

const CardFooterStyled = styled(CardFooter)`
  display: flex;
  justify-content: space-between;
  padding: 5px 10px;
  color: ${({ theme }) => theme.colors.gray};

  span:nth-of-type(1) {
    color: ${({ theme }) => theme.colors.gray};
    font-size: ${({ theme }) => theme.fontSizes.xsmall};
  }

  span:nth-of-type(2) {
    display: flex;
    align-items: center;
    color: ${({ theme }) => theme.colors.gray};
    font-size: ${({ theme }) => theme.fontSizes.xsmall};

    svg {
      width: 14px;
      height: 14px;
      margin-right: 3px;
    }
  }
`;

export default CardItem;
