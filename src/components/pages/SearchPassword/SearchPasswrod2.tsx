import { Button } from '../SignUp/SignUp';
import { Header } from '../SignUp/SignUpStep1';
import symbol from '../../../../public/symbol.png';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { LogoImage } from '../Login';

const SearchPassword2 = () => {
  const navigate = useNavigate();

  const consfirm = () => {
    navigate('/login');
  };

  return (
    <Wrapper>
      <LogoImage src={symbol} alt="오늘한잔" />
      <Header>
        입력해주신 이메일로 메일이
        <br />
        전달되었습니다!
      </Header>

      <Button onClick={consfirm}>로그인 페이지로 가기!</Button>
    </Wrapper>
  );
};

export default SearchPassword2;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 20px 20px 20px;
  width: 100%;
  height: calc(100vh - 65px);
  h2 {
    text-align: center;
  }
  > div {
    width: 100%;
  }
  input {
    width: 98%;
  }

  button {
    margin-top: 20px;
  }
`;
