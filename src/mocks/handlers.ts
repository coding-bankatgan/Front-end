import { http, HttpResponse } from 'msw';
import cardItem from '../../public/cardItem.json';
import cardItemDetail from '../../public/cardItemDetail.json';
import specialtyDrink from '../../public/specialtyDrink.json';
import regions from '../../public/regions.json';
import registration from '../../public/registration.json';

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
      throw new HttpResponse(null, {
        status: 401,
      });
    }
  }),

  /** 전체 게시글 조회 API */
  http.get('/posts', async () => {
    return HttpResponse.json(cardItem);
  }),

  /** 특정 게시글 조회 API */
  http.get('/posts/detail', async () => {
    return HttpResponse.json(cardItemDetail);
  }),

  /** 마이페이지 회원정보수정 API */
  http.post('/mypage/edit', async () => {
    return HttpResponse.json({ specialtyDrink, regions });
  }),

  /** 특산주 신청 API */
  http.post('/specialty-drink', async () => {
    return HttpResponse.json(registration);
  }),
  http.post('/specialty-drink/form', async () => {
    return HttpResponse.json({ registration, regions });
  }),

  http.post('/api/auth/google', async ({ request }) => {
    const { code } = (await request.json()) as { code: string };
    console.log(code);

    const mockTokens = {
      access_token: code,
      refresh_token: code,
    };

    return HttpResponse.json({
      mockTokens,
    });
  }),
];
