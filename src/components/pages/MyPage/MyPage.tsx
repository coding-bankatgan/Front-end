import { ContentWrapper, PageLayout } from '@/styles/CommonStyles';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import MyPageTab from './MyPageTab';
import ExProfileImg from '@/assets/ExProfileImg';
import SettingIcon from '@/assets/icons/SettingIcon';
import { useMemberStore } from '@/store/useMemberStore';
import { mapDrinkType } from '@/data/drinkTypes';
import handleImg from '../../../assets/img/handimg.png';

const MyPage = () => {
  /** 유저 정보 */
  const { currentUser } = useMemberStore();
  const navigate = useNavigate();

  return (
    <PageLayout>
      <ContentWrapper>
        <ImgWrapper>
          <ExProfileImg />
          <EditMyPage onClick={() => navigate('/mypage/edit')}>
            <SettingIcon />
          </EditMyPage>
        </ImgWrapper>
        <UserNameWrapper>
          <h2>{currentUser?.name}</h2>
        </UserNameWrapper>
        <BadgeWrapper>
          <img src={handleImg} alt="선호 주종 리스트" />
          {currentUser?.favorDrinkType?.map(drinkType => (
            <BadgeStyled key={drinkType}>{mapDrinkType(drinkType)}</BadgeStyled>
          ))}
        </BadgeWrapper>
        <MyPageTab />
      </ContentWrapper>
    </PageLayout>
  );
};

const ImgWrapper = styled.span`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100px;
  height: 100px;
  margin: 0 auto 10px;

  > svg {
    width: 100px;
    height: 100px;
    border: 1px solid ${({ theme }) => theme.colors.lightGray};
    border-radius: 50%;
  }
`;

const EditMyPage = styled.span`
  position: absolute;
  bottom: 0;
  right: 0;
  border: 1px solid ${({ theme }) => theme.colors.lightGray};
  border-radius: 30px;
  z-index: 10;

  > svg {
    width: 27px;
    height: 27px;
    padding: 3px;
    background-color: ${({ theme }) => theme.colors.white};
    color: ${({ theme }) => theme.colors.gray};
    border-radius: 30px;
  }
`;

const UserNameWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 15px;

  h2 {
    width: auto;
    padding: 0 10px;
    background: linear-gradient(to top, rgba(255, 209, 140, 0.4) 45%, transparent 15%);
    color: ${({ theme }) => theme.colors.black};
    text-align: center;
    font-size: ${({ theme }) => theme.fontSizes.medium};
  }
`;

const BadgeWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
`;

const BadgeStyled = styled(Badge)`
  margin: 0 4px 0 4px;
  padding: 0px 15px;
  height: 27px;
  background-color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.fontSizes.small};
  font-weight: normal;

  &:focus,
  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
  }
`;

export default MyPage;
