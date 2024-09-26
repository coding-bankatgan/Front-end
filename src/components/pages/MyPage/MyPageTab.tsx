import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePostsStore } from '@/store/usePostsStore';
import { useEffect } from 'react';
import styled from '@emotion/styled';
import CardItem from '@/components/layout/CardItem';
import FollowTagList from './FollowTagList';
import BookmarkIcon from '@/assets/icons/BookmarkIcon';
import ListIcon from '@/assets/icons/ListIcon';
import { useMemberStore } from '@/store/useMemberStore';

const MyPageTab = () => {
  const { posts, fetchPosts } = usePostsStore();
  const { currentUser } = useMemberStore();

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const filteredPosts = Array.isArray(posts)
    ? posts.filter(posts => posts.memberId === currentUser?.id)
    : [];

  return (
    <TabsStyled defaultValue="my-posts" className="w-[100%]">
      <TabsListStyled>
        <TabsTrigger value="my-posts">
          <ListIcon />
        </TabsTrigger>
        <TabsTrigger value="my-tag-lists">
          <BookmarkIcon />
        </TabsTrigger>
      </TabsListStyled>
      <TabsContentStyled value="my-posts">
        {filteredPosts.length > 0 ? (
          filteredPosts.map(post => <CardItem key={post.id} post={post} />)
        ) : (
          <p>아무것도 없어요</p>
        )}
      </TabsContentStyled>
      <TabsContentStyled value="my-tag-lists">
        <FollowTagList />
      </TabsContentStyled>
    </TabsStyled>
  );
};

const TabsStyled = styled(Tabs)`
  margin-top: 5px;

  > button {
    height: 30px;
    margin-left: auto;
    margin-top: 10px;
    font-size: ${({ theme }) => theme.fontSizes.xsmall};
  }
`;

const TabsListStyled = styled(TabsList)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-auto-flow: column;
  justify-content: space-between;
  width: 100%;
  height: auto;
  background-color: ${({ theme }) => theme.colors.white};
  border-bottom: 1px solid ${({ theme }) => theme.colors.lightGray};
  border-radius: 0;
  padding: 0;

  button {
    padding: 10px 0;
    border-radius: 0;
    border-bottom: 1px solid ${({ theme }) => theme.colors.white};

    &[data-state='active'] {
      border-bottom: 1px solid ${({ theme }) => theme.colors.primary};
      box-shadow: none;
      > svg {
        color: ${({ theme }) => theme.colors.primary};
      }
    }

    svg {
      width: 22px;
      height: 20px;
      color: ${({ theme }) => theme.colors.darkGray};
    }
  }
`;

const TabsContentStyled = styled(TabsContent)`
  width: 100%;
  min-height: 200px;
  height: auto;
  margin-top: 20px;
`;

export default MyPageTab;
