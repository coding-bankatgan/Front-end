import styled from '@emotion/styled';
import MapPinIcon from '../../../assets/icons/MapPinIcon';

const Daily = () => {
  return (
    <DailySection>
      <DailyTop>
        <strong>오늘의 데일리 추천이에요.</strong>
        <span>
          OO도 OO시 <MapPinIcon />
        </span>
      </DailyTop>
      <DailyDesc>현재 위치 기반으로 특산주를 추천해드려요 :D</DailyDesc>
      <DailyBottom>
        <Img>
          <img src="https://picsum.photos/seed/picsum/50/60" alt="주류 이름" />
        </Img>
        <ImgDesc>
          <b>주류 이름</b>
          <span>종류 / 맛 / 도수 / 가격 정보</span>
        </ImgDesc>
      </DailyBottom>
    </DailySection>
  );
};

const DailySection = styled.section`
  width: 100%;
  height: auto;
  padding: 10px 15px;
  background: ${({ theme }) => theme.colors.white};
  border-radius: 10px;
  box-shadow:
    rgba(17, 17, 26, 0.05) 0px 1px 0px,
    rgba(17, 17, 26, 0.05) 0px 0px 8px;
`;

const DailyTop = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: -5px;
  color: ${({ theme }) => theme.colors.black};

  strong {
    font-size: ${({ theme }) => theme.fontSizes.base};
  }

  span {
    display: flex;
    align-items: center;
    color: ${({ theme }) => theme.colors.darkGray};
    font-size: ${({ theme }) => theme.fontSizes.xsmall};

    svg {
      width: 16px;
      height: 16px;
    }
  }
`;

const DailyDesc = styled.span`
  color: ${({ theme }) => theme.colors.gray};
  font-size: ${({ theme }) => theme.fontSizes.xsmall};
`;

const DailyBottom = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  margin-top: 10px;
`;

const Img = styled.div`
  margin-right: 10px;
  border-radius: 10px;
  overflow: hidden;
`;

const ImgDesc = styled.span`
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  b {
    font-size: ${({ theme }) => theme.fontSizes.base};
  }

  span {
    font-size: ${({ theme }) => theme.fontSizes.xsmall};
  }
`;

export default Daily;
