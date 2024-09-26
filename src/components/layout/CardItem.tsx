import styled from '@emotion/styled';
import ViewIcon from './../../assets/icons/ViewIcon';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import HeartIcon from '@/assets/icons/HeartIcon';
import { Badge } from '@/components/ui/badge';
import ExProfileImg from '@/assets/ExProfileImg';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { Post } from '@/store/usePostsStore';
import { useLikeStore } from '@/store/useLikeStore';

interface CardItemProps {
  post: Post;
}

const CardItem = ({ post }: CardItemProps) => {
  const { toggleLike } = useLikeStore();
  const liked = useLikeStore(state => state.likedPosts.includes(post.id));

  const navigate = useNavigate();

  return (
    <CardStyled onClick={() => navigate(`/post/${post.id}`)}>
      <CardHeaderStyled>
        <img src={post.imageUrl} alt={post.drink.name} />
      </CardHeaderStyled>
      <CardContentStyled>
        <ContentTop>
          <span>
            <ExProfileImg />
            {post.memberName}
          </span>
          <HeartIcon
            onClick={e => {
              e.stopPropagation();
              toggleLike(post.id);
            }}
            liked={liked}
          />
        </ContentTop>
        <DrinkName>{post.drink.name}</DrinkName>
        <p>{post.content}</p>
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
  min-width: 150px;
  width: 48.5%;
  margin-bottom: 10px;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.colors.lightGray};
  color: ${({ theme }) => theme.colors.black};
  box-shadow: none;
  overflow: hidden;
`;

const CardHeaderStyled = styled(CardHeader)`
  min-width: 135px;
  width: auto;
  height: 155px;
  padding: 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.lightGray};

  img {
    width: auto;
    height: 100%;
    object-fit: contain;
  }
`;

const CardContentStyled = styled(CardContent)`
  padding: 10px 10px 5px 10px;

  p {
    display: -webkit-box;
    height: 42px;
    margin-top: 2px;
    font-size: ${({ theme }) => theme.fontSizes.small};
    text-align: left;
    letter-spacing: -0.2px;
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
