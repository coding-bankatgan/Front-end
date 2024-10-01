import styled from '@emotion/styled';
import { Container, Header, ScrollCont, Wrapper } from './SignUpStep1';
import { Button } from './SignUp';
import { alcoholsData } from '@/data/alcoholsData';
import { alcoholsImg } from '@/data/alcoholsImg';

const SignUpStep2 = ({
  handleSubmit,
  handleSelect,
  selectedAlcohols,
  validatedAlcohols,
  containerRef,
}: {
  handleSubmit: () => void;
  handleSelect: (alcohol: string) => void;
  selectedAlcohols: string[];
  validatedAlcohols: boolean;
  containerRef: React.RefObject<HTMLDivElement>;
}) => {
  const alcohols: string[] = Object.keys(alcoholsData);
  const alcoholsName: string[] = Object.values(alcoholsData);

  return (
    <Wrapper>
      <ScrollCont>
        <Container>
          <Header ref={containerRef}>
            좋아하는 주종을 선택해 주세요 :)
            <AlarmText validated={validatedAlcohols}>※ 3 ~ 5개를 선택해 주세요.</AlarmText>
          </Header>
          <AlcoholList>
            {alcohols.map((alcohol: string, idx: number) => (
              <AlcoholItem
                key={alcohol}
                isSelected={selectedAlcohols.includes(alcohol)}
                onClick={() => handleSelect(alcohol)}
                aria-label={`주종 선택: ${alcoholsName[idx]}`}
              >
                <img src={alcoholsImg[alcohol]} alt={alcoholsName[idx]} />
              </AlcoholItem>
            ))}
          </AlcoholList>
        </Container>
      </ScrollCont>
      <ButtonWrapper>
        <Button onClick={() => handleSubmit()} aria-label="회원가입 데이터 제출">
          완료
        </Button>
      </ButtonWrapper>
    </Wrapper>
  );
};

export default SignUpStep2;

const AlcoholList = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
  gap: 10px;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;
const AlarmText = styled.p<{ validated: boolean }>`
  color: ${({ validated, theme }) => (validated ? theme.colors.gray : theme.colors.error)};
  font-size: ${({ theme }) => theme.fontSizes.xsmall};
`;

interface AlcoholItemProps {
  isSelected: boolean;
}

const AlcoholItem = styled.button<AlcoholItemProps>`
  width: 90px;
  height: 90px;
  background-color: ${({ theme }) => theme.colors.white};
  border: 3px solid
    ${({ isSelected, theme }) => (isSelected ? theme.colors.tertiary : theme.colors.brightGray)};
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: ${({ theme }) => theme.fontSizes.small};
`;

const ButtonWrapper = styled.span`
  padding-top: 20px;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.white};
`;
