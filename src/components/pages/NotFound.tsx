import { ContentWrapper, PageLayout } from '@/styles/CommonStyles';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import notfoundImg from '@/assets/img/notfoundimg.jpg';

const NotFound = () => {
  return (
    <PageLayout>
      <ContentWrapper>
        <ImgStyled src={notfoundImg}></ImgStyled>
        <TitleStyled>오류가 발생했어요</TitleStyled>
        <SubtitleStyled>
          서비스 이용에 불편을 드려 죄송합니다 <br></br> 잠시 후 다시 이용해 주세요
        </SubtitleStyled>
        <ButtonStyled variant="outline">
          <Link to="/">홈으로</Link>
        </ButtonStyled>
      </ContentWrapper>
    </PageLayout>
  );
};

const ImgStyled = styled.img`
  display: block;
  width: 200px;
  height: 200px;
  margin: 0 auto;
`;

const TitleStyled = styled.h1`
  width: 100%;
  height: 45px;
  color: ${({ theme }) => theme.colors.black};
  font-size: ${({ theme }) => theme.fontSizes.xxlarge};
  font-weight: bold;
  text-align: center;
`;

const SubtitleStyled = styled.p`
  width: 100%;
  height: 40px;
  margin-top: 20px;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.colors.darkGray};
  font-size: ${({ theme }) => theme.fontSizes.medium};
  text-align: center;
`;

const ButtonStyled = styled(Button)`
  width: 100%;
  height: 45px;
  border-radius: 25px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  size: ${({ theme }) => theme.fontSizes.base};
`;

export default NotFound;
