import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import styled from '@emotion/styled';
import CardItemList from '../../layout/CardItemList';
import FollowTagList from './FollowTagList';
import BookmarkIcon from '@/assets/icons/BookmarkIcon';
import ListIcon from '@/assets/icons/ListIcon';

const MyPageTab = () => {
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
        <CardItemList />
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
  background-color: ${({ theme }) => theme.colors.white};

  button {
    transition: none;
    padding: 6px 15px;
    &[data-state='active'] {
      box-shadow: none;
      border-bottom: 1px solid ${({ theme }) => theme.colors.primary};
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
