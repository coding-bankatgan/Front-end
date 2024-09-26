import styled from '@emotion/styled';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePostsStore } from '@/store/usePostsStore';
import { useEffect, useState } from 'react';
import CardItem from '@/components/layout/CardItem';

const Tab = () => {
  const { posts, fetchPosts } = usePostsStore();
  const [selectedTab, setSelectedTab] = useState('all');
  const [sortOrder, setSortOrder] = useState('recent');

  useEffect(() => {
    const fetchData = async () => {
      fetchPosts();
    };

    fetchData();
  }, [fetchPosts]);

  const filteredPosts = Array.isArray(posts)
    ? selectedTab === 'all'
      ? posts
      : posts.filter(
          post => post.type === (selectedTab === 'advertisement' ? 'ADVERTISEMENT' : 'REVIEW'),
        )
    : [];

  const sortedPosts = filteredPosts.sort((a, b) => {
    if (sortOrder === 'recent') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortOrder === 'views') {
      return b.viewCount - a.viewCount;
    }
    return 0;
  });

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(e.target.value);
  };

  return (
    <TabsStyled defaultValue="all" className="w-[100%]">
      <TabsListStyled>
        <TabsTrigger value="all" onClick={() => setSelectedTab('all')}>
          전체
        </TabsTrigger>
        <TabsTrigger value="advertisement" onClick={() => setSelectedTab('advertisement')}>
          광고
        </TabsTrigger>
        <TabsTrigger value="review" onClick={() => setSelectedTab('review')}>
          리뷰
        </TabsTrigger>
      </TabsListStyled>
      <SelectStyled value={sortOrder} onChange={handleSelectChange}>
        <option value="recent">최신 순</option>
        <option value="views">조회수 순</option>
      </SelectStyled>
      <TabsContentStyled value={selectedTab}>
        {sortedPosts.length > 0 ? (
          sortedPosts.map(post => <CardItem key={post.id} post={post} />)
        ) : (
          <p>작성된 게시글이 없습니다</p>
        )}
      </TabsContentStyled>
    </TabsStyled>
  );
};

const TabsStyled = styled(Tabs)`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 20px;
  background-color: ${({ theme }) => theme.colors.white};

  > button {
    height: 30px;
    margin-left: auto;
    margin-top: 10px;
    border: 1px solid ${({ theme }) => theme.colors.lightGray};
  }
`;

const TabsListStyled = styled(TabsList)`
  display: flex;
  justify-content: flex-start;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.brightGray};
  border-radius: 20px;

  button {
    padding: 6px 15px;
    border-radius: 20px;
  }
`;

const TabsContentStyled = styled(TabsContent)`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
  min-height: 200px;
  height: auto;
  margin-top: 10px;
`;

const SelectStyled = styled.select`
  width: 100px;
  height: 35px;
  margin-left: auto;
  margin-top: 10px;
  font-size: ${({ theme }) => theme.fontSizes.small};
  border-radius: 5px;

  :focus,
  :active {
    border-color: ${({ theme }) => theme.colors.focusShadowGray};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.focusShadowGray};
    outline: none;
  }
`;

export default Tab;
