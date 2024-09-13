import { ContentWrapper, NoFooterLayout } from '@/styles/CommonStyles';
import { Button } from '@/components/ui/button';
import { useRef, useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useRegionStore } from '@/store/useRegionStore';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import PlusIcon from '@/assets/icons/PlusIcon';
import useRegistrationStore from '@/store/useRegistrationStore';

const SpecialtyDrinkForm = () => {
  //** registration 등록 */
  const [img, setImg] = useState<File | null>(null);
  const [name, setName] = useState<string>('');
  const [region, setRegion] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [type, setType] = useState<string>('소주');
  const [degree, setDegree] = useState<number>(0);
  const [sweetness, setSweetness] = useState<number>(0);
  const [cost, setCost] = useState<number>(0);

  const addRegistration = useRegistrationStore(state => state.addRegistration);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('aaaaaaaaa');

    if (name && region && content) {
      //**  실제 구현에서는 서버에 업로드 후 URL 사용  */
      // const imgUrl = img ? URL.createObjectURL(img) : '';
      const imgUrl = 'https://thesool.com/common/imageView.do?targetId=PR00000697&targetNm=PRODUCT';

      const newRegistration = {
        imageUrl: imgUrl,
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
      console.log('bbbbbbb', registId);

      // 등록 후 해당 등록 페이지로 이동 (id는 여기서 가상으로 1로 설정)
      navigate(`/specialty-drink/${registId}`, { state: newRegistration });
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
  const { allRegions, fetchRegions } = useRegionStore();
  useEffect(() => {
    fetchRegions();
  }, [fetchRegions]);

  return (
    <NoFooterLayoutSub>
      <ContentWrapper as="form" onSubmit={handleSubmit}>
        <TitleStyled>특산주 등록하기</TitleStyled>
        <FormHeaderStyled>
          {/* <input type="file" accept="image/*" ref={fileInputRef} /> */}
          {/* <img src="https://thesool.com/common/imageView.do?targetId=PR00000697&targetNm=PRODUCT" /> */}
          <Button onClick={handleBtnClick}>
            <PlusIcon />
          </Button>
        </FormHeaderStyled>
        <FormContentStyled>
          <Label htmlFor="text">특산주 이름</Label>
          <Input type="text" value={name} onChange={e => setName(e.target.value)} required />
          <Label htmlFor="text">지역</Label>
          <SelectStyled value={region} onChange={e => setRegion(e.target.value)}>
            <option value="">지역 선택</option>
            {allRegions.map((regionItem, index) => (
              <option key={index} value={regionItem}>
                {regionItem}
              </option>
            ))}
          </SelectStyled>
          <Label htmlFor="text">특산주 정보</Label>
          <TextareaStyled
            placeholder="특산주의 정보를 입력해주세요
ex.당도, 도수, 가격 etc"
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
`;

const TitleStyled = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.medium};
  margin-bottom: 10px;
`;

const FormHeaderStyled = styled.div`
  min-width: 316px;
  width: auto;
  height: 316px;
  display: flex;
  margin-bottom: 8px;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.brightGray};

  input {
    display: none;
  }

  button {
    background-color: ${({ theme }) => theme.colors.gray};
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
    margin-bottom: 8px;
    background-color: ${({ theme }) => theme.colors.lightGray};
  }

  > input, textarea {
    &:focus {
      border-color: ${({ theme }) => theme.colors.focusShadow};
      box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.focusShadow};
    }
  }
v
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.fontSizes.xsmall};

  ::before {
    content: '* ';
    color: ${({ theme }) => theme.colors.tertiary};
  }
`;

const SelectStyled = styled.select`
  display: flex;
  width: 100px;
  height: 35px;
  margin-bottom: 8px;
  font-size: ${({ theme }) => theme.fontSizes.base};
  border: 1px solid ${({ theme }) => theme.colors.lightGray};
  border-radius: 5px;

  &:focus,
  &:active {
    border-color: ${({ theme }) => theme.colors.focusShadow};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.focusShadow};
    outline: none;
  }
`;

const TextareaStyled = styled(Textarea)`
  height: 150px;
  background-color: ${({ theme }) => theme.colors.lightGray};
  resize: none;
`;

const FormBottomStyled = styled.div`
  display: flex;
  margin-top: 40px;
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

export default SpecialtyDrinkForm;
