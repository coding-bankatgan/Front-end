import { ContentWrapper, PageLayout } from '@/styles/CommonStyles';
import { Button } from '@/components/ui/button';
import styled from '@emotion/styled';

const Home = () => {
  return (
    <PageLayout>
      <ContentWrapper>
        <ButtonStyled variant="outline">Button</ButtonStyled>
      </ContentWrapper>
    </PageLayout>
  );
};

const ButtonStyled = styled(Button)`
  width: 100%;
  height: 45px;
  border-radius: 25px;
  background-color: ${({ theme }) => theme.colors.white};
`;

export default Home;
