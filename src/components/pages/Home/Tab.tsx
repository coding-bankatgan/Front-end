import styled from '@emotion/styled';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePostsStore } from '@/store/usePostsStore';
import { useEffect, useRef, useState } from 'react';
import CardItem from '@/components/layout/CardItem';
import { Skeleton } from '@/components/ui/skeleton';

const Tab = () => {
  const { posts, fetchPosts, clearPosts } = usePostsStore();
  const [selectedTab, setSelectedTab] = useState('all');
  const [sortOrder, setSortOrder] = useState('recent');
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isContentVisible, setIsContentVisible] = useState(false); // 데이터 받아올 때 애니메이션 상태

  const loadingRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    clearPosts();
    setPage(0);
    setHasMore(true);
  }, [selectedTab, sortOrder]);

  const handleObserver: IntersectionObserverCallback = entries => {
    if (!hasMore) {
      return;
    }
    const target = entries[0];
    if (target.isIntersecting) {
      setPage(prevPage => prevPage + 1);
    }
  };

  useEffect(() => {
    const options: IntersectionObserverInit = {
      root: null,
      rootMargin: '2px 100px',
      threshold: 0.1,
    };

    const observer = new IntersectionObserver(handleObserver, options);
    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }

    return () => {
      if (loadingRef.current) {
        observer.unobserve(loadingRef.current);
      }
    };
  }, [loadingRef, hasMore]);

  useEffect(() => {
    if (!hasMore) {
      return;
    }

    setIsContentVisible(false);

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const sortBy = sortOrder === 'recent' ? 'createdAt' : 'viewCount';
        await new Promise(resolve => setTimeout(resolve, 1000));
        await fetchPosts(sortBy, page);
      } catch (error) {
        setHasMore(false);
      } finally {
        setIsLoading(false);
        setTimeout(() => {
          setIsContentVisible(true); // 데이터를 받아온 후 애니메이션 시작
        }, 200);
      }
    };

    fetchData();
  }, [page, selectedTab, sortOrder]);

  useEffect(() => {
    console.log(hasMore);
  }, [hasMore]);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(e.target.value);
  };

  const filteredPosts = Array.isArray(posts)
    ? posts.filter(post => {
        if (selectedTab === 'all') return true;
        return post.type === (selectedTab === 'advertisement' ? 'AD' : 'REVIEW');
      })
    : [];

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
        {isLoading ? (
          <SkeWrapper className={isLoading ? 'fade-in' : 'fade-out'}>
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
          <ContentWrapper className={isContentVisible ? 'visible' : ''}>
            {filteredPosts.map(post => (
              <CardItem key={post.id} post={post} />
            ))}
          </ContentWrapper>
        ) : (
          <p>작성된 게시글이 없습니다</p>
        )}
      </TabsContentStyled>
      {hasMore ? <div ref={loadingRef} /> : <p>더 이상의 게시글이 없습니다!</p>}
    </TabsStyled>
  );
};

const ContentWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;

  &.visible {
    opacity: 1;
  }
`;

const SkeWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  transition: opacity 0.3s ease-in-out;

  &.fade-out {
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
  }

  &.fade-in {
    opacity: 1;
    transition: opacity 0.3s ease-in-out;
  }
`;

const TabsStyled = styled(Tabs)`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 20px 20px 40px 20px;
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
