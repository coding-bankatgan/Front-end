import axios from 'axios';

/** 전체 게시글 조회 API */
export const fetchPostsApi = async () => {
  try {
    const response = await axios.get('api/posts');
    return response.data;
  } catch (err) {
    console.error('Error fetching posts: ', err);
  }
};

/** 특정 게시글 상세 조회 API */
export const fetchPostsDetailApi = async (postId: number) => {
  try {
    const response = await axios.get(`api/posts/${postId}`);
    return response.data;
  } catch (err) {
    console.error('Error fetching postsDetail: ', err);
  }
};

/** 특정 게시글 댓글 작성 API */
export const fetchCommentWriteApi = async (postId: number, content: string) => {
  try {
    const response = await axios.post(
      'api/comments',
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
    const response = await axios.get(`/api/${postId}/comments?number=${page}&size=${size}`);
    console.log('API response:', response.data);
    return response.data;
  } catch (err) {
    console.error('Error fetching comments: ', err);
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

//** 특산주 신청 목록 조회 API */
export const fetchRegistrationsApi = async (page: number, size: number) => {
  try {
    const response = await axios.get(`/api/drinks/registrations?page=${page}&size=${size}`);
    console.log('api', response.data);
    return response.data;
  } catch (err) {
    console.error('Error fetching specialtyDrink: ', err);
  }
};

//** 특산주 신청 글 조회 API */
export const fetchRegistrationsDetailApi = async (registId: number) => {
  try {
    const response = await axios.get(`/api/drinks/registrations/${registId}`);
    console.log('api', response.data);
    return response.data;
  } catch (err) {
    console.error('Error fetching specialtyDrink: ', err);
  }
};

//** 회원정보 조회 API */
export const fetchMembers = async () => {
  try {
    const response = await axios.get(`/api/members`);
    return response.data;
  } catch (err) {
    console.error('Error fetching member: ', err);
  }
};

/** 공지사항 조회 API */
export const fetchAnnouncementApi = async (page: number, size: number) => {
  try {
    const response = await axios.get(`/api/announcements?page=${page}&size=${size}`);
    return response.data;
  } catch (err) {
    console.error('Error fetching announcements: ', err);
  }
};
export const fetchAnnouncementDetailApi = async (id: number) => {
  try {
    const response = await axios.get(`/api/announcements/${id}`);
    return response.data;
  } catch (err) {
    console.error('Error fetching announcements: ', err);
  }
};

/** 공지사항 등록 API */
export const fetchAnnouncementWriteApi = async (
  title: string,
  content: string,
  imageUrl: string,
) => {
  try {
    const response = await axios.post(
      '/api/announcements',
      {
        title: title,
        content: content,
        imageUrl: imageUrl,
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

/** 신고 제출 API */
export const fetchDeclarationsWriteApi = async (
  postLink: string,
  type: string,
  content: string,
) => {
  try {
    const response = await axios.post(
      '/api/declarations',
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
    const response = await axios.get(`/api/declarations?page=${page}&size=${size}`);
    return response.data;
  } catch (err) {
    console.error('Error fetching declarations: ', err);
  }
};

/** 신고글 조회 API */
export const fetchDeclarationsDetailApi = async (declarationId: number) => {
  try {
    const response = await axios.get(`/api/declarations/${declarationId}`);
    return response.data;
  } catch (err) {
    console.error('Error fetching declarations: ', err);
  }
};

/** 알림 API */
export const fetchNotificationsApi = async () => {
  try {
    const response = await axios.get(`/api/notifications`);
    return response.data;
  } catch (err) {
    console.error('Error fetching notifications: ', err);
  }
};
