import { ContentWrapper, NoFooterLayout } from '@/styles/CommonStyles';
import { Button } from '@/components/ui/button';
import { useRef, useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useRegionStore } from '@/store/useRegionStore';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import PlusIcon from '@/assets/icons/PlusIcon';
import useRegistrationStore from '@/store/useRegistrationStore';
// import { fetchImageUploadApi } from '@/api/postApi';

interface SpecialtyDrinkFormProps {
  showAlert: (type: 'success' | 'error', message: string) => void;
}

const sweetnessDescriptions: { [key: string]: string } = {
  1: '1단계 초건조: 거의 단 맛을 느낄 수 없음',
  2: '2단계 아주 건조: 극히 미세한 단 맛을 지닌 건조한 맛',
  3: '3단계 건조: 단 맛이 거의 느껴지지 않는 스탠다드 드라이',
  4: '4단계 약간 달콤: 미세한 단 맛이 있지만 전반적으로는 건조한 느낌',
  5: '5단계 반건조: 단 맛이 뚜렷하지만 산미와 조화를 이루는 단계',
  6: '6단계 중간 달콤: 단 맛이 확실히 느껴지며 산도와 함께 균형을 이룸',
  7: '7단계 달콤: 눈에 띄는 단 맛이 있음',
  8: '8단계 아주 달콤: 농축된 단 맛이 강하게 느껴지는 수준',
  9: '9단계 디저트 와인 수준: 디저트 주류에 가까운 매우 달콤한 맛',
  10: '10단계 풍부하게 달콤: 이상 매우 진하고 강한 단 맛',
};

const SpecialtyDrinkForm = ({ showAlert }: SpecialtyDrinkFormProps) => {
  //** registration 등록 */
  const [_, setImg] = useState<File | null>(null);
  const [name, setName] = useState<string>('');
  const [region, setRegion] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [type, setType] = useState<string>('');
  const [degree, setDegree] = useState<number | undefined>(undefined);
  const [sweetness, setSweetness] = useState<number>(1);
  const [cost, setCost] = useState<number | undefined>(undefined);

  const addRegistration = useRegistrationStore(state => state.addRegistration);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !name ||
      !region ||
      !content ||
      !type ||
      degree === undefined ||
      sweetness === undefined ||
      cost === undefined
    ) {
      showAlert('error', '모든 정보를 입력해주세요.');
      return;
    }

    try {
      // let imageUrl = '';
      // if (img) {
      //   // 이미지 업로드
      //   const imageResponse = await fetchImageUploadApi(img);
      //   imageUrl = imageResponse.imageUrl; // 이미지 업로드 후 반환된 URL 사용
      // }
      // console.log(imageUrl);

      const newRegistration = {
        imageUrl: 'https://thesool.com/common/imageView.do?targetId=PR00000697&targetNm=PRODUCT',
        placeName: region,
        drinkName: name,
        description: content,
        type,
        degree,
        sweetness,
        cost,
        approved: null,
      };

      const registId = addRegistration(newRegistration);
      navigate(`/specialty-drink/${registId}`, { state: newRegistration });
    } catch (error) {
      console.error('등록 중 오류 발생:', error);
    }
  };

  //** 이미지 업로드 */
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleBtnClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  //** 지역 목데이터 import 및 지역 변경 적용 */
  const { regions, fetchRegions } = useRegionStore();
  useEffect(() => {
    fetchRegions();
  }, [fetchRegions]);

  return (
    <NoFooterLayoutSub>
      <ContentWrapper as="form" onSubmit={handleSubmit}>
        <TitleStyled>특산주 등록하기</TitleStyled>
        <FormHeaderStyled>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={e => setImg(e.target.files?.[0] || null)}
            style={{ display: 'none' }}
          />
          {/* <img src="https://thesool.com/common/imageView.do?targetId=PR00000697&targetNm=PRODUCT" /> */}
          <Button onClick={handleBtnClick}>
            <PlusIcon />
          </Button>
        </FormHeaderStyled>
        <FormContentStyled>
          <Label htmlFor="text">특산주 이름</Label>
          <Input type="text" value={name} onChange={e => setName(e.target.value)} />
          <Label htmlFor="text">지역</Label>
          <SelectStyled value={region} onChange={e => setRegion(e.target.value)}>
            <option value="">지역 선택</option>
            {regions.map((regionItem, index) => (
              <option key={index} value={regionItem.placeName}>
                {regionItem.placeName}
              </option>
            ))}
          </SelectStyled>
          <Label>종류</Label>
          <Input type="text" value={type} onChange={e => setType(e.target.value)} />
          <Label>도수</Label>
          <Input type="number" value={degree} onChange={e => setDegree(Number(e.target.value))} />
          <Label>
            당도
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span style={{ cursor: 'pointer', marginLeft: '4px' }}>ⓘ</span>
                </TooltipTrigger>
                <TooltipContent side="right">{sweetnessDescriptions[sweetness]}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Label>
          <SliderContainer>
            <CustomSlider
              defaultValue={[sweetness ?? 1]}
              min={1}
              max={10}
              step={1}
              onValueChange={value => setSweetness(value[0])}
            />
            <SliderValue>{sweetness}</SliderValue>
          </SliderContainer>
          <Label>가격</Label>
          <Input type="number" value={cost} onChange={e => setCost(Number(e.target.value))} />
          <Label htmlFor="text">특산주 정보</Label>
          <TextareaStyled
            placeholder="특산주에 대해 설명해주세요"
            value={content}
            onChange={e => setContent(e.target.value)}
          />
        </FormContentStyled>
        <FormBottomStyled>
          <Button onClick={() => navigate('/specialty-drink')}>취소</Button>
          <Button type="submit">등록</Button>
        </FormBottomStyled>
      </ContentWrapper>
    </NoFooterLayoutSub>
  );
};

const NoFooterLayoutSub = styled(NoFooterLayout)`
  align-items: flex-start;
  color: ${({ theme }) => theme.colors.black};
`;

const TitleStyled = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.medium};
  font-weight: bold;
  margin-bottom: 20px;
`;

const FormHeaderStyled = styled.div`
  min-width: 316px;
  width: auto;
  height: 316px;
  display: flex;
  margin-bottom: 8px;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.lightGray};
  border-radius: 10px;

  input {
    display: none;
  }

  button {
    background-color: ${({ theme }) => theme.colors.tertiary};
    color: ${({ theme }) => theme.colors.white};
    width: 50px;
    height: 50px;
    padding: 0;
    border-radius: 30px;

    &:hover {
      background-color: ${({ theme }) => theme.colors.secondary};
    }
  }
`;

const FormContentStyled = styled.div`
  input {
    margin-bottom: 10px;
    background-color: ${({ theme }) => theme.colors.brightGray};
  }

  > input,
  textarea {
    &:focus {
      border-color: ${({ theme }) => theme.colors.focusShadowGray};
      box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.focusShadowGray};
    }
  }
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.fontSizes.xsmall};

  ::before {
    content: '*';
    margin-right: 3px;
    color: ${({ theme }) => theme.colors.point};
  }
`;

const SelectStyled = styled.select`
  display: flex;
  width: 130px;
  height: 35px;
  margin-bottom: 8px;
  font-size: ${({ theme }) => theme.fontSizes.small};
  border: 1px solid ${({ theme }) => theme.colors.lightGray};
  border-radius: 5px;

  &:focus,
  &:active {
    border-color: ${({ theme }) => theme.colors.focusShadowGray};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.focusShadowGray};
    outline: none;
  }
`;

const CustomSlider = styled(Slider)`
  span {
    span {
      background-color: ${({ theme }) => theme.colors.primary};
      &:focus,
      &:active {
        border-color: ${({ theme }) => theme.colors.focusShadowOrange};
        box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.focusShadowOrange};
        outline: none;
      }
    }
  }
`;

const SliderContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 15px 0;
`;

const SliderValue = styled.span`
  margin-left: 10px;
  font-size: ${({ theme }) => theme.fontSizes.small};
`;

const TextareaStyled = styled(Textarea)`
  height: 150px;
  background-color: ${({ theme }) => theme.colors.brightGray};
  resize: none;
`;

const FormBottomStyled = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 40px;

  button {
    width: 48%;
    height: 45px;
    color: ${({ theme }) => theme.colors.white};
    font-size: ${({ theme }) => theme.fontSizes.base};
    border-radius: 30px;

    :nth-of-type(1) {
      background-color: ${({ theme }) => theme.colors.lightGray};
      color: ${({ theme }) => theme.colors.darkGray};
    }

    :nth-of-type(2) {
      background-color: ${({ theme }) => theme.colors.primary};
    }
  }
`;

export default SpecialtyDrinkForm;
