import { ContentWrapper, NoFooterLayout } from '@/styles/CommonStyles';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Switch } from '@/components/ui/switch';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChevronsUpDown } from 'lucide-react';
import styled from '@emotion/styled';

import ExProfileImg from '@/assets/ExProfileImg';
import SettingIcon from '@/assets/icons/SettingIcon';
import { useSpecialtyStore } from '@/store/useSpecialtyStore';

const EditMyPage = () => {
  const [password, setpassword] = useState('');
  const [currentPassword, setcurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedAlcohols, setSelectedAlcohols] = useState<string[]>([]);
  const [isChecked, setIsChecked] = useState(false);

  const isMatch = password === confirmPassword && password !== '';

  const handleToggle = () => {
    setIsChecked(!isChecked); // 현재 상태의 반대로 설정
  };

  const handleSelect = (alcohol: string) => {
    if (selectedAlcohols.includes(alcohol)) {
      setSelectedAlcohols(selectedAlcohols.filter(item => item !== alcohol));
    } else {
      setSelectedAlcohols([...selectedAlcohols, alcohol]);
    }
  };
  useEffect(() => {
    console.log(selectedAlcohols);
  }, [selectedAlcohols]);

  const alcohols: string[] = [
    '소주',
    '맥주',
    '양주',
    '막걸리',
    '동동주',
    '청주',
    '약주',
    '과실주',
    '리큐르',
    '증류주',
    '고량주',
    '민속주',
    '위스키',
    '브랜디',
    '럼주',
    '진',
    '보드카',
    '데킬라',
    '와인',
    '샴페인',
    '사케',
    '기타',
  ];

  const frameworks = [
    {
      value: '서울특별시',
      label: '서울특별시',
    },
    {
      value: '부산광역시',
      label: '부산광역시',
    },
    {
      value: '경기도',
      label: '경기도',
    },
  ];

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');

  const { alldrinks, selectedDrinks, fetchDrinks, toggleDrinkSelection, setSelectedDrinks } =
    useSpecialtyStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDrinks();
    console.log(selectedDrinks);
  }, [fetchDrinks]);

  const handleSave = () => {
    setSelectedDrinks(selectedDrinks);
    navigate('/mypage');
  };

  return (
    <NoFooterLayout>
      <ContentWrapper>
        <EditTop>
          <span>회원정보 수정</span>
          <ImgWrapper>
            <ExProfileImg />
            <SettingIcon />
          </ImgWrapper>
        </EditTop>
        <EditMid>
          <Label htmlFor="email">아이디(이메일)</Label>
          <Input type="email" disabled />
          <Label htmlFor="name">닉네임(이름)</Label>
          <Input type="name" />
          <Label htmlFor="currentPassword">기존 패스워드</Label>
          <Input type="password" id="currentPassword" />
          {password && currentPassword && !isMatch && (
            <p style={{ color: 'red', fontSize: '14px' }}>기존 패스워드와 일치하지 않습니다.</p>
          )}
          <Label htmlFor="newPassword">신규 패스워드</Label>
          <Input type="password" id="newPassword" disabled={!isMatch} />
          <Label htmlFor="confirmPassword">신규 패스워드 확인</Label>
          <Input type="password" id="confirmPassword" disabled={!isMatch} />
          {newPassword && confirmPassword && !isMatch && (
            <p style={{ color: 'red', fontSize: '14px' }}>비밀번호가 일치하지 않습니다.</p>
          )}
          <Label htmlFor="email">지역</Label>
          <ComboboxWrapper>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  {value
                    ? frameworks.find(framework => framework.value === value)?.label
                    : '지역을 선택하세요'}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput placeholder="Search framework..." />
                  <CommandList>
                    <CommandEmpty>No framework found.</CommandEmpty>
                    <CommandGroup>
                      {frameworks.map(framework => (
                        <CommandItem
                          key={framework.value}
                          value={framework.value}
                          onSelect={currentValue => {
                            setValue(currentValue === value ? '' : currentValue);
                            setOpen(false);
                          }}
                        >
                          {framework.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </ComboboxWrapper>
          <Label htmlFor="">선호주종</Label>
          <AlcoholList>
            {alldrinks.map(drink => (
              <AlcoholItem
                key={drink}
                isSelected={selectedDrinks.includes(drink)}
                onClick={() => toggleDrinkSelection(drink)}
              >
                {drink}
              </AlcoholItem>
            ))}
          </AlcoholList>
        </EditMid>
        <EditBottom>
          <Label htmlFor="">알림 On/Off</Label>
          <SwitchWrapper>
            <span>* 나의 게시글에 대한 댓글 알림</span>
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
  }

  svg:nth-child(2) {
    position: absolute;
    width: 35px;
    height: 35px;
    bottom: 2px;
    left: 25px;
  }
`;

const EditMid = styled.ul`
  margin-bottom: 16px;

  input {
    margin-bottom: 8px;
    background-color: ${({ theme }) => theme.colors.lightGray};
  }
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.fontSizes.xsmall};
`;

const ComboboxWrapper = styled.div`
  display: flex;
  margin-bottom: 8px;

  button,
  button:hover {
    background-color: ${({ theme }) => theme.colors.lightGray};
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
