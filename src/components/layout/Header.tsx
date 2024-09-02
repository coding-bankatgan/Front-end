import styled from '@emotion/styled';

const Header = () => {
  return <HeaderLayout>헤더</HeaderLayout>;
};

const HeaderLayout = styled.header`
  min-width: 360px;
  width: auto;
  height: 60px;
  background-color: green;
`;

export default Header;
