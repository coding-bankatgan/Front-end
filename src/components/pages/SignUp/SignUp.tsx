import { useEffect, useState } from 'react';
import SignUpStep1 from './SignUpStep1';
import SignUpStep2 from './SignUpStep2';
import SignUpStep3 from './SignUpStep3';
import styled from '@emotion/styled';

const SignUp = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedAlcohols, setSelectedAlcohols] = useState<string[]>([]);
  const [confirmAlert, setConfirmAlert] = useState(false);

  const isMatch = password === confirmPassword && password !== '';

  const nextSlide = () => {
    if (date === '' || name === '' || email === '' || password === '') {
      setConfirmAlert(true);
      return;
    }
    if (currentSlide === 0 && !isMatch) return;
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
  font-size: ${({ theme }) => theme.fontSizes.xsmall};
  &::before {
    margin-right: 4px;
    content: '*';
    color: ${({ theme }) => theme.colors.tertiary};
  }
`;
