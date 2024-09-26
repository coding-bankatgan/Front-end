import styled from '@emotion/styled';
import { Container, Header, ScrollCont, Wrapper } from './SignUpStep1';
import { Button } from './SignUp';

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
  const alcohols: string[] = [
    'SOJU',
    'BEER',
    'LIQUOR',
    'MAKGEOLLI',
    'DONGDONGJU',
    'CHEONGJU',
    'YAKJU',
    'FRUIT WINE',
    'LIQUEUR',
    'DISTILLED SPIRITS',
    'GAOLIANG LIQUOR',
    'FOLK LIQUOR',
    'WHISKEY',
    'BRANDY',
    'RUM',
    'GIN',
    'VODKA',
    'TEQUILA',
    'WINE',
    'CHAMPAGNE',
    'SAKE',
    'OTHER',
  ];
  const alcoholsName: string[] = [
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
              >
                {alcoholsName[idx]}
              </AlcoholItem>
            ))}
          </AlcoholList>
        </Container>
      </ScrollCont>
      <Button onClick={() => handleSubmit()}>완료</Button>
    </Wrapper>
  );
};

export default SignUpStep2;

const AlcoholList = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  overflow-y: scroll;
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
  background-color: ${({ isSelected, theme }) =>
    isSelected ? theme.colors.tertiary : theme.colors.brightGray};
  border-radius: 10px;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: ${({ theme }) => theme.fontSizes.small};
`;
