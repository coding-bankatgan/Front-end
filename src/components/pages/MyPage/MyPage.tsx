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
          {selectedDrinks.map(drinkType => (
            <BadgeStyled key={drinkType}>{drinkType}</BadgeStyled>
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
  margin-bottom: 15px;
  justify-content: center;
  align-items: flex-end;

  svg {
    position: absolute;
    width: 120px;
    height: 120px;
  }
  
  > svg: first-child{
    border: 1px solid ${({ theme }) => theme.colors.tertiary};
    border-radius: 50%;
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.focusShadow};
    }

  a {
  position: absolute;
    svg {
      width: 25px;
      height: 25px;
      bottom: 2px;
      left: 30px;
      color: ${({ theme }) => theme.colors.gray};
      background-color: ${({ theme }) => theme.colors.white};
      border-radius: 50%;
      box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.focusShadow};
  }
`;

const BadgeWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 4px;
`;

const BadgeStyled = styled(Badge)`
  margin: 0 4px 0 4px;
  background-color: ${({ theme }) => theme.colors.primary};

  &:hover {
    backgound-color: none;
  }
`;

export default MyPage;
