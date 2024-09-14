import { PageLayout } from '@/styles/CommonStyles';
import styled from '@emotion/styled';
import ExProfileImg from '@/assets/ExProfileImg';
import ViewIcon from './../../../assets/icons/ViewIcon';
import AlertDialogTag from '@/components/layout/AlertDialogTag';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { usePostsDetailStore } from '@/store/usePostsDetailStore';
import PostComments from './PostComments';

const typeMap = {
  ADVERTISEMENT: '광고',
  REVIEW: '리뷰',
};

const Post = () => {
  const { postsDetail, fetchPostsDetail } = usePostsDetailStore();
  const { id } = useParams();
  const postId = Number(id);

  useEffect(() => {
    fetchPostsDetail(postId);
  }, [fetchPostsDetail, postId]);

  if (postsDetail.length === 0) {
    return <p>로딩 중...</p>;
  }

  const post = postsDetail.find(post => post.id === postId);

  if (!post) {
    return <p>게시글을 찾을 수 없습니다.</p>;
  }

  return (
    <PageLayoutStyled>
      <PostWrapper>
        <PostTitleSection>
          <b>
            <span>{typeMap[post?.type]}</span>
            {post?.drink.name}
          </b>
        </PostTitleSection>
        <UserPost>
          <Nickname>
            <ExProfileImg />
            {post?.memberName}
          </Nickname>
          <Img>
            <img src={post?.imageUrl} alt={post?.drink.name} />
          </Img>
          <Desc>{post?.content}</Desc>
          <EtcWrap>
            <Info>
              <li>
                <span>주종:</span> 막걸리
              </li>
              <li>
                <span>도수:</span> {post?.drink.degree}
              </li>
              <li>
                <span>당도:</span> {post?.drink.sweetness}
              </li>
              <li>
                <span>평점:</span> {post?.rating}
              </li>
            </Info>
            <TagWrapper>
              {post?.tags.map(tag => (
                <AlertDialogTag key={tag.tagId}>{tag.tagName}</AlertDialogTag>
              ))}
            </TagWrapper>
            <MetaData>
              <span>{dayjs(post?.createdAt).format('YYYY-MM-DD')}</span>
              <span>
                <ViewIcon /> {post?.viewCount.toLocaleString()}
              </span>
            </MetaData>
          </EtcWrap>
        </UserPost>
        <PostComments postId={postId} />
      </PostWrapper>
    </PageLayoutStyled>
  );
};

const PageLayoutStyled = styled(PageLayout)`
  background-color: ${({ theme }) => theme.colors.brightGray};
`;

const PostWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  min-width: 320px;
  width: 100%;
  min-height: calc(100vh - 180px);
  height: auto;
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
`;

const Nickname = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  padding: 10px 20px;
  font-size: ${({ theme }) => theme.fontSizes.base};

  svg {
    width: 30px;
    height: 30px;
    margin-right: 5px;
  }
`;

const Desc = styled.p`
  width: 100%;
  min-height: 50px;
  height: auto;
  margin: 10px 0;
  padding: 5px 20px 20px 20px;
  line-height: 21px;
`;

const EtcWrap = styled.div`
  width: 100%;
  height: auto;
  padding: 0 20px 10px 20px;
`;

const Info = styled.ul`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: auto;
  padding: 10px;
  background-color: ${({ theme }) => theme.colors.brightGray};
  font-size: ${({ theme }) => theme.fontSizes.small};
  border-radius: 10px;

  li {
    width: 20%;
  }

  li:nth-of-type(1) {
    width: 27%;
  }
`;

const TagWrapper = styled.div`
  width: 100%;
  margin: 10px 0 20px;
  overflow-x: auto;
  white-space: nowrap;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    height: 0;
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
