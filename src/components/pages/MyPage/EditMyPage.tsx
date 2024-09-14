import { ContentWrapper, NoFooterLayout } from '@/styles/CommonStyles';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Alert } from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog'; // 적절한 경로로 변경
import { useSpecialtyStore } from '@/store/useSpecialtyStore';
import { useMemberStore } from '@/store/useMemberStore';
import { mapDrinkType } from '@/data/drinkTypes';
import ExProfileImg from '@/assets/ExProfileImg';
import styled from '@emotion/styled';

const EditMyPage = () => {
  //** 유저 정보 */
  const { currentUser, fetchMembers } = useMemberStore();
  const [passwordError, setPasswordError] = useState<string>('');
  const [isCurrentPasswordValid, setIsCurrentPasswordValid] = useState<boolean>(false); // 패스워드 검증 성공 여부

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  //** 상태값 관리 */
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [name, setName] = useState(currentUser?.name || '');
  const [currentPassword, setcurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isAlramChecked, setIsAlramChecked] = useState(false);
  const [isAgreeChecked, setIsAgreeChecked] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [saveAlertVisible, setSaveAlertVisible] = useState(false);

  const isMatch = newPassword === confirmPassword && newPassword !== '';
  const navigate = useNavigate();

  const alramToggle = () => {
    setIsAlramChecked(!isAlramChecked); // 현재 상태의 반대로 설정
  };

  const agreeToggle = () => {
    setIsAgreeChecked(!isAgreeChecked); // 현재 상태의 반대로 설정
  };

  //** 사용자 닉네임 변경 */
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
    }
  }, [currentUser]);

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
    if (currentUser) {
      const favorDrinks = currentUser.favorDrinkType.map(type => mapDrinkType(type));
      setSelectedDrinks(favorDrinks);
    }
  }, [currentUser, setSelectedDrinks]);

  //** 선호주종 5개 제한 */
  const handleDrinkSelection = (drink: string) => {
    if (selectedDrinks.includes(drink)) {
      toggleDrinkSelection(drink);
    } else if (selectedDrinks.length < 5) {
      toggleDrinkSelection(drink);
    } else {
      setAlertVisible(true);
      setTimeout(() => setAlertVisible(false), 1500);
    }
  };

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
    if (newPassword === confirmPassword) {
      setSelectedDrinks(selectedDrinks);
      navigate('/mypage');
    } else {
      setSaveAlertVisible(true);
      setTimeout(() => setSaveAlertVisible(false), 1000);
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
          {alertVisible && (
            <ModalWrapper>
              <AlertContent alertVisible={alertVisible} isSecondAlert={false}>
                <Alert variant="destructive">
                  <p>최대 5개의 주종만 선택할 수 있습니다.</p>
                </Alert>
              </AlertContent>
            </ModalWrapper>
          )}
          <AlcoholList>
            {alldrinks.map(drink => (
              <AlcoholItem
                key={drink}
                isSelected={selectedDrinks.includes(drink)}
                onClick={() => handleDrinkSelection(drink)}
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
              {isAlramChecked ? 'ON' : 'OFF'}
              <Switch onClick={alramToggle} />
            </div>
          </SwitchWrapper>
          <Label htmlFor="">정보 제공 동의</Label>
          <SwitchWrapper>
            <span>위치 정보 제공 동의</span>
            <div>
              {isAgreeChecked ? 'ON' : 'OFF'}
              <Switch onClick={agreeToggle} />
            </div>
          </SwitchWrapper>
        </EditBottom>
        <ConfirmWrapper>
          <Button onClick={() => navigate('/mypage')}>취소</Button>
          <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button>저장</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogDescription>
                  회원정보 수정사항을 저장하시겠습니까?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancelStyled onClick={() => setIsDialogOpen(false)}>
                  취소
                </AlertDialogCancelStyled>
                <AlertDialogActionStyled onClick={handleSave}>저장</AlertDialogActionStyled>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          {saveAlertVisible && (
            <ModalWrapper>
              <AlertContent alertVisible={saveAlertVisible} isSecondAlert={true}>
                <Alert variant="destructive">
                  <p>새 비밀번호와 확인 비밀번호가 일치하지 않습니다.</p>
                </Alert>
              </AlertContent>
            </ModalWrapper>
          )}
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

  :not(:first-of-type)::before {
    content: '* ';
    color: ${({ theme }) => theme.colors.tertiary};
  }
`;

const ModalWrapper = styled.div`
  position: fixed;
  display: flex;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const AlertContent = styled.div<{ alertVisible: boolean; isSecondAlert: boolean }>`
  padding: 5px;
  background-color: rgba(255, 0, 0, 0.3); /* 반투명한 배경 */
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  opacity: ${({ alertVisible }) => (alertVisible ? 1 : 0)};
  transform: ${({ alertVisible }) => (alertVisible ? 'translateY(0)' : 'translateY(-20px)')};
  transition:
    opacity 0.5s ease,
    transform 0.5s ease;
  z-index: 1001;

  * p {
    font-size: ${({ theme }) => theme.fontSizes.xsmall};
    color: ${({ theme }) => theme.colors.white};
  }

  ${({ alertVisible }) => (alertVisible ? `display: block;` : `display: none;`)}

  ${({ isSecondAlert }) =>
    isSecondAlert &&
    `
  `}
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

  label::before {
    content: '* ';
    color: ${({ theme }) => theme.colors.tertiary};
  }
`;

const SwitchWrapper = styled.div`
  display: flex;
  margin-top: 8px;
  margin-bottom: 8px;
  justify-content: space-between;
  align-items: center;

  div {
    display: flex;
    align-items: center;
    font-size: ${({ theme }) => theme.fontSizes.xsmall};
    button {
      margin-left: 5px;
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

    :nth-of-type(1) {
      background-color: ${({ theme }) => theme.colors.gray};
    }
    :nth-of-type(2) {
      background-color: ${({ theme }) => theme.colors.primary};
    }
  }
`;

const AlertDialogActionStyled = styled(AlertDialogAction)`
  background-color: ${({ theme }) => theme.colors.primary};

  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
  }
`;

const AlertDialogCancelStyled = styled(AlertDialogCancel)`
  background-color: ${({ theme }) => theme.colors.brightGray};

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray};
  }
`;

export default EditMyPage;
