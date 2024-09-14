import { delay, http, HttpResponse } from 'msw';
import cardItem from '../../public/cardItem.json';
import cardItemDetail from '../../public/cardItemDetail.json';
import specialtyDrink from '../../public/specialtyDrink.json';
import regions from '../../public/regions.json';
import registration from '../../public/registration.json';
import comments from '../../public/comments.json';

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
  http.get('api/posts', async () => {
    return HttpResponse.json(cardItem);
  }),

  /** 특정 게시글 조회 API */
  http.get('api/posts/:postId', async ({ params }) => {
    Number(params.postId);
    return HttpResponse.json(cardItemDetail);
  }),

  /** 특정 게시글 댓글 API */
  http.get('/api/:postId/comments', async ({ params, request }) => {
    const postId = Number(params.postId);
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('number')) || 0;
    const size = Number(url.searchParams.get('size')) || 10;

    const filteredComments = comments
      .flatMap(comment => comment.content)
      .filter(comment => comment.postId === postId);

    // 페이지네이션
    const start = Number(page) * Number(size);
    const end = start + Number(size);
    const paginatedComments = filteredComments.slice(start, end);
    const totalElements = filteredComments.length;
    const totalPages = Math.ceil(totalElements / Number(size));

    return HttpResponse.json({
      totalElements,
      totalPages,
      size,
      number: page,
      content: paginatedComments,
    });
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

  /** 아이디 중복 검사 API */
  http.post('/api/email', async ({ request }) => {
    const { email } = (await request.json()) as { email: string };

    await delay(2000);

    if (email === 'man@naver.com') {
      throw new HttpResponse(null, {
        status: 401,
      });
    }

    return HttpResponse.json({
      message: '사용 가능한 아이디 입니다.',
    });
  }),
  /** 데일리 추천 api */
  http.get(`api/suggest/drink`, ({ request }) => {
    const requestUrl = new URL(request.url);
    const lat = requestUrl.searchParams.get('lat');
    const lon = requestUrl.searchParams.get('lon');

    const answer = {
      drink_id: 1,
      name: '독산 30',
      place_name: '서울시',
      image_url: 'https://thesool.com/common/imageView.do?targetId=PR00000957&targetNm=PRODUCT',
      lat,
      lon,
    };

    return HttpResponse.json({
      answer,
    });
  }),
];
