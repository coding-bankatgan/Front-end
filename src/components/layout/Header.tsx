import styled from '@emotion/styled';
import EllipsisVerticalIcon from './../../assets/icons/EllipsisVerticalIcon';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';
import Notification from './Notification';

const Header = () => {
  const navigate = useNavigate();

  return (
    <HeaderLayout>
      <Logo onClick={() => navigate('/')}>logo</Logo>
      <MenuWrapper>
        <Notification />
        <DropdownMenu>
          <DropdownMenuTrigger>
            <EllipsisVerticalIcon />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => navigate('/announcement')}>공지사항</DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/faq')}>FAQ</DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/specialty-drink')}>
              특산주 신청 리스트
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/report')}>
              신고 접수 리스트
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </MenuWrapper>
    </HeaderLayout>
  );
};

const HeaderLayout = styled.header`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  min-width: 360px;
  width: auto;
  height: 60px;
  padding: 0 10px 0 20px;
  box-shadow: rgba(114, 114, 114, 0.1) 0px 1px 5px;
`;

const Logo = styled.h1`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100px;
  height: 30px;
  background-color: ${({ theme }) => theme.colors.lightGray};
`;

const MenuWrapper = styled.div`
  display: flex;

  svg {
    color: ${({ theme }) => theme.colors.darkGray};
  }
`;

export default Header;
