import { ContentWrapper, NoFooterLayout } from '@/styles/CommonStyles';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import { useSpecialtyStore } from '@/store/useSpecialtyStore';
import { useMemberStore } from '@/store/useMemberStore';
import { mapDrinkType } from '@/data/drinkTypes';
import ExProfileImg from '@/assets/ExProfileImg';
import styled from '@emotion/styled';
import CustomAlert from '@/components/layout/CustomAlert';
import WithDraw from './WithDraw';
import { fetchMemberWriteApi } from '@/api/postApi';

interface EditMyPageProps {
  showAlert: (type: 'success' | 'error', message: string) => void;
}

const EditMyPage = ({ showAlert }: EditMyPageProps) => {
  /** 유저 정보 */
  const { currentUser, fetchMembers } = useMemberStore();

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  /** 상태값 관리 */
  const [id] = useState(currentUser?.id || null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [alarmEnabled, setAlarmEnabled] = useState<boolean>(currentUser?.alarmEnabled || false);
  const [name, setName] = useState(currentUser?.name || '');
  const [currentPassword, setcurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  /** alert 및 알람 관리 */
  const [isAgreeChecked, setIsAgreeChecked] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [saveAlertVisible, setSaveAlertVisible] = useState(false);

  /** 유효성 검사 */
  const [passwordError, setPasswordError] = useState<string>('');
  const [isCurrentPasswordValid, setIsCurrentPasswordValid] = useState<boolean>(false);
  const [isNameValid, setIsNameValid] = useState(true);
  const [isNewPasswordValid, setIsNewPasswordValid] = useState(true);
  const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(true);

  const navigate = useNavigate();

  /** 알림 수신 동의 */
  const { isNotificationChecked, toggleNotification } = useMemberStore();
  const notificationToggle = () => {
    setAlarmEnabled(!alarmEnabled);
    toggleNotification();
  };
  console.log(isNotificationChecked);

  /** 위치정보 제공 동의 */
  const agreeToggle = () => {
    setIsAgreeChecked(!isAgreeChecked);
  };

  /** 사용자 닉네임 변경 */
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
    }
  }, [currentUser]);

  /** 유효성 검사 */
  /** 닉네임 */
  const validateName = (name: string) => {
    return name.length >= 2 && name.length <= 7;
  };

  /** 현재 패스워드 */
  const validateCurrentPassword = () => {
    if (currentUser && currentPassword !== currentUser.currentPassword) {
      setPasswordError('기존 패스워드와 일치하지 않습니다.');
      setIsCurrentPasswordValid(false);
    } else {
      setPasswordError('');
      setIsCurrentPasswordValid(true);
    }
  };

  /** 신규 패스워드 */
  const validateNewPassword = (password: string) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,15}$/;
    return regex.test(password);
  };

  /** 신규 패스워드 일치 */
  const validatePasswordsMatch = (newPassword: string, confirmPassword: string) => {
    return newPassword === confirmPassword;
  };

  useEffect(() => {
    setIsNameValid(validateName(name));
    setIsNewPasswordValid(validateNewPassword(newPassword));
    setIsConfirmPasswordValid(validatePasswordsMatch(newPassword, confirmPassword));
  }, [name, newPassword, confirmPassword]);

  /** 선호주종 목데이터 import 및 선호주종 변경 적용 */
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

  /** 선호주종 5개 제한 */
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

  /** 사용자 프로필 이미지 변경 적용 */
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

  /** 저장 */
  const handleSave = async () => {
    // 저장 가능 조건
    const canSave =
      isNameValid &&
      (isCurrentPasswordValid || currentPassword.trim() === '') &&
      (newPassword.trim() === '' || isNewPasswordValid) &&
      (confirmPassword.trim() === '' || isConfirmPasswordValid) &&
      (newPassword.trim() === '' || confirmPassword === newPassword);

    if (canSave) {
      if (id !== null) {
        try {
          const response = await fetchMemberWriteApi(id, name, selectedDrinks, alarmEnabled);
          if (response) {
            navigate('/mypage');
          } else {
            setSaveAlertVisible(true);
            setTimeout(() => setSaveAlertVisible(false), 3000);
          }
        } catch (error) {
          console.error('Error saving member info:', error);
          setSaveAlertVisible(true);
          setTimeout(() => setSaveAlertVisible(false), 3000);
        }
      }
    } else {
      // 오류 메시지 처리
      if (!isNameValid) {
        showAlert('error', '닉네임은 2~7자로 입력해주세요.');
      }
      if (currentPassword.trim() !== '' && !isCurrentPasswordValid) {
        showAlert('error', '기존 패스워드가 일치하지 않습니다.');
      }
      if (newPassword.trim() !== '' && !isNewPasswordValid) {
        showAlert('error', '신규 패스워드는 8~15자로 대소문자, 숫자, 특수문자를 포함해야 합니다.');
      }
      if (confirmPassword.trim() == '') {
        showAlert('error', '확인 패스워드를 입력해주세요.');
      }
      if (confirmPassword.trim() !== '' && !isConfirmPasswordValid) {
        showAlert('error', '신규 패스워드와 확인 패스워드가 일치하지 않습니다.');
      }
    }
  };

  return (
    <NoFooterLayout>
      <ContentWrapper>
        <EditTop>
          <b>회원정보 수정</b>
          <ImgWrapper onClick={() => document.getElementById('profileImageInput')?.click()}>
            {profileImage ? (
              <img src={profileImage} alt="Profile" />
            ) : (
              <ExProfileImg /> // 기본 이미지
            )}
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
            {!isNameValid && <Validation>※2~7자로 해주세요.</Validation>}
          </Label>
          <Input
            type="name"
            placeholder={currentUser ? currentUser.name : '로딩 중...'}
            name="name"
            id="name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <Label htmlFor="currentPassword">기존 패스워드</Label>
          <Input
            type="password"
            id="currentPassword"
            value={currentPassword}
            onChange={e => setcurrentPassword(e.target.value)}
            onBlur={validateCurrentPassword}
          />
          {passwordError && <AlertText>{passwordError}</AlertText>}
          <Label htmlFor="newPassword">신규 패스워드</Label>
          <Input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            disabled={!isCurrentPasswordValid}
          />
          {!isNewPasswordValid && (
            <AlertText>※8~15자로 대소문자, 숫자, 특수문자를 포함해야 합니다.</AlertText>
          )}
          <Label htmlFor="confirmPassword">신규 패스워드 확인</Label>
          <Input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            disabled={!isCurrentPasswordValid}
          />
          {!isConfirmPasswordValid && <AlertText>비밀번호가 일치하지 않습니다.</AlertText>}
          <Label htmlFor="">선호주종</Label>
          {alertVisible && (
            <CustomAlert
              type="error"
              message="최대 5개의 주종만 선택할 수 있습니다."
              onClose={() => setAlertVisible(false)}
            />
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
              {isNotificationChecked ? 'ON' : 'OFF'}
              <Switch checked={isNotificationChecked} onClick={notificationToggle} />
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
        <WithDraw showAlert={showAlert} />
        <ConfirmWrapper>
          <Button onClick={() => navigate('/mypage')}>취소</Button>
          <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button>저장</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitleStyled>회원 정보 수정 확인</AlertDialogTitleStyled>
                <AlertDialogDescription>
                  회원정보 수정사항을 저장하시겠습니까?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancelStyled onClick={() => setIsDialogOpen(false)}>
                  취소
                </AlertDialogCancelStyled>
                <AlertDialogActionSuccess onClick={handleSave}>저장</AlertDialogActionSuccess>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          {saveAlertVisible && (
            <CustomAlert
              type="error"
              message="새 비밀번호와 확인 비밀번호가 일치하지 않습니다."
              onClose={() => setSaveAlertVisible(false)}
            />
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

  b {
    color: ${({ theme }) => theme.colors.black};
    font-size: ${({ theme }) => theme.fontSizes.medium};
    font-weight: bold;
    padding-bottom: 20px;
  }
`;

const AlertText = styled.p`
  margin-top: -7px;
  height: 11px;
  line-height: 11px;
  font-size: ${({ theme }) => theme.fontSizes.xsmall};
  color: ${({ theme }) => theme.colors.error};
`;

const Validation = styled.span`
  margin-left: 4px;
  font-size: ${({ theme }) => theme.fontSizes.xsmall};
  color: ${({ theme }) => theme.colors.error};
`;

const ImgWrapper = styled.div`
  display: flex;
  position: relative;
  height: 100px;
  margin-bottom: 20px;
  justify-content: center;
  align-items: flex-end;

  svg {
    position: absolute;
    width: 100px;
    height: 100px;
    border: 1px solid ${({ theme }) => theme.colors.lightGray};
    border-radius: 50%;
  }
`;

const EditMid = styled.ul`
  margin-bottom: 20px;

  input {
    margin-bottom: 10px;
    background-color: ${({ theme }) => theme.colors.brightGray};

    :focus {
      box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.focusShadowGray};
    }

    ::placeholder {
      color: ${({ theme }) => theme.colors.darkGray};
      opacity: 1;
    }
  }
`;

const Label = styled.label`
  margin-top: 5px;
  color: ${({ theme }) => theme.colors.black};
  font-size: ${({ theme }) => theme.fontSizes.xsmall};

  :not(:first-of-type)::before {
    content: '*';
    margin-right: 3px;
    color: ${({ theme }) => theme.colors.point};
  }
`;

interface AlcoholItemProps {
  isSelected: boolean;
}

const AlcoholList = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
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
    isSelected ? theme.colors.tertiary : theme.colors.brightGray};
  color: ${({ theme }) => theme.colors.darkGray};
  border-radius: 10px;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: ${({ theme }) => theme.fontSizes.small};
  cursor: pointer;
`;

const EditBottom = styled.div`
  span {
    font-size: ${({ theme }) => theme.fontSizes.xsmall};
  }

  label::before {
    content: '* ';
    margin-right: 3px;
    color: ${({ theme }) => theme.colors.tertiary};
  }
`;

const SwitchWrapper = styled.div`
  display: flex;
  margin-bottom: 8px;
  justify-content: space-between;
  align-items: center;

  span {
    color: ${({ theme }) => theme.colors.black};
    font-size: ${({ theme }) => theme.fontSizes.small};
  }

  div {
    display: flex;
    align-items: center;
    color: ${({ theme }) => theme.colors.black};
    font-size: ${({ theme }) => theme.fontSizes.xsmall};
    button {
      margin-left: 5px;
      margin-right: 2px;
    }
  }

  button[data-state='checked'] {
    background-color: ${({ theme }) => theme.colors.primary};
  }
`;

const ConfirmWrapper = styled.div`
  display: flex;
  margin-top: 30px;
  justify-content: space-between;

  button {
    width: 48%;
    height: 45px;
    font-size: ${({ theme }) => theme.fontSizes.base};
    border-radius: 30px;
    color: ${({ theme }) => theme.colors.white};

    :nth-of-type(1) {
      background-color: ${({ theme }) => theme.colors.lightGray};
      color: ${({ theme }) => theme.colors.darkGray};
    }
    :nth-of-type(2) {
      background-color: ${({ theme }) => theme.colors.primary};
    }
  }
`;

const AlertDialogTitleStyled = styled(AlertDialogTitle)`
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
`;

const AlertDialogActionSuccess = styled(AlertDialogAction)`
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
