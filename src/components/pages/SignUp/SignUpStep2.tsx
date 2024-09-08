import styled from '@emotion/styled';
import { Container, Gray2, Header, Orange2, ScrollCont, Step, Wrapper } from './SignUpStep1';
import { Button, Label } from './SignUp';
import ArrowLeftIcon from '@/assets/icons/ArrowLeftIcon';
import { Input } from '@/components/ui/input';

const SignUpStep2 = ({
  nextSlide,
  prevSlide,
}: {
  nextSlide: () => void;
  prevSlide: () => void;
}) => {
  return (
    <Wrapper>
      <ScrollCont>
        <Step>
          <Orange2 />
          <Gray2 />
        </Step>
        <PrevContainer onClick={() => prevSlide()}>
          <ArrowLeftIcon />
        </PrevContainer>
        <Container>
          <Header>
            현재 거주하고 있는 지역 정보를
            <br />
            입력해 주세요.
          </Header>
          <Label htmlFor="email">도</Label>
          <Input type="text" />
          <Label htmlFor="email">시</Label>
          <Input type="text" />
        </Container>
      </ScrollCont>

      <Button onClick={() => nextSlide()}>다음</Button>
    </Wrapper>
  );
};

export default SignUpStep2;

export const PrevContainer = styled.div`
  color: black;
  width: 20px;
  height: 20px;
  transform: translateY(-60%);
`;
