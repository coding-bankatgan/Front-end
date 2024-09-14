import styled from '@emotion/styled';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import PlusIcon from '@/assets/icons/PlusIcon';
import { Textarea } from '@/components/ui/textarea';
import { useRef } from 'react';

interface PostStep3Props {
  prevStep: () => void;
  nextStep: () => void;
}

const PostStep3 = ({ nextStep }: PostStep3Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBtnClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <>
      <PostTitle>
        <span>리뷰</span>특산주 이름
      </PostTitle>
      <PostContent>
        <ImgSelect>
          <input type="file" accept="image/*" ref={fileInputRef} />
          <Button onClick={handleBtnClick}>
            <PlusIcon />
          </Button>
        </ImgSelect>
        <div>
          <Label htmlFor="alcoholType">주종</Label>
          <Input type="text" id="alcoholType" placeholder="선택한 주종 데이터 받아오기" disabled />
        </div>
        <div>
          <Label htmlFor="degree">도수</Label>
          <Input type="text" id="degree" placeholder="선택한 도수 데이터 받아오기" disabled />
        </div>
        <div>
          <Label htmlFor="sweetness">당도</Label>
          <div id="sweetness">FE&BE 상의 후 결정</div>
        </div>
        <div>
          <Label htmlFor="rating">평점</Label>
          <StarWrapper id="rating">별점 라이브러리 추가 예정</StarWrapper>
        </div>
        <Textarea placeholder="포스팅 내용을 작성해주세요." />
      </PostContent>
      <ButtonStyled onClick={nextStep}>완료</ButtonStyled>
    </>
  );
};

const PostTitle = styled.b`
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  font-size: ${({ theme }) => theme.fontSizes.medium};

  span {
    display: inline-block;
    margin-right: 5px;
    padding: 2px 10px;
    background-color: ${({ theme }) => theme.colors.secondary};
    color: ${({ theme }) => theme.colors.white};
    font-size: ${({ theme }) => theme.fontSizes.base};
    font-weight: normal;
    border-radius: 20px;
  }
`;

const ImgSelect = styled.div`
  min-width: 316px;
  width: auto;
  height: 316px;
  display: flex;
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

const PostContent = styled.section`
  img {
    min-width: 316px;
    width: auto;
    min-height: 316px;
    height: auto;
  }

  > div {
    display: flex;
    align-items: center;
    margin-bottom: 10px;

    div {
      width: 100%;
      min-height: 100px;
      background-color: ${({ theme }) => theme.colors.brightGray};
      border-radius: 5px;
    }
  }

  label {
    width: 30px;
    margin-right: 10px;
  }

  input {
    width: 100%;
    background-color: ${({ theme }) => theme.colors.brightGray};
    color: ${({ theme }) => theme.colors.darkGray};
    border: 1px solid ${({ theme }) => theme.colors.gray};

    &:focus {
      box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.focusShadow};
    }

    &::placeholder {
      color: ${({ theme }) => theme.colors.black};
    }
  }

  textarea {
    min-height: 200px;
    height: auto;
    background-color: ${({ theme }) => theme.colors.brightGray};
    resize: none;

    &:focus {
      box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.focusShadow};
    }
  }
`;

const StarWrapper = styled.div``;

const ButtonStyled = styled(Button)`
  width: 100%;
  height: 45px;
  margin-top: 30px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.fontSizes.small};
  border-radius: 30px;

  &:active,
  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
  }
`;

export default PostStep3;
