import styled from '@emotion/styled';
import { AlarmText, Container, Header, Orange3, ScrollCont, Step, Wrapper } from './SignUpStep1';
import { PrevContainer } from './SignUpStep2';
import ArrowLeftIcon from '@/assets/icons/ArrowLeftIcon';
import { Button } from './SignUp';
import { useNavigate } from 'react-router-dom';

const SignUpStep3 = ({
  prevSlide,
  handleSelect,
  selectedAlcohols,
}: {
  prevSlide: () => void;
  handleSelect: (alcohol: string) => void;
  selectedAlcohols: string[];
}) => {
  const navigate = useNavigate();
  const alcohols: string[] = [
    '소주',
    '맥주',
    '양주',
    '막걸리',
    '동동주',
    '청주',
    '약주',
    '과실주',
    '리큐르',
    '증류주',
    '고량주',
    '민속주',
    '위스키',
    '브랜디',
    '럼주',
    '진',
    '보드카',
    '데킬라',
    '와인',
    '샴페인',
    '사케',
    '기타',
  ];

  return (
    <Wrapper>
      <ScrollCont>
        <Step>
          <Orange3 />
        </Step>
        <PrevContainer onClick={() => prevSlide()}>
          <ArrowLeftIcon />
        </PrevContainer>
        <Container>
          <Header>
            좋아하는 주종을 선택해 주세요 :)
            <br />
            <AlarmText>3 ~ 5개를 선택해 주세요.</AlarmText>
          </Header>

          <AlcoholList>
            {alcohols.map((alcohol: string) => (
              <AlcoholItem
                key={alcohol}
                isSelected={selectedAlcohols.includes(alcohol)}
                onClick={() => handleSelect(alcohol)}
              >
                {alcohol}
              </AlcoholItem>
            ))}
          </AlcoholList>
        </Container>
      </ScrollCont>

      <Button onClick={() => navigate('/login?signup=true')}>완료</Button>
    </Wrapper>
  );
};

export default SignUpStep3;

const AlcoholList = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  overflow-y: scroll; // 스크롤 활성화
  width: 100%; // 리스트가 가득 차도록 설정

  gap: 10px; // 아이템 간 간격
`;

interface AlcoholItemProps {
  isSelected: boolean;
}

const AlcoholItem = styled.button<AlcoholItemProps>`
  width: 90px;
  height: 90px;
  background-color: ${({ isSelected, theme }) =>
    isSelected ? theme.colors.tertiary : theme.colors.lightGray};
  border-radius: 10px;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;
