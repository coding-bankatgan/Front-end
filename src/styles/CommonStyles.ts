import styled from '@emotion/styled';

export const PageLayout = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-width: 360px;
  width: 100%;
  max-width: auto;
  min-height: calc(100vh - 120px);
  height: auto;
  margin-top: 60px;
  background-color: ${({ theme }) => theme.colors.white};
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
  margin-top: 60px;
`;

// 전체 레이아웃의 하위 자식
export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 320px;
  min-height: calc(100vh - 120px);
  margin: 20px;
`;
