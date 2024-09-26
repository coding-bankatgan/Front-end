import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import notfoundImg from '@/assets/img/notfoundimg.jpg';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <NotFoundLayout>
      <ImgStyled src={notfoundImg}></ImgStyled>
      <TitleStyled>오류가 발생했어요</TitleStyled>
      <SubtitleStyled>
        서비스 이용에 불편을 드려 죄송합니다. <br /> 잠시 후 다시 이용해 주세요.
      </SubtitleStyled>
      <ButtonStyled variant="outline" onClick={() => navigate('/')}>
        홈으로
      </ButtonStyled>
    </NotFoundLayout>
  );
};

const NotFoundLayout = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  max-width: auto;
  min-height: calc(100vh - 120px);
  height: auto;
  margin-top: 60px;
  padding: 20px;
`;

const ImgStyled = styled.img`
  display: block;
  width: 180px;
  height: 180px;
  margin: -20px auto;
`;

const TitleStyled = styled.h1`
  width: 100%;
  color: ${({ theme }) => theme.colors.black};
  font-size: ${({ theme }) => theme.fontSizes.large};
  font-weight: bold;
  text-align: center;
`;

const SubtitleStyled = styled.p`
  width: 100%;
  height: 40px;
  margin-top: 10px;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.colors.darkGray};
  font-size: ${({ theme }) => theme.fontSizes.small};
  text-align: center;
`;

const ButtonStyled = styled(Button)`
  width: 100%;
  height: 45px;
  border-radius: 25px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.fontSizes.base};
`;

export default NotFound;
