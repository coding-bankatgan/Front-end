import styled from '@emotion/styled';
import MapPinIcon from '../../../assets/icons/MapPinIcon';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { getAddress } from '@/api/postApi';
import Loading from '@/assets/icons/Loading';
import { Skeleton } from '@/components/ui/skeleton';

const Daily = () => {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isVerification, setIsVerification] = useState<boolean | null>(null);
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [rotate, setRotate] = useState('false');
  const [imageLoading, setImageLoading] = useState(true);
  const [dailyData, setDailyData] = useState({
    drink_id: 0,
    name: '브라우저 권한을 확인해주세요!',
    place_name: '',
    image_url: '',
    lat: 0,
    lon: 0,
  });

  const handleRotate = () => {
    setRotate('true');
    setTimeout(() => setRotate('false'), 1000);
  };

  useEffect(() => {
    if (!localStorage.getItem('gpsVeri')) {
      localStorage.setItem('gpsVeri', 'off');
    } else if (localStorage.getItem('gpsVeri') === 'off') {
      setIsVerification(false);
    } else if (localStorage.getItem('gpsVeri') === 'on') {
      setIsVerification(true);
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          position => {
            setLatitude(position.coords.latitude);
            setLongitude(position.coords.longitude);
          },
          err => {
            setError(err.message);
          },
        );
        if (latitude !== null && longitude !== null) {
          const date = async () => {
            const item = await axios.get(`api/suggest/drink?lat=${latitude}&lon=${longitude}`);
            setDailyData(item.data.answer);
            console.log(item.data.answer);
          };

          date();
        }
      } else {
        setError('해당 브라우저는 지원하지 않습니다.');
      }
    }
  }, [isVerification, rotate, latitude, longitude]);

  useEffect(() => {
    const fetchAddress = async () => {
      if (latitude && longitude) {
        const address = await getAddress(latitude, longitude);
        setUserAddress(`${address.split(' ')[0]} ${address.split(' ')[1]}`);
        console.log(userAddress);
      }
    };

    fetchAddress();
  }, [latitude, longitude]);
  return (
    <DailySection>
      <DailyTop>
        <strong>오늘의 데일리 추천이에요.</strong>
        <span>
          {userAddress} <MapPinIcon />
        </span>
      </DailyTop>
      <DailyDesc>{!error ? '현재 위치 기반으로 특산주를 추천해드려요 :D' : error}</DailyDesc>
      <DailyBottom>
        {!isVerification ? (
          <ValiText>
            위치정보 제공에 동의해주세요!
            <button
              onClick={() => {
                setIsVerification(true);
                localStorage.setItem('gpsVeri', 'on');
              }}
            >
              동의
            </button>
          </ValiText>
        ) : (
          <>
            <Img>
              {imageLoading && <Skeleton />}
              <img
                src={dailyData.image_url}
                alt={dailyData.name}
                onLoad={() => setImageLoading(false)}
              />
            </Img>
            <ImgDesc>
              <b>{dailyData.name}</b>
              <span>주종 / 당도 / 도수 / 가격 정보</span>
            </ImgDesc>
          </>
        )}
      </DailyBottom>
      <LoadingContainer
        rotate={rotate}
        onClick={() => {
          handleRotate();
        }}
      >
        <Loading />
      </LoadingContainer>
    </DailySection>
  );
};

const DailySection = styled.section`
  position: relative;
  width: 100%;
  height: auto;
  margin-bottom: 10px;
  padding: 20px;
  background: ${({ theme }) => theme.colors.white};
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
      color: ${({ theme }) => theme.colors.darkGray};
    }
  }
`;

const DailyDesc = styled.span`
  color: ${({ theme }) => theme.colors.gray};
  font-size: ${({ theme }) => theme.fontSizes.xsmall};
`;

const ValiText = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 70px;
  font-weight: bold;
  button {
    margin-top: 4px;
    padding: 2px 12px 2px 12px;
    background: ${({ theme }) => theme.colors.success};
    border-radius: 8px;
    color: ${({ theme }) => theme.colors.white};
  }
`;

const LoadingContainer = styled.div<{ rotate: boolean | string }>`
  position: absolute;
  right: 20px;
  bottom: 20px;
  width: 16px;
  height: 16px;
  color: ${({ theme }) => theme.colors.darkGray};
  cursor: pointer;
  transition: transform 1s ease;
  ${({ rotate }) =>
    rotate === 'true' &&
    `
  transform: rotate(360deg);
`}

  svg {
    width: 100%;
    height: 100%;
  }
`;

const DailyBottom = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  margin-top: 10px;
`;

const Img = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 70px;
  height: 70px;
  margin-right: 10px;
  overflow: hidden;

  img {
    height: 100%;
  }
  div {
    width: 100%;
    height: 100%;
  }
`;

const ImgDesc = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 210px;
  width: auto;

  b {
    font-size: ${({ theme }) => theme.fontSizes.small};
  }

  span {
    font-size: ${({ theme }) => theme.fontSizes.small};
  }
`;

export default Daily;
