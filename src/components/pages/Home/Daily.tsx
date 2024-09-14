import styled from '@emotion/styled';
import MapPinIcon from '../../../assets/icons/MapPinIcon';
import { useEffect, useState } from 'react';
import { worker } from '@/mocks/browser';
import axios from 'axios';
import { getAddress } from '@/api/postApi';
import Loading from '@/assets/icons/Loading';

const Daily = () => {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isVerification, setIsVerification] = useState<boolean | null>(null);
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [rotate, setRotate] = useState('false');
  const [showModal, setShowModal] = useState(false);
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
      setShowModal(true);
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
            await worker.start();
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
          <ImgDesc>
            <b>위치정보 제공에 동의해 주세요!</b>
          </ImgDesc>
        ) : (
          <>
            <Img>
              <img src={dailyData.image_url} alt={dailyData.name} />
            </Img>
            <ImgDesc>
              <b>{dailyData.name}</b>
              <span>종류 / 맛 / 도수 / 가격 정보</span>
            </ImgDesc>
          </>
        )}
      </DailyBottom>
      <LoadingContainer
        rotate={rotate}
        onClick={() => {
          handleRotate();
          if (!isVerification) {
            setShowModal(true);
          }
        }}
      >
        <Loading />
      </LoadingContainer>
      {showModal && (
        <Modal>
          <ModalContent>
            <h2>위치정보 제공 동의가 필요합니다.</h2>
            <p>
              위치정보를 제공하고 <br />
              특별한 특산주들을 추천받기!
            </p>
            <button
              onClick={() => {
                setIsVerification(true);
                localStorage.setItem('gpsVeri', 'on');
                setShowModal(false);
              }}
            >
              동의
            </button>
            <button onClick={() => setShowModal(false)}>닫기</button>
          </ModalContent>
        </Modal>
      )}
    </DailySection>
  );
};
const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  width: 80%;
  padding: 20px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.white};
  text-align: center;
  border: 4px solid ${({ theme }) => theme.colors.tertiary};
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.6);
  h2 {
    margin-bottom: 10px;
    font-weight: bold;
  }

  button {
    margin: 15px 30px 0 30px;
    padding: 3px 15px 3px 15px;
    color: ${({ theme }) => theme.colors.white};
    border-radius: 8px;
  }
  button:nth-of-type(1) {
    background-color: ${({ theme }) => theme.colors.success};
  }
  button:nth-of-type(2) {
    background-color: ${({ theme }) => theme.colors.error};
  }
`;

const LoadingContainer = styled.div<{ rotate: boolean | string }>`
  position: absolute;
  right: 3px;
  bottom: 3px;
  width: 20px;
  height: 20px;
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

const DailySection = styled.section`
  position: relative;
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
  width: 80px;
  height: 80px;
  margin-right: 10px;
  border-radius: 10px;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
  }
`;

const ImgDesc = styled.span`
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  b {
    font-size: ${({ theme }) => theme.fontSizes.small};
  }

  span {
    font-size: ${({ theme }) => theme.fontSizes.small};
  }
`;

export default Daily;
