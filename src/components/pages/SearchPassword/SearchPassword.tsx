import { Input } from '@/components/ui/input';
import { Button, Label } from '../SignUp/SignUp';
import {
  AlertText,
  CheckEmail,
  ConFirmed,
  Container,
  Header,
  Loading,
  Validation,
} from '../SignUp/SignUpStep1';
import { useEffect, useState } from 'react';
import axios, { CancelTokenSource } from 'axios';
import api from '@/api/axios';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import symbol from '../../../../public/symbol.png';
import { LogoImage } from '../Login';

const SearchPassword = () => {
  const [email, setEmail] = useState('');
  const [emailConfirm, setEmailConfirm] = useState(true);
  const [confirmAlert, setConfirmAlert] = useState(false);
  const [validatedText, setValidatedText] = useState('');
  const [validatedEmail, setValidatedEmail] = useState(true);
  const [validatedLoading, setValidatedLoading] = useState(false);
  const [cancelTokenSource, setCancelTokenSource] = useState<CancelTokenSource | null>(null);

  const navigate = useNavigate();

  const checkEmail = async (email: string) => {
    setValidatedLoading(true);
    setValidatedText('이메일을 확인중입니다.');
    if (cancelTokenSource) {
      cancelTokenSource.cancel('새로운 값 요청으로 인한 이전 값 폐기');
    }
    const source = axios.CancelToken.source();
    setCancelTokenSource(source);

    try {
      await api.get(`/members/email/${email}/validation`, { cancelToken: source.token });
      setValidatedEmail(false);
      setValidatedLoading(false);
      setValidatedText('');
    } catch (error) {
      setValidatedLoading(false);
      setValidatedText('');
      setValidatedEmail(true);
    }
  };

  useEffect(() => {
    setValidatedLoading(true);
    const timeout = setTimeout(() => {
      if (email.includes('@')) {
        checkEmail(email);
      }
    }, 500);
    return () => {
      clearTimeout(timeout);
    };
  }, [email]);

  useEffect(() => {
    if (email === '') {
      setEmailConfirm(true);
    } else if (!email.includes('@')) {
      setEmailConfirm(false);
    } else {
      setEmailConfirm(true);
    }
  }, [email]);

  const submitEmail = async () => {
    if (email === '') {
      setConfirmAlert(true);
      return;
    }
    if (!emailConfirm || validatedLoading || !validatedEmail) {
      return;
    }
    try {
      await api.post('/members/request-password-reset', { email: email });
      navigate('/search-password/2');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Wrapper>
      <LogoImage src={symbol} alt="오늘한잔" />
      <Header>비밀번호 찾기</Header>
      <Container>
        <Label htmlFor="email">
          아이디(이메일)
          {!validatedLoading && !validatedEmail && (
            <Validation>등록되지 않은 이메일 입니다.</Validation>
          )}
          {validatedText !== '' && (
            <>
              <CheckEmail>※중복 확인 중</CheckEmail>
              <Loading />
            </>
          )}
          {!validatedLoading && validatedEmail && <ConFirmed>등록된 이메일 입니다!</ConFirmed>}
        </Label>
        <Input
          type="email"
          name="email"
          id="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <AlertText>
          {email === '' && confirmAlert && '올바른 아이디(이메일)를 입력해주세요.'}
          {!emailConfirm && '올바른 아이디(이메일)를 입력해주세요.'}
        </AlertText>
      </Container>

      <Button onClick={submitEmail}>확인</Button>
    </Wrapper>
  );
};

export default SearchPassword;

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 20px 20px 20px;
  width: 100%;
  height: calc(100vh - 65px);
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
