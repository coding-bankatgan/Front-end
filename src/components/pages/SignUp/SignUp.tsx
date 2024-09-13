import { useEffect, useState } from 'react';
import SignUpStep1 from './SignUpStep1';
import SignUpStep2 from './SignUpStep2';
import SignUpStep3 from './SignUpStep3';
import styled from '@emotion/styled';
import dayjs from 'dayjs';
import axios, { CancelTokenSource } from 'axios';

const SignUp = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedAlcohols, setSelectedAlcohols] = useState<string[]>([]);
  const [confirmAlert, setConfirmAlert] = useState(false);
  const [dateConfirm, setDateConfirm] = useState(true);
  const [emailConfirm, setEmailConfirm] = useState(true);
  const [validatedPassword, setValidatedPassword] = useState(true);
  const [validatedText, setValidatedText] = useState('');
  const [validatedEmail, setValidatedEmail] = useState(true);
  const [validatedLoading, setValidatedLoading] = useState(false);

  const [cancelTokenSource, setCancelTokenSource] = useState<CancelTokenSource | null>(null);

  const checkEmail = async (email: string) => {
    setValidatedLoading(true);
    setValidatedText('이메일을 확인중입니다.');
    if (cancelTokenSource) {
      cancelTokenSource.cancel('새로운 값 요청으로 인한 이전 값 폐기');
    }
    const source = axios.CancelToken.source();
    setCancelTokenSource(source);

    try {
      await axios.post('/api/email', { email }, { cancelToken: source.token });
      setValidatedLoading(false);
      setValidatedText('');
      setValidatedEmail(true);
    } catch (error) {
      setValidatedEmail(false);
      setValidatedLoading(false);
      setValidatedText('');
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

  const today = dayjs().format('YYYYMMDD');
  useEffect(() => {
    const selectedDate = date.split('-').join('');

    if (Number(selectedDate) < Number(today)) {
      setDateConfirm(false);
    } else {
      setDateConfirm(true);
    }
  }, [date]);

  useEffect(() => {
    if (email === '') {
      setEmailConfirm(true);
    } else if (!email.includes('@')) {
      setEmailConfirm(false);
    } else {
      setEmailConfirm(true);
    }
  }, [email]);

  useEffect(() => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const lengthValid = password.length >= 8 && password.length <= 15;
    if (hasUpperCase && hasLowerCase && hasDigit && hasSpecialChar && lengthValid) {
      setValidatedPassword(true);
    } else {
      setValidatedPassword(false);
    }
  }, [password]);

  const isMatch = password === confirmPassword && password !== '';

  const nextSlide = () => {
    if (date === '' || name === '' || email === '' || password === '') {
      setConfirmAlert(true);
      return;
    }
    if (currentSlide === 0 && !isMatch) return;
    if (name.length < 2 || name.length > 7) {
      return;
    }
    if (dateConfirm || !emailConfirm || !validatedPassword || validatedLoading || !validatedEmail) {
      return;
    }

    setCurrentSlide(prev => (prev + 1) % 3);
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + 3) % 3);
  };

  const handleSelect = (alcohol: string) => {
    if (selectedAlcohols.includes(alcohol)) {
      setSelectedAlcohols(selectedAlcohols.filter(item => item !== alcohol));
    } else {
      setSelectedAlcohols([...selectedAlcohols, alcohol]);
    }
  };
  useEffect(() => {
    console.log(selectedAlcohols);
  }, [selectedAlcohols]);

  return (
    <SlideWrapper>
      <SlideContainer currentSlide={currentSlide}>
        <SignUpStep1
          setEmail={setEmail}
          email={email}
          setName={setName}
          name={name}
          setDate={setDate}
          date={date}
          password={password}
          setPassword={setPassword}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
          nextSlide={nextSlide}
          confirmAlert={confirmAlert}
          dateConfirm={dateConfirm}
          emailConfirm={emailConfirm}
          validatedEmail={validatedEmail}
          validatedText={validatedText}
          validatedPassword={validatedPassword}
          validatedLoading={validatedLoading}
        ></SignUpStep1>
        <SignUpStep2 nextSlide={nextSlide} prevSlide={prevSlide}></SignUpStep2>
        <SignUpStep3
          prevSlide={prevSlide}
          handleSelect={handleSelect}
          selectedAlcohols={selectedAlcohols}
        ></SignUpStep3>
      </SlideContainer>
    </SlideWrapper>
  );
};

export default SignUp;

export interface StepProps {
  nextStep?: () => void;
  prevStep?: () => void;
}

const SlideWrapper = styled.div`
  width: 100%;

  overflow: hidden;
  position: relative;
`;

const SlideContainer = styled.div<{ currentSlide: number }>`
  display: flex;
  transition: transform 0.5s ease-in-out;
  transform: ${({ currentSlide }) => `translateX(-${currentSlide * 100}%)`};
`;

export const Button = styled.button`
  width: 100%;
  bottom: 0;
  background-color: ${({ theme }) => theme.colors.tertiary};
  border-radius: 50px;
  color: ${({ theme }) => theme.colors.white};
  padding: 10px;
  cursor: pointer;
`;

export const Label = styled.label`
  display: flex;
  align-items: center;
  font-size: ${({ theme }) => theme.fontSizes.xsmall};
  margin: 2px 0 4px 0;
  &::before {
    margin-right: 4px;
    content: '*';
    color: ${({ theme }) => theme.colors.tertiary};
  }
`;
