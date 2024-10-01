import { useEffect, useRef, useState } from 'react';
import SignUpStep1 from './SignUpStep1';
import SignUpStep2 from './SignUpStep2';
import styled from '@emotion/styled';
import dayjs from 'dayjs';
import axios, { CancelTokenSource } from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import StepBar from './StepBar';
import { useNavigate } from 'react-router-dom';
import api from '@/api/axios';

const SignUp = () => {
  const [isNext, setIsNext] = useState(true);

  const [currentSlide, setCurrentSlide] = useState(1);
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
  const [validatedAlcohols, setValidatedAlcohols] = useState(true);
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
    const regex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>~`;])[A-Za-z\d!@#$%^&*(),.?":{}|<>~`;]{8,15}$/.test(
        password,
      );
    if (regex) {
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
    if (currentSlide === 1 && !isMatch) return;
    if (name.length < 2 || name.length > 7) {
      return;
    }
    if (dateConfirm || !emailConfirm || !validatedPassword || validatedLoading || !validatedEmail) {
      return;
    }
    setIsNext(true);
    setCurrentSlide(prev => (prev + 1) % 3);
  };

  const prevSlide = () => {
    setIsNext(false);
    setCurrentSlide(prev => (prev - 1 + 3) % 3);
  };

  const handleSelect = (alcohol: string) => {
    if (selectedAlcohols.includes(alcohol)) {
      setSelectedAlcohols(selectedAlcohols.filter(item => item !== alcohol));
    } else {
      setSelectedAlcohols([...selectedAlcohols, alcohol]);
    }
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const handleSubmit = async () => {
    if (selectedAlcohols.length < 3 || selectedAlcohols.length > 5) {
      setValidatedAlcohols(false);
      containerRef.current?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    const userData = {
      name: name,
      email: email,
      password: password,
      birthDate: date,
      favorDrinkType: selectedAlcohols,
      alarmEnabled: true,
    };

    try {
      await api.post(`/members/signup`, userData);
      navigate('/login?signup=true');
    } catch (error) {
      console.error('회원가입 오류:', error);
    }
  };

  return (
    <SlideWrapper>
      <SlideContainer>
        <AnimatePresence>
          {currentSlide === 1 && (
            <>
              <StepBar prevSlide={prevSlide} progressValue={50} currentSlide={currentSlide} />
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: isNext ? 100 : -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isNext ? -100 : 100 }}
                transition={{ duration: 0.4 }}
              >
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
              </motion.div>
            </>
          )}
          {currentSlide === 2 && (
            <>
              <StepBar prevSlide={prevSlide} progressValue={100} currentSlide={currentSlide} />
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: isNext ? 100 : -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isNext ? -100 : 100 }}
                transition={{ duration: 0.4 }}
              >
                <SignUpStep2
                  handleSubmit={handleSubmit}
                  handleSelect={handleSelect}
                  selectedAlcohols={selectedAlcohols}
                  validatedAlcohols={validatedAlcohols}
                  containerRef={containerRef}
                ></SignUpStep2>
              </motion.div>
            </>
          )}
        </AnimatePresence>
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

const SlideContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Button = styled.button`
  width: 100%;

  background-color: ${({ theme }) => theme.colors.primary};
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
    margin-right: 3px;
    content: '*';
    color: ${({ theme }) => theme.colors.point};
  }
`;
