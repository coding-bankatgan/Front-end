import styled from '@emotion/styled';

export const PageLayout = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 360px;
  width: 100%;
  max-width: auto;
  min-height: calc(100vh - 120px);
  height: auto;
  background-color: ${({ theme }) => theme.colors.primary};
`;

// 로그인, 회원가입
export const AuthLayout = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 360px;
  width: 100%;
  max-width: auto;
  min-height: 100vh;
  height: auto;
  background-color: ${({ theme }) => theme.colors.primary};
`;

// Footer 없는 페이지
export const NoFooterLayout = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 360px;
  width: 100%;
  max-width: auto;
  min-height: calc(100vh - 60px);
  height: auto;
  background-color: ${({ theme }) => theme.colors.primary};
`;

// 전체 레이아웃의 하위 자식
export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 330px;
  width: 100%;
  margin: 30px;
  background-color: ${({ theme }) => theme.colors.secondary};
`;
