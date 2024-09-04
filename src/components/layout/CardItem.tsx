import styled from '@emotion/styled';
import ViewIcon from './../../assets/icons/ViewIcon';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import HeartIcon from '@/assets/icons/HeartIcon';
import { Badge } from '@/components/ui/badge';
import ExProfileImg from '@/assets/ExProfileImg';
import { useState } from 'react';

const CardItem = () => {
  const [liked, setLiked] = useState(false);

  const toggleLike = () => {
    setLiked(!liked);
  };

  return (
    <CardStyled>
      <CardHeaderStyled>
        <img src="https://picsum.photos/seed/picsum/155/135" alt="주류 이름" />
      </CardHeaderStyled>
      <CardContentStyled>
        <ContentTop>
          <span>
            <ExProfileImg />
            닉네임
          </span>
          <HeartIcon onClick={toggleLike} liked={liked} />
        </ContentTop>
        <p>
          이 특산주는 이러쿵 저러쿵~ 넘 맛있고 최고다 또 먹고싶다 돈만 있으면 쟁여서 먹고싶다.
          꿈에서도 생각나는 맛이다~
        </p>
        <TagWrapper>
          {Array.from({ length: 3 }, (_, idx) => (
            <Badge key={idx}>#태그입력</Badge>
          ))}
        </TagWrapper>
      </CardContentStyled>
      <CardFooterStyled>
        <span>
          <ViewIcon /> 1,000
        </span>
        <span>2000.01.01</span>
      </CardFooterStyled>
    </CardStyled>
  );
};

const CardStyled = styled(Card)`
  min-width: 150px;
  width: 48.5%;
  margin-bottom: 10px;
  border-radius: 10px;
  overflow: hidden;
`;

const CardHeaderStyled = styled(CardHeader)`
  padding: 0;
`;

const CardContentStyled = styled(CardContent)`
  padding: 10px 10px 5px 10px;

  p {
    display: -webkit-box;
    margin-top: 5px;
    font-size: ${({ theme }) => theme.fontSizes.xsmall};
    text-align: justify;
    letter-spacing: -0.5px;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
`;

const ContentTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  span {
    display: flex;
    font-size: ${({ theme }) => theme.fontSizes.xsmall};

    svg {
      width: 20px;
      height: 20px;
      margin-right: 3px;
    }
  }

  > svg {
    width: 16px;
    height: 16px;
    color: ${({ theme }) => theme.colors.gray};
  }
`;

const TagWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  white-space: nowrap;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    height: 0;
  }

  div {
    margin-right: 4px;
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.white};
    font-size: ${({ theme }) => theme.fontSizes.xxsmall};
    font-weight: normal;
  }

  div:nth-last-of-type(1) {
    margin-right: 0;
  }
`;

const CardFooterStyled = styled(CardFooter)`
  display: flex;
  justify-content: space-between;
  padding: 5px 10px;

  span:nth-of-type(1) {
    display: flex;
    align-items: center;
    color: ${({ theme }) => theme.colors.gray};
    font-size: ${({ theme }) => theme.fontSizes.xxsmall};

    svg {
      width: 14px;
      height: 14px;
      margin-right: 3px;
    }
  }

  span:nth-of-type(2) {
    color: ${({ theme }) => theme.colors.gray};
    font-size: ${({ theme }) => theme.fontSizes.xxsmall};
  }
`;

export default CardItem;
