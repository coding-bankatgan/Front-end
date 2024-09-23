import { ContentWrapper, PageLayout } from '@/styles/CommonStyles';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import styled from '@emotion/styled';
import MyPageTab from './MyPageTab';
import ExProfileImg from '@/assets/ExProfileImg';
import SettingIcon from '@/assets/icons/SettingIcon';
import HandIcon from '@/assets/icons/HandIcon';
import { useMemberStore } from '@/store/useMemberStore';
import { mapDrinkType } from '@/data/drinkTypes';

const MyPage = () => {
  /** 유저 정보 */
  const { currentUser, fetchMembers } = useMemberStore();
  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

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
          <HandIcon />
          {currentUser?.favorDrinkType?.map(drinkType => (
            <BadgeStyled key={drinkType}>{mapDrinkType(drinkType)}</BadgeStyled>
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
    :first-child {
      border: 1px solid ${({ theme }) => theme.colors.tertiary};
      border-radius: 50%;
      box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.focusShadow};
    }
  }
`;

const EditMyPage = styled(Button)`
  position: absolute;
  top: 85px;
  right: 125px;
  padding: 0;
  background-color: transparent;
  border: none;

  > svg {
    width: 25px;
    height: 25px;
    color: ${({ theme }) => theme.colors.gray};
    background-color: ${({ theme }) => theme.colors.white};
    border-radius: 50%;
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.focusShadow};
  }
`;

const UserNameWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;

  h2 {
    width: 100px;
    text-align: center;
    font-size: ${({ theme }) => theme.fontSizes.large};
    background: linear-gradient(to top, #e9d7cb 40%, transparent 15%);
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

  &:focus,
  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
    border-color: ${({ theme }) => theme.colors.focusShadow};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.focusShadow};
  }
`;

export default MyPage;
