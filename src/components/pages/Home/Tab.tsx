import styled from '@emotion/styled';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import CardItemList from '../../layout/CardItemList';

const Tab = () => {
  return (
    <TabsStyled defaultValue="all" className="w-[100%]">
      <TabsListStyled>
        <TabsTrigger value="all">전체</TabsTrigger>
        <TabsTrigger value="advertisement">광고</TabsTrigger>
        <TabsTrigger value="review">리뷰</TabsTrigger>
      </TabsListStyled>
      <Select>
        <SelectTrigger className="w-[100px]">
          <SelectValue placeholder="최신 순" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="light">최신 순</SelectItem>
          <SelectItem value="dark">조회수 순</SelectItem>
        </SelectContent>
      </Select>
      <TabsContentStyled value="all">
        <CardItemList />
      </TabsContentStyled>
      <TabsContentStyled value="advertisement">광고</TabsContentStyled>
      <TabsContentStyled value="review">리뷰</TabsContentStyled>
    </TabsStyled>
  );
};

const TabsStyled = styled(Tabs)`
  > button {
    height: 30px;
    margin-left: auto;
    margin-top: 10px;
    font-size: ${({ theme }) => theme.fontSizes.xsmall};
    border: 1px solid ${({ theme }) => theme.colors.lightGray};

    &:focus {
      border-color: ${({ theme }) => theme.colors.focusShadow};
      box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.focusShadow};
    }
  }
`;

const TabsListStyled = styled(TabsList)`
  display: flex;
  justify-content: flex-start;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.lightGray};
  border-radius: 20px;

  button {
    padding: 6px 15px;
    border-radius: 20px;
  }
`;

const TabsContentStyled = styled(TabsContent)`
  width: 100%;
  min-height: 200px;
  height: auto;
  margin-top: 20px;
`;

export default Tab;
