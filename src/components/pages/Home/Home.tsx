import { ContentWrapper, PageLayout } from '@/styles/CommonStyles';
import styled from '@emotion/styled';
import Daily from './Daily';
import Tab from './Tab';

const Home = () => {
  return (
    <PageLayout>
      <ContentWrapper>
        <Daily />
        <Line />
        <Tab />
      </ContentWrapper>
    </PageLayout>
  );
};

export const Line = styled.div`
  width: 100%;
  height: 1px;
  margin: 25px 0;
  background-color: ${({ theme }) => theme.colors.gray};
`;

export default Home;
