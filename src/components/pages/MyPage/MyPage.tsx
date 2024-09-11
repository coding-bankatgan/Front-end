import { ContentWrapper, PageLayout } from '@/styles/CommonStyles';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import MyPageTab from './MyPageTab';
import ExProfileImg from '@/assets/ExProfileImg';
import SettingIcon from '@/assets/icons/SettingIcon';
import HandIcon from '@/assets/icons/HandIcon';
import { useSpecialtyStore } from '@/store/useSpecialtyStore';

const MyPage = () => {
  const { selectedDrinks } = useSpecialtyStore();
  return (
    <PageLayout>
      <ContentWrapper>
        <ImgWrapper>
          <ExProfileImg />
          <Link to="/mypage/edit">
            <SettingIcon />
          </Link>
        </ImgWrapper>
        <BadgeWrapper>
          <HandIcon />
          {selectedDrinks.map(drink => (
            <BadgeStyled key={drink}>{drink}</BadgeStyled>
          ))}
        </BadgeWrapper>
        <MyPageTab />
      </ContentWrapper>
    </PageLayout>
  );
};

const ImgWrapper = styled.div`
  display: flex;
  position: relative;
  height: 120px;
  margin-bottom: 20px;
  justify-content: center;
  align-items: flex-end;
  svg {
    position: absolute;
    width: 120px;
    height: 120px;
  }

  a {
  position: absolute;
    svg {
      width: 35px;
      height: 35px;
      bottom: 2px;
      left: 25px;
  }
`;

const BadgeWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 8px;
`;

const BadgeStyled = styled(Badge)`
  margin: 0 4px 0 4px;
  background-color: ${({ theme }) => theme.colors.primary};

  &:hover {
    backgound-color: none;
  }
`;

export default MyPage;
