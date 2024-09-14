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
  justify-content: space-around;
  width: 100%;
  height: 40px;
  background-color: ${({ theme }) => theme.colors.white};

  button {
    transition: none;
    padding: 6px 15px;
    &[data-state='active'] {
      box-shadow: none;
      border-bottom: 1px solid ${({ theme }) => theme.colors.primary};
      > svg {
        color: ${({ theme }) => theme.colors.primary};
      }
    }

    svg {
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
