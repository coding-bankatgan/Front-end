import { delay, http, HttpResponse } from 'msw';
import cardItem from '../../public/cardItem.json';
import cardItemDetail from '../../public/cardItemDetail.json';
import specialtyDrink from '../../public/specialtyDrink.json';
import regions from '../../public/regions.json';
import registrations from '../../public/registration.json';
import comments from '../../public/comments.json';
import member from '../../public/member.json';
import commentWrite from '../../public/commentWrite.json';
import declarationWrite from '../../public/reportWrite.json';
import tag from '../../public/tag.json';
import declarations from '../../public/report.json';
import { Comment, CommentRequestBody } from '@/types/comment';
import announcements from '../../public/announcement.json';
import AnnouncementWrite from '../../public/announcementWrite.json';
import { Announcement, AnnouncementRequestBody } from '@/types/announcement';
import { Declaration, DeclarationRequestBody } from '@/types/declaration';
import suggestedTags from '../../public/suggestedTags.json';
import suggestedDrinks from '../../public/suggestedDrinks.json';
import autoCompleteTag from '../../public/autoCompleteTag.json';
import autoCompleteDrink from '../../public/autoCompleteDrink.json';
import searchByTag from '../../public/searchByTag.json';
import searchByDrink from '../../public/searchByDrink.json';
import notifications from '../../public/notification.json';


const mockJwtToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
/** 받아올 내용
{
  "sub": "1234567890",
  "name": "John Doe",
  "admin": true
}*/

let commentsData: Comment[] = [...commentWrite];
let announcementData: Announcement[] = [...AnnouncementWrite];
let declarationsData: Declaration[] = [...declarationWrite];

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

  /** 회원정보 조회 API */
  http.get('/api/members', async () => {
    return HttpResponse.json(member);
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

  /** 특정 게시글 댓글 작성 API */
  http.post('api/comments', async ({ request }) => {
    const requestBody = (await request.json()) as CommentRequestBody;

    const { postId, content, anonymous } = requestBody;

    const newComment: Comment = {
      id: comments.length + 1,
      memberId: 10,
      memberName: '멤버 A',
      postId: postId,
      content,
      anonymous,
      createdAt: new Date().toISOString(),
      updatedAt: null,
    };

    commentsData = [...commentsData, newComment];

    return HttpResponse.json(newComment);
  }),

  /** 특정 게시글 댓글 조회 API */
  http.get('/api/:postId/comments', async ({ params, request }) => {
    const postId = Number(params.postId);
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('number')) || 0;
    const size = Number(url.searchParams.get('size')) || 10;

    const filteredComments = comments
      .flatMap(comment => comment.content)
      .filter(comment => comment.postId === postId);

    const sortedComments = filteredComments.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    const start = Number(page) * Number(size);
    const end = start + Number(size);
    const paginatedComments = sortedComments.slice(start, end);
    const totalElements = sortedComments.length;
    const totalPages = Math.ceil(totalElements / Number(size));

    return HttpResponse.json({
      totalElements,
      totalPages,
      size,
      number: page,
      content: paginatedComments,
    });
  }),

  /** 검색페이지 태그 추천 API */
  http.get('api/suggest/tags', async () => {
    return HttpResponse.json(suggestedTags);
  }),

  /** 검색페이지 특산주 이름 추천 API */
  http.get('api/suggest/drinks', async () => {
    return HttpResponse.json(suggestedDrinks);
  }),

  /** 검색페이지 태그 자동완성 API */
  http.get('/api/auto-complete/tag', async ({ request }) => {
    const url = new URL(request.url);
    const name = url.searchParams.get('name');
    const filteredTags = autoCompleteTag.filter(tag => tag.includes(name ?? ''));

    return HttpResponse.json(filteredTags);
  }),

  /** 검색페이지 특산주 이름 자동완성 API */
  http.get('/api/auto-complete/drink', async ({ request }) => {
    const url = new URL(request.url);
    const name = url.searchParams.get('name');
    const filteredDrinks = autoCompleteDrink.filter(drink => drink.includes(name ?? ''));

    return HttpResponse.json(filteredDrinks);
  }),

  /** 검색페이지 태그로 게시글 검색 API */
  http.post('/api/search/post/tags', async ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page')) || 0;
    const size = Number(url.searchParams.get('size')) || 10;
    const tags = (await request.json()) as string[];

    const filteredResults = searchByTag[0].content.filter(post =>
      post.tags.some(tag => tags.includes(tag.tagName.trim())),
    );

    const start = Number(page) * Number(size);
    const end = start + Number(size);
    const paginatedComments = filteredResults.slice(start, end);
    const totalElements = filteredResults.length;
    const totalPages = Math.ceil(totalElements / Number(size));

    return HttpResponse.json({
      totalElements,
      totalPages,
      size,
      number: page,
      content: paginatedComments,
    });
  }),

  /** 검색페이지 특산주 이름으로 게시글 검색 API */
  http.post('/api/search/post/drinks', async ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page')) || 0;
    const size = Number(url.searchParams.get('size')) || 10;
    const drink = url.searchParams.get('drink');

    if (!drink) {
      return HttpResponse.json({
        totalElements: 0,
        totalPages: 0,
        size,
        number: page,
        content: [],
      });
    }

    const filteredResults = searchByDrink[0].content.filter(post =>
      post.drink.name.includes(drink.trim()),
    );

    const start = Number(page) * Number(size);
    const end = start + Number(size);
    const paginatedComments = filteredResults.slice(start, end);
    const totalElements = filteredResults.length;
    const totalPages = Math.ceil(totalElements / Number(size));

    return HttpResponse.json({
      totalElements,
      totalPages,
      size,
      number: page,
      content: paginatedComments,
    });
  }),

  //** 마이페이지 API */
  http.post('/mypage', async () => {
    return HttpResponse.json({ member, tag });
  }),

  /** 마이페이지 회원정보수정 API */
  http.post('/mypage/edit', async () => {
    return HttpResponse.json({ specialtyDrink, member });
  }),

  /** 특산주 등록 신청 API */
  http.post('/api/drinks/registrations', async () => {
    return HttpResponse.json({ registrations, regions });
  }),

  /** 특산주 신청 목록 조회 API */
  http.get('/api/drinks/registrations', async ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('number')) || 0;
    const size = Number(url.searchParams.get('size')) || 10;

    const filteredRegistration = registrations.flatMap(registration => registration.content);

    // 페이지네이션
    const start = Number(page) * Number(size);
    const end = start + Number(size);
    const paginatedRegistrations = filteredRegistration.slice(start, end);
    const totalElements = filteredRegistration.length;
    const totalPages = Math.ceil(totalElements / Number(size));

    return HttpResponse.json({
      totalElements,
      totalPages,
      size,
      number: page,
      content: paginatedRegistrations,
    });
  }),

  /** 특산주 신청 글 조회 API */
  http.get('/api/drinks/registrations/:registId', async ({ params }) => {
    Number(params.registId);
    return HttpResponse.json(registrations);
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

  /** 공지사항 등록 API */
  http.post('/api/announcements', async ({ request }) => {
    const requestBody = (await request.json()) as AnnouncementRequestBody;

    const { title, content } = requestBody;

    const newAnnouncement: Announcement = {
      id: announcements.length + 1,
      memberId: 1,
      title: title,
      content: content,
      imageUrl: null,
      createdAt: new Date().toISOString(),
      updatedAt: null,
    };

    announcementData = [...announcementData, newAnnouncement];
    console.log(announcementData);
    return HttpResponse.json(newAnnouncement);
  }),

  /** 공지사항 수정 API */

  /** 공지사항 삭제 API */

  /** 공지사항 조회 API */
  http.get('/api/announcements', async ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('number')) || 0;
    const size = Number(url.searchParams.get('size')) || 10;

    const filteredAnnouncements = announcements.flatMap(announcement => announcement.content);

    // 페이지네이션
    const start = Number(page) * Number(size);
    const end = start + Number(size);
    const paginatedAnnouncements = filteredAnnouncements.slice(start, end);
    const totalElements = filteredAnnouncements.length;
    const totalPages = Math.ceil(totalElements / Number(size));

    return HttpResponse.json({
      totalElements,
      totalPages,
      size,
      number: page,
      content: paginatedAnnouncements,
    });
  }),
  http.get('/api/announcements/:id', async ({ params }) => {
    Number(params.id);
    return HttpResponse.json(announcements);
  }),

  /** 신고 제출 API */
  http.post('/api/declarations', async ({ request }) => {
    const requestBody = (await request.json()) as DeclarationRequestBody;

    const { link, type, content } = requestBody;

    const newDeclaration: Declaration = {
      id: declarations.length + 1,
      memberId: 1,
      memberName: '멤버 A',
      link: link,
      type: type,
      content: content,
      approved: null,
      createdAt: new Date().toISOString(),
    };

    declarationsData = [...declarationsData, newDeclaration];
    console.log(declarationsData);
    return HttpResponse.json(newDeclaration);
  }),

  /** 신고글 목록 조회 API */
  http.get('/api/declarations', async ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('number')) || 0;
    const size = Number(url.searchParams.get('size')) || 10;

    const filteredDeclarations = declarations.flatMap(declaration => declaration.content);

    // 페이지네이션
    const start = Number(page) * Number(size);
    const end = start + Number(size);
    const paginatedDeclarations = filteredDeclarations.slice(start, end);
    const totalElements = filteredDeclarations.length;
    const totalPages = Math.ceil(totalElements / Number(size));

    return HttpResponse.json({
      totalElements,
      totalPages,
      size,
      number: page,
      content: paginatedDeclarations,
    });
  }),

  /** 신고글 조회 API */
  http.get('/api/declarations/:declarationId', async ({ params }) => {
    Number(params.declarationId);
    return HttpResponse.json(declarations);
  }),

  /** 알림 API */
  http.get('/api/notifications', async () => {
    const filteredNotifications = notifications.flatMap(notification => notification.content);

    const size = 20;
    const number = 0;
    const paginatedNotifications = filteredNotifications.slice(0, size);
    const totalElements = Math.min(notifications.length, 20);
    const totalPages = 1;

    return HttpResponse.json({
      totalElements,
      totalPages,
      size,
      number,
      content: paginatedNotifications,
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

  /**회원가입 post Test  */
  http.post(`api/members/signup`, async ({ request }) => {
    const requestBody = await request.json();
    console.log(requestBody);
    return new Response();
  }),
];
