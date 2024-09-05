import styled from '@emotion/styled';
import { Button, Input, Label, Star } from './SignUp';
import { PrevContainer } from './SignUpStep2';

const SignUpStep1 = ({
  name,
  setName,
  date,
  setDate,
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  nextSlide,
}: {
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;

  date: string;
  setDate: React.Dispatch<React.SetStateAction<string>>;
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;

  confirmPassword: string;
  setConfirmPassword: React.Dispatch<React.SetStateAction<string>>;
  nextSlide: () => void;
}) => {
  const isMatch = password === confirmPassword && password !== '';

  return (
    <Wrapper>
      <ScrollCont>
        <Step>
          <Orange1 />
          <Gray1 />
        </Step>
        <PrevContainer></PrevContainer>
        <Container>
          <Header>기본적인 정보를 입력해주세요.</Header>
          <Label htmlFor="name">
            <Star>*</Star>닉네임(이름)
          </Label>
          <Input
            type="text"
            name="name"
            id="name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <Label htmlFor="email">
            <Star>*</Star>생년월일
          </Label>
          <Input
            type="date"
            id="birthdate"
            name="birthdate"
            value={date}
            onChange={e => {
              setDate(e.target.value);
            }}
          />
          <Label htmlFor="email">
            <Star>*</Star>아이디(이메일)
          </Label>
          <Input
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <Label htmlFor="password">
            <Star>*</Star>패스워드
          </Label>
          <Input
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <Label htmlFor="confirmPassword">패스워드 확인</Label>
          <Input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
          />

          {password && confirmPassword && !isMatch && (
            <p style={{ color: 'red', fontSize: '14px' }}>비밀번호가 일치하지 않습니다.</p>
          )}
          <AlarmText>
            *회원가입시 작성한 이메일로 주기마다
            <br />
            &nbsp; 특산주 추천 메일을 보내드립니다.
          </AlarmText>
        </Container>
      </ScrollCont>
      <Button onClick={() => nextSlide()}>다음</Button>
    </Wrapper>
  );
};

export default SignUpStep1;

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
  min-width: 100vw;
  height: 100vh;

  background-color: white;
`;
export const ScrollCont = styled.div`
  overflow-y: scroll;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;
export const Container = styled.div`
  overflow-y: scroll;
  margin: 5px;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const Header = styled.h2`
  margin: 20px 0 20px 0;
  font-size: ${({ theme }) => theme.fontSizes.medium};
  font-weight: bold;
`;

export const AlarmText = styled.p`
  color: ${({ theme }) => theme.colors.gray};
  font-size: ${({ theme }) => theme.fontSizes.xsmall};
`;

export const Step = styled.div`
  display: flex;
  width: 50%;
  height: 5px;
  margin: 0 auto 10px auto;
`;

export const Orange1 = styled.div`
  background-color: ${({ theme }) => theme.colors.tertiary};
  width: 33.33%;
  height: 100%;
`;

export const Orange2 = styled.div`
  background-color: ${({ theme }) => theme.colors.tertiary};
  width: 66.67%;
  height: 100%;
`;

export const Orange3 = styled.div`
  background-color: ${({ theme }) => theme.colors.tertiary};
  width: 100%;
  height: 100%;
`;

export const Gray1 = styled.div`
  background-color: ${({ theme }) => theme.colors.gray};
  width: 66.67%;
  height: 100%;
`;

export const Gray2 = styled.div`
  background-color: ${({ theme }) => theme.colors.gray};
  width: 33.33%;
  height: 100%;
`;
