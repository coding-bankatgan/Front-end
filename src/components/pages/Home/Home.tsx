import styled from '@emotion/styled';
import Daily from './Daily';
import Tab from './Tab';

const Home = () => {
  return (
    <HomeLayout>
      <Daily />
      <Tab />
    </HomeLayout>
  );
};

const HomeLayout = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  height: auto;
  padding-top: 60px;
  background-color: ${({ theme }) => theme.colors.brightGray};
`;

export default Home;
