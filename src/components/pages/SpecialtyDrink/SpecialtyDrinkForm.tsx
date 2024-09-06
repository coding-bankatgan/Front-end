import { ContentWrapper, NoFooterLayout } from '@/styles/CommonStyles';
import { Link } from 'react-router-dom';
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
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const SpecialtyDrinkForm = () => {
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

  return (
    <NoFooterLayoutSub>
      <ContentWrapper>
        <TitleStyled>특산주 등록하기</TitleStyled>
        <FormHeaderStyled>
          <img src="https://picsum.photos/seed/picsum/355/255" alt="주류 이름" />
        </FormHeaderStyled>
        <FormContentStyled>
          <Label htmlFor="text">특산주 이름</Label>
          <Input type="text" />
          <Label htmlFor="text">지역</Label>
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
          <Label htmlFor="text">특산주 정보</Label>
          <TextareaStyled
            placeholder="특산주의 정보를 입력해주세요
ex.당도, 도수, 가격 etc"
          />
        </FormContentStyled>
        <FormBottomStyled>
          <Link to="/specialty-drink">
            <Button>취소</Button>
          </Link>
          <Link to="/specialty-drink/:id">
            <Button>등록</Button>
          </Link>
        </FormBottomStyled>
      </ContentWrapper>
    </NoFooterLayoutSub>
  );
};

const NoFooterLayoutSub = styled(NoFooterLayout)`
  align-items: flex-start;
`;

const TitleStyled = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.medium};
  margin-bottom: 10px;
`;

const FormHeaderStyled = styled.div`
  max-height: 250px;
  margin-bottom: 10px;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.colors.lightGray};
  overflow: hidden;
`;

const FormContentStyled = styled.div`
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

const TextareaStyled = styled(Textarea)`
  height: 150px;
  background-color: ${({ theme }) => theme.colors.lightGray};
`;

const FormBottomStyled = styled.div`
  display: flex;
  margin-top: 40px;
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

export default SpecialtyDrinkForm;
