import { delay, http, HttpResponse } from 'msw';
import cardItem from './data/cardItem.json';
import cardItemDetail from './data/cardItemDetail.json';
import regions from './data/regions.json';
import comments from './data/comments.json';
import commentWrite from './data/commentWrite.json';
import { Comment, CommentRequestBody } from '@/types/comment';
import member from './data/member.json';
import tag from './data/tag.json';
import { Tag, TagRequestBody } from '@/types/tag';
import announcements from './data/announcement.json';
import announcementWrite from './data/announcementWrite.json';
import { Announcement, AnnouncementRequestBody } from '@/types/announcement';
import declarations from './data/report.json';
import declarationWrite from './data/reportWrite.json';
import { Declaration, DeclarationRequestBody } from '@/types/declaration';
import suggestedTags from './data/suggestedTags.json';
import suggestedDrinks from './data/suggestedDrinks.json';
import searchByTag from './data/searchByTag.json';
import searchByDrink from './data/searchByDrink.json';
import notifications from './data/notification.json';
import searchDrink from './data/searchDrink.json';
import registrations from './data/registration.json';
import registrationWrite from './data/registrationWrite.json';
import { Registration, RegistrationRequestBody } from '@/types/registration';

const mockJwtToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

let commentsData: Comment[] = [...commentWrite];
let announcementData: Announcement[] = [...announcementWrite];
let declarationsData: Declaration[] = [...declarationWrite];
let registrationData: Registration[] = [...registrationWrite];
let tagData: Tag[] = [...tag];

export const handlers = [
  /** 로그인 테스트  */
  http.post('/api/members/signin', async ({ request }) => {
    const { email, password } = (await request.json()) as { email: string; password: string };

    if (email !== 'man@naver.com' && password !== 'man123456') {
      return HttpResponse.json({ accessToken: mockJwtToken, refreshToken: mockJwtToken });
    } else {
      throw new HttpResponse(null, {
        status: 403,
      });
    }
  }),

  /** 전체 게시글 조회 */
  http.get('api/posts', async () => {
    return HttpResponse.json({
      content: [...cardItem.slice(0, 10)],
      pageable: {
        pageNumber: 0,
        pageSize: 10,
        sort: {
          empty: true,
          sorted: false,
          unsorted: true,
        },
        offset: 0,
        paged: true,
        unpaged: false,
      },
      last: true,
      totalPages: 1,
      totalElements: 20,
      first: true,
      size: 10,
      number: 0,
      sort: {
        empty: true,
        sorted: false,
        unsorted: true,
      },
      numberOfElements: 1,
      empty: false,
    });
  }),

  /** 특정 게시글 조회 */
  http.get('/api/post/:postId', async ({ params }) => {
    return HttpResponse.json(cardItemDetail[Number(params.postId) - 1]);
  }),

  /** 특정 게시글 댓글 작성 */
  http.post('/api/comments', async ({ request }) => {
    const requestBody = (await request.json()) as CommentRequestBody;

    const { postId, content, anonymous } = requestBody;

    const newComment: Comment = {
      id: comments.length + 1,
      memberId: 10,
      memberName: '멤버 A',
      postId: postId,
      content: content,
      anonymous: anonymous,
      createdAt: new Date().toISOString(),
      updatedAt: null,
    };

    commentsData = [...commentsData, newComment];

    return HttpResponse.json(newComment);
  }),

  /** 특정 게시글 댓글 조회 */
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

  /** 검색페이지 태그 추천 */
  http.get('api/suggest/tags', async () => {
    return HttpResponse.json(suggestedTags);
  }),

  /** 검색페이지 특산주 이름 추천 */
  http.get('api/suggest/drinks', async () => {
    return HttpResponse.json(suggestedDrinks);
  }),

  /** 검색페이지 태그 자동완성 */
  http.get('/api/auto-complete/tag', async () => {
    return HttpResponse.json(['msw mock', '고소', '풍미', '달달']);
  }),

  /** 검색페이지 특산주 이름 자동완성 */
  http.get('/api/auto-complete/drink', async () => {
    return HttpResponse.json(['msw mock', '미나리싱싱주', '독산 30', '참주가 서해밤바다']);
  }),

  /** 검색페이지 태그로 게시글 검색 */
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

  /** 검색페이지 특산주 이름으로 게시글 검색 */
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

  /** 회원정보 조회 */
  http.get('/api/members', async () => {
    return HttpResponse.json(member[1]);
  }),

  /** 회원정보 수정 */
  http.post('/api/members', async () => {
    return HttpResponse.json('member');
  }),
  http.put('/api/members/profile', () => {
    return new Response();
  }),

  /** 태그 팔로우 목록 조회 */
  http.get('/api/members/tags/follows', async () => {
    return HttpResponse.json(tag);
  }),

  /** 태그 팔로우 추가 */
  http.post('/api/tags/follows', async ({ request }) => {
    const requestBody = (await request.json()) as TagRequestBody;

    const { tagName } = requestBody;

    const addTag: Tag = {
      id: 1,
      memberId: 1,
      memberName: 'John',
      tagId: tag.length + 1,
      tagName: tagName,
    };
    tagData = [...tagData, addTag];

    return HttpResponse.json(addTag);
  }),

  /** 특산주 등록 신청 */
  http.post('/drinks/registrations', async ({ request }) => {
    const requestBody = (await request.json()) as RegistrationRequestBody;

    const { regionId, drinkName, type, degree, sweetness, cost, description, imageUrl } =
      requestBody;

    const region = regions.find(r => r.regionId === regionId);
    const placeName = region ? region.placeName : 'Unknown';

    const newRegistration: Registration = {
      id: registrations.length + 1,
      memberId: 1,
      memberName: '멤버 A',
      placeName: placeName,
      drinkName: drinkName,
      type: type,
      degree: degree,
      sweetness: sweetness,
      cost: cost,
      description: description,
      imageUrl: imageUrl,
      createdAt: new Date().toISOString(),
      approved: null,
    };

    registrationData = [...registrationData, newRegistration];
    console.log(registrationData);
    return HttpResponse.json(newRegistration);
  }),

  /** 특산주 신청 목록 조회 */
  http.get('/api/drinks/registrations', async ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('number')) || 0;
    const size = Number(url.searchParams.get('size')) || 10;

    const filteredRegistration = registrations.flatMap(registration => registration.content);

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

  /** 특산주 신청 글 조회 */
  http.get('/api/drinks/registrations/:id', async ({ params }) => {
    Number(params.id);
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

  /** 공지사항 등록 */
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

  /** 공지사항 조회 */
  http.get('/api/announcements', async ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('number')) || 0;
    const size = Number(url.searchParams.get('size')) || 10;

    const filteredAnnouncements = announcements.flatMap(announcement => announcement.content);

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

  /** 신고 제출 */
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

  /** 신고글 목록 조회 */
  http.get('/api/declarations', async ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('number')) || 0;
    const size = Number(url.searchParams.get('size')) || 10;

    const filteredDeclarations = declarations.flatMap(declaration => declaration.content);

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

  /** 신고글 조회 */
  http.get('/api/declarations/:declarationId', async ({ params }) => {
    Number(params.declarationId);
    return HttpResponse.json(declarations);
  }),

  /** 알림 */
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

  /** 지역 목록 조회*/
  http.get('/api/regions', async () => {
    return HttpResponse.json(regions);
  }),

  /** 아이디 중복 검사 */
  http.get('/api/members/email/:email/validation', async ({ params }) => {
    const { email } = params;

    await delay(800);

    if (email === 'man@naver.com') {
      throw new HttpResponse(null, {
        status: 401,
      });
    }

    return HttpResponse.json({
      message: '사용 가능한 아이디 입니다.',
    });
  }),
  /** 데일리 추천 */
  http.get(`/api/suggest/drink`, () => {
    return HttpResponse.json({
      id: 1,
      placeName: '서울특별시',
      name: '독산 30',
      type: 'LIQUEUR',
      degree: 30,
      sweetness: 5,
      cost: 30000,
      averageRating: null,
      description: '초콜릿으로 만든 맥주',
      imageUrl: 'https://thesool.com/common/imageView.do?targetId=PR00000957&targetNm=PRODUCT',
      createdAt: '2024-09-26T02:17:18.562793',
    });
  }),

  /**회원가입  */
  http.post(`/api/members/signup`, async () => {
    return new Response();
  }),

  /** 특산주 찾기 */
  http.get(`/api/search/drinks`, ({ request }) => {
    const requestUrl = new URL(request.url);
    const page = requestUrl.searchParams.get('page');

    if (page === '0') {
      return HttpResponse.json({
        ...searchDrink[0],
      });
    } else {
      return new HttpResponse(null, {
        status: 403,
      });
    }
  }),

  /** 이미지 링크 반환 */
  http.post(`/api/image`, () => {
    return HttpResponse.json(
      'https://thesool.com/common/imageView.do?targetId=PR00000941&targetNm=PRODUCT',
    );
  }),

  /** 게시글 작성 */
  http.post('/api/posts', async () => {
    return new Response();
  }),
];
