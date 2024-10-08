import styled from '@emotion/styled';
import HomeIcon from './../../assets/icons/HomeIcon';
import SearchIcon from './../../assets/icons/SearchIcon';
import UserIcon from './../../assets/icons/UserIcon';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import WriteIcon from '@/assets/icons/WriteIcon';

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeIcon, setActiveIcon] = useState<string | null>(null);
  const [isFooterVisible, setIsFooterVisible] = useState(true);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      if (window.scrollY === 0) {
        setIsFooterVisible(true);
        return;
      }

      if (window.scrollY < lastScrollY) {
        setIsFooterVisible(true);
      } else {
        setIsFooterVisible(false);
      }
      lastScrollY = window.scrollY;
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const path = location.pathname.slice(1);
    setActiveIcon(path);
  }, [location]);

  const handleClick = (iconName: string) => {
    setActiveIcon(iconName);
    navigate(`/${iconName}`);
  };

  return (
    <FooterLayout visible={isFooterVisible}>
      <IconWrapper onClick={() => handleClick('')} active={activeIcon === ''}>
        <HomeIcon />
      </IconWrapper>
      <IconWrapper onClick={() => handleClick('search')} active={activeIcon === 'search'}>
        <SearchIcon />
      </IconWrapper>
      <IconWrapper onClick={() => handleClick('create-post')} active={activeIcon === 'create-post'}>
        <WriteIcon />
      </IconWrapper>
      <IconWrapper onClick={() => handleClick('mypage')} active={activeIcon === 'mypage'}>
        <UserIcon />
      </IconWrapper>
    </FooterLayout>
  );
};

const FooterLayout = styled.footer<{ visible: boolean }>`
  display: flex;
  position: fixed;
  bottom: 0;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  min-width: 360px;
  width: 100%;
  height: 60px;
  padding: 0 25px;
  background-color: ${({ theme }) => theme.colors.white};
  box-shadow: rgba(114, 114, 114, 0.2) 0px -1px 1px;
  transition: transform 0.3s ease;
  transform: translateY(${({ visible }) => (visible ? '0' : '100%')});
`;

const IconWrapper = styled.span<{ active: boolean }>`
  color: ${({ theme, active }) => (active ? theme.colors.primary : theme.colors.darkGray)};
`;

export default Footer;
