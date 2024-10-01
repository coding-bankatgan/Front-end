import styled from '@emotion/styled';
import MapPinIcon from '../../../assets/icons/MapPinIcon';
import { useEffect, useState } from 'react';
import { getAddress } from '@/api/postApi';
import Loading from '@/assets/icons/Loading';
import { Skeleton } from '@/components/ui/skeleton';
import api from '@/api/axios';
import { alcoholsData } from '@/data/alcoholsData';

const Daily = () => {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isVerification, setIsVerification] = useState<boolean | null>(null);
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [rotate, setRotate] = useState(0);
  const [imageLoading, setImageLoading] = useState(true);
  const [dailyData, setDailyData] = useState({
    averageRating: 0,
    name: '브라우저 권한을 확인해주세요!',
    placeName: '',
    imageUrl: '',
    sweetness: 0,
    type: 0,
    cost: 0,
    degree: 0,
    id: 0,
    description: '',
  });

  const alcohols = alcoholsData;

  const handleRotate = () => {
    setRotate(prev => prev + 1);
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
            const item = await api.get(`/suggest/drink?lat=${latitude}&lon=${longitude}`);
            console.log(item);

            setDailyData(item.data);
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
              {dailyData?.name !== '브라우저 권한을 확인해주세요!' && (
                <img
                  src={dailyData?.imageUrl}
                  alt={dailyData?.name}
                  onLoad={() => setImageLoading(false)}
                />
              )}
            </Img>
            <ImgDesc>
              {imageLoading ? (
                <SkeletonContainer>
                  <Skeleton />
                </SkeletonContainer>
              ) : (
                <b>{dailyData?.name}</b>
              )}
              {imageLoading ? (
                <SkeletonContainer>
                  <Skeleton />
                </SkeletonContainer>
              ) : (
                <>
                  <span>
                    주종: {`${alcohols[dailyData?.type]}`} &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
                    도수: {`${dailyData?.degree}%`}
                  </span>
                  <span>가격: {`${dailyData?.cost.toLocaleString()}원`}</span>
                </>
              )}
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
    color: ${({ theme }) => theme.colors.black};
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

const SkeletonContainer = styled.div`
  width: 130px;
  height: 21px;
  margin-bottom: 3px;
  > div {
    width: 100%;
    height: 100%;
  }
`;

const ValiText = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 70px;
  font-size: ${({ theme }) => theme.fontSizes.small};
  button {
    margin-top: 4px;
    padding: 3px 10px;
    background-color: ${({ theme }) => theme.colors.point};
    border-radius: 15px;
    color: ${({ theme }) => theme.colors.white};
    font-size: ${({ theme }) => theme.fontSizes.small};
  }
`;

const LoadingContainer = styled.div<{ rotate: number }>`
  position: absolute;
  right: 20px;
  bottom: 20px;
  width: 16px;
  height: 16px;
  color: ${({ theme }) => theme.colors.darkGray};
  cursor: pointer;
  transition: transform 1s ease;
  transform: rotate(${({ rotate }) => rotate * 360}deg);

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
    border-radius: 5px;
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
  color: ${({ theme }) => theme.colors.black};

  b {
    font-size: ${({ theme }) => theme.fontSizes.small};
  }

  span {
    font-size: ${({ theme }) => theme.fontSizes.small};
  }
`;

export default Daily;
