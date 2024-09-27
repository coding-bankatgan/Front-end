import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { usePostsStore } from '@/store/usePostsStore';
import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import CardItem from '@/components/layout/CardItem';
import FollowTagList from './FollowTagList';
import BookmarkIcon from '@/assets/icons/BookmarkIcon';
import ListIcon from '@/assets/icons/ListIcon';
import { useMemberStore } from '@/store/useMemberStore';

const MyPageTab = () => {
  const { posts, fetchPosts } = usePostsStore();
  const { members } = useMemberStore();
  const [sortOrder] = useState('recent');
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('my-posts');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const sortBy = sortOrder;
      await fetchPosts(sortBy);
      setIsLoading(false);
    };

    fetchData();
  }, [sortOrder, fetchPosts]);

  const filteredPosts = Array.isArray(posts)
    ? posts.filter(posts => posts.memberId === members[0].id)
    : [];

  return (
    <TabsStyled className="w-[100%]" value={activeTab} onValueChange={setActiveTab}>
      <TabsListStyled>
        <TabsTrigger value="my-posts">
          <ListIcon />
        </TabsTrigger>
        <TabsTrigger value="my-tag-lists">
          <BookmarkIcon />
        </TabsTrigger>
      </TabsListStyled>
      <TabsPostContentStyled value="my-posts" isActive={activeTab === 'my-posts'}>
        {isLoading ? (
          <SkeWrapper>
            {Array.from({ length: 10 }).map((_, index) => (
              <div key={index} className="flex flex-col space-y-2 w-1/2 p-1">
                <Skeleton className="w-full h-[155px] rounded-xl" />
                <div className="space-y-1">
                  <div className="flex flex-row space-x-2">
                    <Skeleton className="w-6 h-5 rounded-full" />
                    <Skeleton className="w-full h-5 max-w-[200px]" />
                  </div>
                  <Skeleton className="w-full h-8 max-w-[250px]" />
                  <Skeleton className="w-full h-5 max-w-[250px]" />
                  <Skeleton className="w-full h-3 max-w-[200px]" />
                </div>
              </div>
            ))}
          </SkeWrapper>
        ) : filteredPosts.length > 0 ? (
          filteredPosts.map(post => <CardItem key={post.id} post={post} />)
        ) : (
          <p>작성된 게시글이 없습니다</p>
        )}
      </TabsPostContentStyled>
      <TabsTagsContentStyled value="my-tag-lists" isActive={activeTab === 'my-tag-lists'}>
        <FollowTagList />
      </TabsTagsContentStyled>
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

const TabsPostContentStyled = styled(TabsContent)<{ isActive: boolean }>`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  width: ${({ isActive }) => (isActive ? '100%' : '0')};
  min-height: ${({ isActive }) => (isActive ? '200px' : '0')};
  height: ${({ isActive }) => (isActive ? 'auto' : '0')};
  margin-top: 10px;
  overflow: hidden;
`;

const TabsTagsContentStyled = styled(TabsContent)<{ isActive: boolean }>`
  width: ${({ isActive }) => (isActive ? '100%' : '0')};
  min-height: ${({ isActive }) => (isActive ? '200px' : '0')};
  height: ${({ isActive }) => (isActive ? 'auto' : '0')};
  margin-top: 20px;
  overflow: hidden;
`;

const SkeWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

export default MyPageTab;
