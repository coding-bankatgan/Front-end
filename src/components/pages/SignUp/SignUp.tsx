/** @jsxImportSource @emotion/react */

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

  const isMatch = password === confirmPassword && password !== '';

  const nextSlide = () => {
    if (date === '' || name === '' || email === '' || password === '') {
      alert('남은 칸들을 다 입력해주세요');
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
        ></SignUpStep1>
        <SignUpStep2 nextSlide={nextSlide} prevSlide={prevSlide}></SignUpStep2>
        <SignUpStep3
          prevSlide={prevSlide}
          handleSelect={handleSelect}
          selectedAlcohols={selectedAlcohols}
        ></SignUpStep3>
      </SlideContainer>
      {/* {currentSlide !== 0 && <Button onClick={prevSlide}>&lt;</Button>}
      {currentSlide !== 2 && <Button onClick={nextSlide}>&gt;</Button>} */}
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

const Slide = styled.div`
  min-width: 100%;
  height: 100vh;
  background-color: ${({ color }) => color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
`;

export const Button = styled.button`
  width: 100%;
  bottom: 0;
  background: ${({ theme }) => theme.colors.tertiary};
  border-radius: 50px;
  color: ${({ theme }) => theme.colors.white};
  padding: 10px;
  cursor: pointer;
`;

export const Label = styled.label`
  font-size: ${({ theme }) => theme.fontSizes.xsmall};
`;

export const Input = styled.input`
  width: 100%;
  margin-bottom: 16px;
  padding: 0.5rem;
  background-color: ${({ theme }) => theme.colors.lightGray};
  border-radius: 8px;
  font-size: ${({ theme }) => theme.fontSizes.small};
`;

export const Star = styled.span`
  margin-right: 4px;
  color: ${({ theme }) => theme.colors.tertiary};
`;
