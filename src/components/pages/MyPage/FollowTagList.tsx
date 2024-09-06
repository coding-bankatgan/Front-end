import { ContentWrapper } from '@/styles/CommonStyles';
import { Button } from '@/components/ui/button';
import styled from '@emotion/styled';

import MinusIcon from '@/assets/icons/MinusIcon';

const FollowTagList = () => {
  return (
    <ContentWrapperStyled>
      <FollowTagListStyled>
        <ul>내가 팔로우한 태그 목록</ul>
        <Line />
        {Array.from({ length: 3 }, (_, idx) => (
          <li key={idx}>
            # 시원한
            <Button>
              <MinusIcon />
            </Button>
          </li>
        ))}
      </FollowTagListStyled>
    </ContentWrapperStyled>
  );
};

const ContentWrapperStyled = styled(ContentWrapper)`
  margin: 0;
`;

const FollowTagListStyled = styled.div`
  list-style: none;
  font-weight: bold;

  ul {
    font-size: ${({ theme }) => theme.fontSizes.large};
  }

  li {
    display: flex;
    justify-content: space-between;
    margin: 15px 0;
    padding: 0 10px;
    font-size: ${({ theme }) => theme.fontSizes.base};

    button {
      height: 24px;
      padding: 0;
      margin: 0;
      background-color: ${({ theme }) => theme.colors.white};
      &: focus {
        background-color: ${({ theme }) => theme.colors.white};
      }
    }

    svg {
      color: ${({ theme }) => theme.colors.white};
      background-color: ${({ theme }) => theme.colors.gray};
      border-radius: 12px;
    }
  }
`;

const Line = styled.div`
  width: 100%;
  height: 1px;
  margin: 10px 0;
  background-color: ${({ theme }) => theme.colors.gray};
`;

export default FollowTagList;
