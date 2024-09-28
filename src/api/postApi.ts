import axios from 'axios';
import api from './axios';

/** 전체 게시글 조회 API */
export const fetchPostsApi = async (sortBy: string, page: number = 0, size: number = 10) => {
  try {
    const response = await api.get('/posts', {
      params: {
        page,
        size,
        sortBy,
      },
    });
    console.log('전체 게시글 받아와', response.data);
    return response.data;
  } catch (err) {
    console.error('Error fetching posts: ', err);
  }
};

/** 특정 게시글 상세 조회 API */
export const fetchPostsDetailApi = async (postId: number) => {
  try {
    const response = await api.get(`/posts/${postId}`);
    return response.data;
  } catch (err) {
    console.error('Error fetching postsDetail: ', err);
  }
};

/** 특정 게시글 댓글 작성 API */
export const fetchCommentWriteApi = async (postId: number, content: string) => {
  try {
    const response = await api.post(
      '/comments',
      {
        postId: postId,
        content: content,
        anonymous: false,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    return response.data;
  } catch (err) {
    console.error('Error fetching commentWrite: ', err);
  }
};

/** 특정 게시글 댓글 조회 API */
export const fetchCommentsApi = async (postId: number, page: number, size: number) => {
  try {
    const response = await api.get(`/${postId}/comments?number=${page}&size=${size}`);
    console.log('API response:', response.data);
    return response.data;
  } catch (err) {
    console.error('Error fetching comments: ', err);
  }
};

/** 검색페이지 태그 추천 API */
export const fetchSuggestedTagsApi = async () => {
  try {
    const response = await api.get('/suggest/tags');
    return response.data;
  } catch (err) {
    console.error('Error fetching suggestedTags: ', err);
  }
};

/** 검색페이지 특산주 이름 추천 API */
export const fetchSuggestedDrinksApi = async () => {
  try {
    const response = await api.get('/suggest/drinks');
    return response.data;
  } catch (err) {
    console.error('Error fetching suggestedDrinks: ', err);
  }
};

/** 검색페이지 태그 자동완성 API */
export const fetchAutoCompleteTagApi = async (name: string) => {
  try {
    const response = await api.get(`/auto-complete/tag?name=${name}`);
    return response.data;
  } catch (err) {
    console.error('Error fetching autoCompleteTag: ', err);
  }
};

/** 검색페이지 특산주 이름 자동완성 API */
export const fetchAutoCompleteDrinkApi = async (name: string) => {
  try {
    const response = await api.get(`/auto-complete/drink?name=${name}`);
    return response.data;
  } catch (err) {
    console.error('Error fetching autoCompleteDrink: ', err);
  }
};

/** 검색페이지 태그로 게시글 검색 API */
export const fetchTagResultsApi = async (tagNames: string[], page: number, size: number) => {
  try {
    const response = await api.post(`/search/post/tags?page=${page}&size=${size}`, tagNames, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (err) {
    console.error('Error fetching tagResults: ', err);
  }
};

/** 검색페이지 특산주 이름으로 게시글 검색 API */
export const fetchDrinkResultsApi = async (drink: string, page: number, size: number) => {
  try {
    const response = await api.post(`/search/post/drinks?drink=${drink}&page=${page}&size=${size}`);
    return response.data;
  } catch (err) {
    console.error('Erro fetching DrinkResults: ', err);
  }
};

/** Kakao 맵 api */
export const getAddress = async (latitude: number | null, longitude: number | null) => {
  const apiKey = 'f21248c02fc4d05f9ce83b60e063d55d';
  const url = `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${longitude}&y=${latitude}`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `KakaoAK ${apiKey}`,
      },
    });
    const data = await response.json();

    if (data.documents && data.documents.length > 0) {
      const address = data.documents[0].address.address_name;
      return address;
    } else {
      throw new Error('Geocoding failed');
    }
  } catch (error) {
    console.error('Error fetching address:', error);
  }
};

//** 특산주 등록 신청 */
export const fetchRegistrationWriteApi = async (
  regionId: number,
  drinkName: string,
  type: string,
  degree: number,
  sweetness: number,
  cost: number,
  description: string,
  imageUrl: string,
) => {
  try {
    console.log('API 함수가 호출되었습니다.');
    console.log('전송할 데이터:', {
      regionId,
      drinkName,
      type,
      degree,
      sweetness,
      cost,
      description,
      imageUrl,
    });
    const response = await api.post(
      '/drinks/registrations',
      {
        regionId: regionId,
        drinkName: drinkName,
        type: type,
        degree: degree,
        sweetness: sweetness,
        cost: cost,
        description: description,
        imageUrl: imageUrl,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    console.log(response);
    return response;
  } catch (error) {
    console.error('Error fetching registrationWrite: ', error);
  }
};

//** 특산주 신청 목록 조회 API */
export const fetchRegistrationsApi = async (page: number, size: number) => {
  try {
    const response = await api.get(`/drinks/registrations?page=${page}&size=${size}`);
    console.log(response);
    return response.data;
  } catch (err) {
    console.error('Error fetching specialtyDrink: ', err);
  }
};

//** 특산주 신청 글 조회 API */
export const fetchRegistrationsDetailApi = async (id: number) => {
  try {
    const response = await api.get(`/drinks/registrations/${id}`);
    console.log(response);
    return response.data;
  } catch (err) {
    console.error('Error fetching specialtyDrink: ', err);
  }
};

/** 공지사항 등록 API */
export const fetchAnnouncementWriteApi = async (title: string, content: string) => {
  try {
    const response = await api.post(
      '/announcements',
      {
        title: title,
        content: content,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching declarationWrite: ', error);
  }
};

/** 공지사항 수정 API */
export const fetchAnnouncementModify = async (id: number, title: string, content: string) => {
  try {
    const response = await api.put(`/announcements/${id}`, {
      title,
      content,
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error modifying announcement: ', error);
  }
};

/** 공지사항 삭제 API */
export const fetchAnnouncementDelete = async (id: number) => {
  try {
    const response = await api.delete(`/announcements/${id}`);
    console.log(response);
    return response.data;
  } catch (error) {
    console.error('Error deleting announcement: ', error);
  }
};

/** 공지사항 조회 API */
export const fetchAnnouncementApi = async (page: number, size: number) => {
  try {
    const response = await api.get(`/announcements?page=${page}&size=${size}`);
    return response.data;
  } catch (err) {
    console.error('Error fetching announcements: ', err);
  }
};
export const fetchAnnouncementDetailApi = async (id: number) => {
  try {
    const response = await api.get(`/announcements/${id}`);
    return response.data;
  } catch (err) {
    console.error('Error fetching announcements: ', err);
  }
};

/** 신고 제출 API */
export const fetchDeclarationsWriteApi = async (
  postLink: string,
  type: string,
  content: string,
) => {
  try {
    const response = await api.post(
      '/declarations',
      {
        link: postLink,
        type: type,
        content: content,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching declarationWrite: ', error);
  }
};

/** 신고글 목록 조회 API */
export const fetchDeclarationsApi = async (page: number, size: number) => {
  try {
    const response = await api.get(`/declarations?page=${page}&size=${size}`);
    return response.data;
  } catch (err) {
    console.error('Error fetching declarations: ', err);
  }
};

/** 신고글 조회 API */
export const fetchDeclarationsDetailApi = async (declarationId: number) => {
  try {
    const response = await api.get(`/declarations/${declarationId}`);
    return response.data;
  } catch (err) {
    console.error('Error fetching declarations: ', err);
  }
};

/** 알림 API */
export const fetchNotificationsApi = async () => {
  try {
    const response = await api.get(`/notifications`);
    return response.data;
  } catch (err) {
    console.error('Error fetching notifications: ', err);
  }
};

/** 이미지 업로드 API */
export const fetchImageUploadApi = async (file: File) => {
  const formData = new FormData();
  formData.append('multipartFile', file);

  try {
    const response = await api.post(`/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log(response);
    return response.data;
  } catch (err) {
    console.error('Error fetching image: ', err);
  }
};

/** 지역 목록 조회 API */
export const fetchRegionApi = async () => {
  try {
    const response = await axios.get(`/api/regions`);
    return response.data;
  } catch (err) {
    console.error('Error fetching regions: ', err);
  }
};

/** 회원정보 조회 API */
export const fetchMemberApi = async () => {
  try {
    const response = await api.get(`/members`);

    return response.data;
  } catch (err) {
    console.error('Error fetching members: ', err);
  }
};

/** 회원정보 수정 API */
export const fetchMemberWriteApi = async (
  id: number,
  name: string,
  favorDrink: string[],
  alarmEnabled: boolean,
) => {
  try {
    const response = await axios.post(
      '/api/members',
      {
        id: id,
        name: name,
        favorDrink: favorDrink,
        alarmEnabled: alarmEnabled,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching memberWrite: ', error);
  }
};

/** 태그 팔로우 추가 API */
export const fetchTagAddApi = async (tagId: number, tagName: string) => {
  try {
    const response = await axios.post(
      '/api/tags/follows',
      {
        tagId: tagId,
        tagName: tagName,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching tagAdd: ', error);
  }
};

/** 태그 팔로우 목록 조회 API */
export const fetchTagApi = async () => {
  try {
    const response = await axios.get(`/api/members/tags/follows`);
    return response.data;
  } catch (err) {
    console.error('Error fetching tags: ', err);
  }
};

/** 태그 팔로우 삭제 API */
