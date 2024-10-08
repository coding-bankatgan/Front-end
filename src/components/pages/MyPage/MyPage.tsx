import { ContentWrapper, PageLayout } from '@/styles/CommonStyles';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import MyPageTab from './MyPageTab';
import ExProfileImg from '@/assets/ExProfileImg';
import SettingIcon from '@/assets/icons/SettingIcon';
import { useMemberStore } from '@/store/useMemberStore';
import { alcoholsData } from '@/data/alcoholsData';
import handleImg from '../../../assets/img/handimg.png';
import { useEffect } from 'react';

const MyPage = () => {
  /** 유저 정보 */
  const { members, fetchMembers } = useMemberStore();
  const navigate = useNavigate();
  const favorDrink = members[0]?.favorDrinkType as Array<keyof typeof alcoholsData>;

  useEffect(() => {
    fetchMembers();
  }, []);

  return (
    <PageLayout>
      <ContentWrapper>
        <ImgWrapper>
          {members[0]?.imageUrl ? (
            <img src={members[0]?.imageUrl} alt="프로필 사진" />
          ) : (
            <ExProfileImg aria-label="기본 프로필 이미지" />
          )}
          <EditMyPage onClick={() => navigate('/mypage/edit')} aria-label="내정보 수정하기">
            <SettingIcon />
          </EditMyPage>
        </ImgWrapper>
        <UserNameWrapper>
          <h2>{members[0]?.name}</h2>
        </UserNameWrapper>
        <BadgeWrapper>
          <img src={handleImg} alt="선호 주종 리스트" />
          <BadgeScrollContainer>
            {favorDrink?.map((alcohol, idx) => (
              <BadgeStyled key={idx} aria-label="선호 주종">
                {alcoholsData[alcohol]}
              </BadgeStyled>
            ))}
          </BadgeScrollContainer>
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
  img {
    width: 100%;
    height: 100%;
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

const BadgeScrollContainer = styled.div`
  mid-width: 60%;
  max-width: 70%;
  margin-left: 4px;
  overflow-x: scroll;
  white-space: nowrap;
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const BadgeStyled = styled(Badge)`
  margin: 0 3px 0 3px;
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
