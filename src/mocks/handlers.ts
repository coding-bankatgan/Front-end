import { http, HttpResponse } from 'msw';

const mockJwtToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
/** 받아올 내용
{
  "sub": "1234567890",
  "name": "John Doe",
  "admin": true
}*/

export const handlers = [
  /** 로그인 테스트 API */
  http.post('/login', async ({ request }) => {
    const { email, password } = (await request.json()) as { email: string; password: string };

    if (email === 'man@naver.com' && password === 'man123456') {
      return HttpResponse.json({ token: mockJwtToken });
    } else {
      return HttpResponse.json({ message: '등록되지 않은 이메일 또는 비밀번호 오류' });
    }
  }),
];
