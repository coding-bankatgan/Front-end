import { useLocation } from 'react-router-dom';
import styled from '@emotion/styled';
import { Textarea } from '@/components/ui/textarea';
import { mapDrinkType } from '@/data/drinkTypes';

const DrinkPage = () => {
  const location = useLocation();
  const { drinkData } = location.state || {};

  return (
    <DrinkDetailLayout>
      <HeaderStyled>
        <h1>{drinkData?.name}</h1>
      </HeaderStyled>
      <ImgStyled>
        <img src={drinkData?.imageUrl} alt={drinkData?.name} />
      </ImgStyled>
      <ContentStyled>
        <DrinkInfo>
          <div>
            <Label htmlFor="text">종류</Label>
            <span>{mapDrinkType(drinkData?.type || '')}</span>
          </div>
          <div style={{ width: '150px' }}>
            <Label htmlFor="text">지역</Label>
            <span>{drinkData?.placeName}</span>
          </div>
        </DrinkInfo>
        <DrinkInfo>
          <div>
            <Label htmlFor="text">가격</Label>
            <span>{drinkData?.cost.toLocaleString()}원</span>
          </div>
          <div>
            <Label htmlFor="text">당도</Label>
            <span>{drinkData?.sweetness}</span>
          </div>
          <div>
            <Label htmlFor="text">도수</Label>
            <span>{drinkData?.degree}%</span>
          </div>
        </DrinkInfo>
        <Label htmlFor="text">특산주 정보</Label>
        <TextareaStyled value={drinkData?.description} readOnly />
      </ContentStyled>
    </DrinkDetailLayout>
  );
};

const DrinkDetailLayout = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  height: auto;
  padding-top: 60px;
  background-color: ${({ theme }) => theme.colors.brightGray};
  color: ${({ theme }) => theme.colors.black};
`;

const HeaderStyled = styled.div`
  width: 100%;
  padding: 20px;
  background-color: ${({ theme }) => theme.colors.white};

  h1 {
    width: 100%;
    color: ${({ theme }) => theme.colors.black};
    font-size: ${({ theme }) => theme.fontSizes.medium};
    font-weight: bold;
  }
`;

const ImgStyled = styled.div`
  width: 100%;
  padding: 0 20px 20px 20px;
  background-color: ${({ theme }) => theme.colors.white};

  img {
    width: 100%;
    height: 316px;
    object-fit: contain;
    border: 1px solid ${({ theme }) => theme.colors.lightGray};
    border-radius: 10px;
    overflow: hidden;
  }
`;

const ContentStyled = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
  padding: 0 20px 20px 20px;
  background-color: ${({ theme }) => theme.colors.white};

  span {
    margin-right: 20px;
  }
`;

const DrinkInfo = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  width: 100%;

  span {
    margin-bottom: 16px;
    font-size: ${({ theme }) => theme.fontSizes.small};
  }

  div {
    display: flex;
    width: 100px;
    margin-right: 10px;
    flex-direction: column;
  }
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.fontSizes.small};
  font-weight: bold;
  margin-right: 10px;
`;

const TextareaStyled = styled(Textarea)`
  min-height: 180px;
  height: auto;
  margin-top: 5px;
  margin-bottom: 70px;
  background-color: ${({ theme }) => theme.colors.clearGray};
  border: 1px solid ${({ theme }) => theme.colors.brightGray};
  font-size: ${({ theme }) => theme.fontSizes.small};
  resize: none;

  &:focus {
    box-shadow: none;
  }
`;

export default DrinkPage;
