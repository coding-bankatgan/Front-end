import { PageLayout } from '@/styles/CommonStyles';
import styled from '@emotion/styled';
import { Line } from '../Home/Home';
import ExProfileImg from '@/assets/ExProfileImg';
import ViewIcon from './../../../assets/icons/ViewIcon';
import AlertDialogTag from '@/components/layout/AlertDialogTag';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import SendIcon from '@/assets/icons/SendIcon';
import WarningIcon from '@/assets/icons/WarningIcon';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { usePostsDetailStore } from '@/store/postsDetailStore';
import { useEffect } from 'react';

const typeMap = {
  ADVERTISEMENT: '광고',
  REVIEW: '리뷰',
};

const Post = () => {
  const { postsDetail, fetchPostsDetail } = usePostsDetailStore();
  console.log('ffffff', postsDetail);
  const { id } = useParams();
  const postId = Number(id);

  useEffect(() => {
    fetchPostsDetail();
  }, [fetchPostsDetail]);

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
        <CommentWrapper>
          <Write>
            <div>
              <Textarea placeholder="댓글을 작성해주세요." />
              <Button>
                <SendIcon />
              </Button>
            </div>
          </Write>
          <Comments>
            {Array.from({ length: 3 }, (_, idx) => (
              <Comment key={idx}>
                <ExProfileImg />
                <CommentInfoWrapper>
                  <span>
                    <CommentNickname>닉네임</CommentNickname>
                    <CommentDate>2000.01.01</CommentDate>
                  </span>
                  <p>가나다라 마바사 아자차카 타파하 가나다라 마바사 아자차카 타파하.</p>
                </CommentInfoWrapper>
              </Comment>
            ))}
          </Comments>
          <ReportBtn>
            <WarningIcon /> 신고하기
          </ReportBtn>
        </CommentWrapper>
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
      font-size: ${({ theme }) => theme.fontSizes.xsmall};
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
  font-size: ${({ theme }) => theme.fontSizes.base};
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
    font-size: ${({ theme }) => theme.fontSizes.xsmall};
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
    padding: 5px;
    background-color: ${({ theme }) => theme.colors.clearGray};
    font-size: ${({ theme }) => theme.fontSizes.base};
    border-radius: 10px;
    resize: none;

    &:hover {
      box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.focusShadow};
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
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
  }
`;

const Comments = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 100px;
  height: auto;
  margin: 20px 0;
`;

const Comment = styled.div`
  display: flex;
  width: 100%;
  min-height: 50px;
  height: auto;
  padding: 10px;
  background: ${({ theme }) => theme.colors.clearGray};
  border-bottom: 1px solid ${({ theme }) => theme.colors.lightGray};

  &:first-of-type {
    border-radius: 10px 10px 0 0;
  }

  &:last-of-type {
    border-bottom: 0;
    border-radius: 0 0 10px 10px;
  }

  svg {
    width: 35px;
    height: 35px;
    margin-right: 10px;
    margin-top: -5px;
  }
`;

const CommentInfoWrapper = styled.div`
  > span {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  p {
    font-size: ${({ theme }) => theme.fontSizes.base};
  }
`;

const CommentNickname = styled.span`
  margin-right: 10px;
  font-size: ${({ theme }) => theme.fontSizes.base};
`;

const CommentDate = styled.span`
  color: ${({ theme }) => theme.colors.gray};
  font-size: ${({ theme }) => theme.fontSizes.xsmall};
`;

const ReportBtn = styled.span`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin: 30px 0 10px 0;
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.fontSizes.xsmall};

  svg {
    width: 18px;
    height: 18px;
  }
`;

export default Post;
