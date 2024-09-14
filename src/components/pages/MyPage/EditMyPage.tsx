import { ContentWrapper, NoFooterLayout } from '@/styles/CommonStyles';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useSpecialtyStore } from '@/store/useSpecialtyStore';
import styled from '@emotion/styled';
import ExProfileImg from '@/assets/ExProfileImg';
import SettingIcon from '@/assets/icons/SettingIcon';
import { Member, useMemberStore } from '@/store/useMemberStore';
import { mapDrinkType } from '@/data/drinkTypes';
import { Value } from '@radix-ui/react-select';

const EditMyPage = () => {
  //** 유저 정보 */
  const { members, fetchMembers } = useMemberStore();
  const [currentUser, setCurrentUser] = useState<Member | null>(null);
  const [passwordError, setPasswordError] = useState<string>('');
  const [isCurrentPasswordValid, setIsCurrentPasswordValid] = useState<boolean>(false); // 패스워드 검증 성공 여부

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  useEffect(() => {
    if (members.length > 0) {
      const user = members.find(member => member.id === 1); // id가 1인 유저 찾기
      if (user) {
        setCurrentUser(user);
      }
    }
  }, [members]);

  //** 상태값 관리 */
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [currentPassword, setcurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChecked, setIsChecked] = useState(false);

  const isMatch = newPassword === confirmPassword && newPassword !== '';
  const navigate = useNavigate();

  const handleToggle = () => {
    setIsChecked(!isChecked); // 현재 상태의 반대로 설정
  };

  //** 기존 패스워드와 일치 여부 검사 함수 */
  const validateCurrentPassword = () => {
    if (currentUser && currentPassword !== currentUser.currentPassword) {
      setPasswordError('기존 패스워드와 일치하지 않습니다.'); // 패스워드 불일치 시 에러 메시지 설정
      setIsCurrentPasswordValid(false);
    } else {
      setPasswordError(''); // 패스워드 일치 시 에러 메시지 초기화
      setIsCurrentPasswordValid(true);
    }
  };

  //** 선호주종 목데이터 import 및 선호주종 변경 적용 */
  const { alldrinks, selectedDrinks, fetchDrinks, toggleDrinkSelection, setSelectedDrinks } =
    useSpecialtyStore();

  useEffect(() => {
    fetchDrinks();
  }, [fetchDrinks]);

  useEffect(() => {
    if (members.length > 0) {
      const user = members.find(member => member.id === 1);
      if (user) {
        setCurrentUser(user);

        const favorDrinks = user.favorDrinkType.map(type => mapDrinkType(type));
        setSelectedDrinks(favorDrinks);
      }
    }
  }, [members, setSelectedDrinks]);

  //** 사용자 프로필 이미지 변경 적용 */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    validateCurrentPassword();
    if (isCurrentPasswordValid && passwordError === '') {
      setSelectedDrinks(selectedDrinks);
      navigate('/mypage');
    }
  };

  return (
    <NoFooterLayout>
      <ContentWrapper>
        <EditTop>
          <span>회원정보 수정</span>
          <ImgWrapper onClick={() => document.getElementById('profileImageInput')?.click()}>
            {profileImage ? (
              <img src={profileImage} alt="Profile" />
            ) : (
              <ExProfileImg /> // 기본 이미지
            )}
            {/* <SettingIcon /> */}
          </ImgWrapper>
          <input
            id="profileImageInput"
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleImageChange}
          />
        </EditTop>
        <EditMid>
          <Label htmlFor="email">아이디(이메일)</Label>
          <Input
            type="email"
            placeholder={currentUser ? currentUser.email : '로딩 중...'}
            disabled
          />
          <Label htmlFor="name">
            닉네임(이름)
            {
              <Validation>
                {name.length < 2 || name.length > 7 ? '※2~7자로 해주세요.' : ''}
              </Validation>
            }
          </Label>
          <Input type="name" placeholder={currentUser ? currentUser.name : '로딩 중...'} />
          <Label htmlFor="currentPassword">기존 패스워드</Label>
          <Input
            type="password"
            id="currentPassword"
            value={currentPassword}
            onChange={e => setcurrentPassword(e.target.value)}
            onBlur={validateCurrentPassword}
          />
          {passwordError && <p style={{ color: 'red', fontSize: '12px' }}>{passwordError}</p>}
          <Label htmlFor="newPassword">신규 패스워드</Label>
          <Input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            disabled={!isCurrentPasswordValid}
          />
          <Label htmlFor="confirmPassword">신규 패스워드 확인</Label>
          <Input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            disabled={!isCurrentPasswordValid}
          />
          {newPassword && confirmPassword && !isMatch && (
            <p style={{ color: 'red', fontSize: '14px' }}>비밀번호가 일치하지 않습니다.</p>
          )}
          <Label htmlFor="">선호주종</Label>
          <AlcoholList>
            {alldrinks.map(drink => (
              <AlcoholItem
                key={drink}
                isSelected={selectedDrinks.includes(drink)}
                onClick={() => {
                  if (selectedDrinks.includes(drink)) {
                    toggleDrinkSelection(drink);
                  } else if (selectedDrinks.length < 5) {
                    toggleDrinkSelection(drink);
                  } else {
                    alert('최대 5개의 주종만 선택할 수 있습니다.');
                  }
                }}
              >
                {drink}
              </AlcoholItem>
            ))}
          </AlcoholList>
        </EditMid>
        <EditBottom>
          <Label htmlFor="">알림 On/Off</Label>
          <SwitchWrapper>
            <span>나의 게시글에 대한 댓글 알림</span>
            <div>
              <Switch onClick={handleToggle} />
              {isChecked ? 'ON' : 'OFF'}
            </div>
          </SwitchWrapper>
        </EditBottom>
        <ConfirmWrapper>
          <Link to="/mypage">
            <Button>취소</Button>
          </Link>
          <Link to="/mypage" onClick={handleSave}>
            <Button>저장</Button>
          </Link>
        </ConfirmWrapper>
      </ContentWrapper>
    </NoFooterLayout>
  );
};

const EditTop = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  span {
    font-size: ${({ theme }) => theme.fontSizes.large};
    font-weight: bold;
    padding-bottom: 20px;
  }
`;

const Validation = styled.span`
  margin-left: 4px;
  font-size: ${({ theme }) => theme.fontSizes.xsmall};
  color: ${({ theme }) => theme.colors.error};
`;

const ImgWrapper = styled.div`
  display: flex;
  position: relative;
  height: 120px;
  margin-bottom: 20px;
  justify-content: center;
  align-items: flex-end;

  svg:nth-child(1) {
    position: absolute;
    width: 120px;
    height: 120px;
    border: 1px solid ${({ theme }) => theme.colors.tertiary};
    border-radius: 50%;
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.focusShadow};
  }

  img {
    // position: absolute;
    width: 120px;
    height: 120px;
    border: 1px solid ${({ theme }) => theme.colors.tertiary};
    border-radius: 50%;
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.focusShadow};
  }

  svg:nth-child(2) {
    position: absolute;
    width: 35px;
    height: 35px;
    bottom: 2px;
    left: 25px;
    color: ${({ theme }) => theme.colors.white};
    background-color: ${({ theme }) => theme.colors.gray};
    border-radius: 50%;
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.focusShadow};
  }
`;

const EditMid = styled.ul`
  margin-bottom: 16px;

  input {
    margin-bottom: 8px;
    background-color: ${({ theme }) => theme.colors.lightGray};
    &:focus {
      border-color: ${({ theme }) => theme.colors.focusShadow};
      box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.focusShadow};
    }
    ::placeholder {
      color: ${({ theme }) => theme.colors.darkGray};
      opacity: 1;
    }
  }
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.fontSizes.xsmall};

  ::before {
    content: '* ';
    color: ${({ theme }) => theme.colors.tertiary};
  }
`;

interface AlcoholItemProps {
  isSelected: boolean;
}

const AlcoholList = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  overflow-y: scroll;
  width: 100%;
  gap: 10px;
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const AlcoholItem = styled.button<AlcoholItemProps>`
  width: 90px;
  height: 90px;
  background-color: ${({ isSelected, theme }) =>
    isSelected ? theme.colors.tertiary : theme.colors.lightGray};
  border-radius: 10px;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const EditBottom = styled.div`
  span {
    font-size: ${({ theme }) => theme.fontSizes.xsmall};
  }
`;

const SwitchWrapper = styled.div`
  display: flex;
  margin-top: 8px;
  justify-content: space-between;
  align-items: center;

  div {
    display: flex;
    button {
      margin-right: 2px;
    }
  }

  button[data-state='checked'] {
    background-color: ${({ theme }) => theme.colors.tertiary};
  }
`;

const ConfirmWrapper = styled.div`
  display: flex;
  margin-top: 60px;
  justify-content: space-around;

  button {
    width: 140px;
    border-radius: 30px;
  }

  a:nth-of-type(1) button {
    background-color: ${({ theme }) => theme.colors.gray};
  }

  a:nth-of-type(2) button {
    background-color: ${({ theme }) => theme.colors.primary};
  }
`;

export default EditMyPage;
